import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { addExistingSurvey, getRecentUpdates } from "@/data/apps-script/calls"
import { fetchAccessToken } from '@/features/auth/serverAuthZ';
import { adminAuth, adminDb } from "@/config/firebaseAdminConfig";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { GoogleFormResponse, isGoogleFormResponseStudentEmail, isGoogleFormResponseStudentId, isGoogleFormResponseUnidentified } from "@/types/apps-script-types";
import { Collection, Document } from "@/data/firestore/utils";
import { PendingAssignmentID, SurveyResponseStudentEmail, SurveyResponseStudentEmailID, SurveyResponseStudentId, SurveyResponseUnidentified } from "@/types/survey-types";
import { v4 as uuid } from "uuid";
import { onCall, onRequest } from "firebase-functions/https";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/firestore";
import moment from "moment";
import { StudentCustomClaims, StudentDecodedIdTokenWithCustomClaims } from "@/types/auth-types";

const addResponsesToFirestore = async (responses: GoogleFormResponse[], transaction: Transaction) => {
  const surveysCollection = adminDb.collection(Collection.SURVEYS);

  const idResponses = responses.filter(isGoogleFormResponseStudentId);
  const existingDocs = await Promise.all(
    idResponses.map(response => transaction.get(adminDb.collection(Collection.SURVEYS).doc(response.surveyId).collection(Collection.ASSIGNMENTS).where('studentId', '==', response.studentId).where('surveyId', '==', response.surveyId).where('responseId', '==', null).limit(1)))
  );
  idResponses.forEach((response, index) => {
    existingDocs[index].empty ? transaction.set(surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid()), {
      studentId: response.studentId,
      responseId: response.responseId,
      submittedAt: response.submittedAt
    } as SurveyResponseStudentId) : transaction.update(existingDocs[index].docs[0].ref, { responseId: response.responseId, submittedAt: response.submittedAt });
  });

  const unidentifiedResponses = responses.filter(isGoogleFormResponseUnidentified);
  unidentifiedResponses.forEach(response => transaction.set(surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid()), {
    responseId: response.responseId,
    submittedAt: response.submittedAt,
  } as SurveyResponseUnidentified))

  const emailResponses = responses.filter(isGoogleFormResponseStudentEmail);
  const { users } = await adminAuth.getUsers([...new Set(emailResponses.map(response => response.studentEmail))].map(email => ({ email })));
  const emailIds: { [email: string]: string } = {};
  users.forEach(user => emailIds[user.email!] = user.uid);
  emailResponses.forEach(response => {
    const docRef = surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid());
    emailIds[response.studentEmail] ? transaction.set(docRef, {
      studentId: emailIds[response.studentEmail],
      responseId: response.responseId,
      submittedAt: response.submittedAt,
    } as SurveyResponseStudentId) : transaction.set(docRef, {
      studentEmail: response.studentEmail,
      responseId: response.responseId,
      submittedAt: response.submittedAt,
    } as SurveyResponseStudentEmail);
  })
}

const handleRecentUpdatesCallback = async (e: ScheduledEvent) => {
  const endTime = e.scheduleTime;
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const tokenData = await fetchAccessToken(adminUser.customClaims?.googleTokens?.refreshToken || '');

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const { lastUpdated } = (await transaction.get(adminDb.collection(Collection.METADATA).doc(Document.LAST_UPDATED))).data() || {};
    const surveyIds = await getAllSurveyIds(transaction);
    const { surveys, responses } = await getRecentUpdates(tokenData.accessToken, surveyIds, endTime, lastUpdated);
    const surveysCollection = adminDb.collection(Collection.SURVEYS);
    await addResponsesToFirestore(responses, transaction);
    surveys.forEach(survey => transaction.update(surveysCollection.doc(survey.id), {
      name: survey.name,
      description: survey.description,
    }));
    transaction.update(adminDb.collection(Collection.METADATA).doc(Document.LAST_UPDATED), { timestamp: endTime })
  })
}
export const handleRecentUpdates = onSchedule('every day 00:00', handleRecentUpdatesCallback);
export const testHandleRecentUpdates = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send("Method Not Allowed");
    return;
  }
  await handleRecentUpdatesCallback({ scheduleTime: req.body.scheduleTime || new Date().toISOString() });
  res.send("Test successful");
});

export const addExistingSurveyAndResponses = onCall(async (req) => {
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const tokenData = await fetchAccessToken(adminUser.customClaims?.googleTokens?.refreshToken || '');
  return await adminDb.runTransaction(async (transaction: Transaction) => {
    const { lastUpdated } = (await transaction.get(adminDb.collection(Collection.METADATA).doc(Document.LAST_UPDATED))).data() || {};
    const { survey, responses } = await addExistingSurvey(tokenData.accessToken, req.data, lastUpdated);
    const { id, ...surveyData } = survey;
    await addResponsesToFirestore(responses, transaction);
    transaction.set(adminDb.collection(Collection.SURVEYS).doc(id), surveyData);
    return survey;
  })
});

export const assignSurveys = onCall(async (req) => {
  const { studentIds, surveyIds }: { studentIds: string[]; surveyIds: string[]; } = req.data;
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const timestamp = moment();
    const surveysCollection = adminDb.collection(Collection.SURVEYS);

    const promises: Promise<FirebaseFirestore.QuerySnapshot>[] = [];
    surveyIds.forEach(surveyId =>
      studentIds.forEach(studentId =>
        promises.push(transaction.get(surveysCollection.doc(surveyId).collection(Collection.ASSIGNMENTS).where('studentId', '==', studentId).where('responseId', '==', null).limit(1)))
      )
    );
    const existingDocs = (await Promise.all(promises)).filter(snapshot => !snapshot.empty).map(snapshot => ({
      id: snapshot.docs[0].id,
      surveyId: snapshot.docs[0].ref.parent.parent!.id,
      ...snapshot.docs[0].data()
    } as PendingAssignmentID));

    const assignmentsToCreate: PendingAssignmentID[] = [];
    surveyIds.forEach(surveyId => {
      studentIds.forEach(studentId => {
        if (!existingDocs.some(doc => doc.studentId === studentId && doc.surveyId === surveyId)) {
          assignmentsToCreate.push({
            id: uuid(),
            surveyId,
            studentId,
            assignedAt: timestamp.toISOString(),
            responseId: null
          } as PendingAssignmentID);
        }
      })
    });
    assignmentsToCreate.forEach(assignment => {
      const { id, surveyId, ...data } = assignment;
      transaction.set(surveysCollection.doc(surveyId).collection(Collection.ASSIGNMENTS).doc(id), data);
    })
  });
})

export const onStudentAccountCreated = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  } else if (req.auth.token.role !== 'STUDENT') {
    throw new Error("Only STUDENT role can create student accounts")
  } else if (req.auth.token.studentId) {
    throw new Error("Student account already exists for this user");
  }

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docs = (await transaction.get(adminDb.collectionGroup(Collection.ASSIGNMENTS).where('studentEmail', '==', req.auth!.token.email!))).docs.map(doc => ({ id: doc.id, surveyId: doc.ref.parent.parent!.id, ...doc.data() } as SurveyResponseStudentEmailID));
    const surveysCollectionRef = adminDb.collection(Collection.SURVEYS);
    const updates = { studentId: req.data, studentEmail: FieldValue.delete() }
    await Promise.all(docs.map(doc => transaction.update(surveysCollectionRef.doc(doc.surveyId).collection(Collection.ASSIGNMENTS).doc(doc.id), updates)));
  });

  const decodedToken = req.auth.token as StudentDecodedIdTokenWithCustomClaims
  await adminAuth.setCustomUserClaims(req.auth?.uid, {
    role: decodedToken.role,
    studentId: req.data,
  } as StudentCustomClaims);
});

async function getAllSurveyIds(transaction: Transaction): Promise<string[]> {
  const collectionRef = adminDb.collection(Collection.ADMIN_DATA).doc(Document.SURVEYS).collection(Collection.SURVEYS);
  const count = (await transaction.get(collectionRef.count())).data().count;
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(transaction.get(collectionRef.doc(i.toString())));
  }
  const surveyIds = (await Promise.all(promises)).flatMap(doc => Object.keys(doc.data() || {}));
  return surveyIds;
}

const addDocToAdminData = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string, docData: any, transaction: Transaction, count?: number) => {
  if (!count) {
    count = (await transaction.get(collectionRef.count())).data().count;
  }
  for (let i = count - 1; i >= 0; i--) {
    try {
      await transaction.update(collectionRef.doc(i.toString()), { [docId]: docData });
      return;
    } catch (error) { }
  }
  await transaction.set(collectionRef.doc(count.toString()), { [docId]: docData });
}

const updateAdminDataOnDocCreated = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string, docData: any) => {
  await adminDb.runTransaction(async (transaction: Transaction) => {
    await addDocToAdminData(collectionRef, docId, docData, transaction);
  });
}

const updateAdminDataOnDocUpdated = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string, docData: any) => {
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docNum = (await transaction.get(collectionRef.orderBy(docId).limit(1))).docs[0]?.id;
    const count = (await transaction.get(collectionRef.count())).data().count;
    if (!docNum) {
      await addDocToAdminData(collectionRef, docId, docData, transaction, count);
      return;
    }
    try {
      await transaction.update(collectionRef.doc(docNum), { [docId]: docData });
    } catch (error) {
      await transaction.update(collectionRef.doc(docNum), { [docId]: FieldValue.delete() });
      await addDocToAdminData(collectionRef, docId, docData, transaction, count);
    }
  });
}

const updateAdminDataOnDocDeleted = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string) => {
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docNum = (await collectionRef.orderBy(docId).limit(1).get()).docs[0]?.id;
    if (!docNum) { return; }
    await transaction.update(collectionRef.doc(docNum), { [docId]: FieldValue.delete() });
  });
}

export const onSurveyDocCreated = onDocumentCreated('/surveys/{surveyId}', async (event) =>
  await updateAdminDataOnDocCreated(
    adminDb.collection(Collection.ADMIN_DATA).doc(Document.SURVEYS).collection(Collection.SURVEYS),
    event.params.surveyId,
    event.data?.data()
  )
);

export const onSurveyDocUpdated = onDocumentUpdated('/surveys/{surveyId}', async (event) =>
  await updateAdminDataOnDocUpdated(
    adminDb.collection(Collection.ADMIN_DATA).doc(Document.SURVEYS).collection(Collection.SURVEYS),
    event.params.surveyId,
    event.data?.after.data()
  )
);

export const onSurveyDocDeleted = onDocumentDeleted('/surveys/{surveyId}', async (event) => {
  const surveyId = event.params.surveyId;
  await Promise.all([
    adminDb.recursiveDelete(adminDb.collection(Collection.SURVEYS).doc(surveyId).collection(Collection.ASSIGNMENTS)),
    updateAdminDataOnDocDeleted(
      adminDb.collection(Collection.ADMIN_DATA).doc(Document.SURVEYS).collection(Collection.SURVEYS),
      surveyId
    )
  ]);
});

export const onStudentDocCreated = onDocumentCreated('/students/{studentId}', async (event) =>
  await updateAdminDataOnDocCreated(
    adminDb.collection(Collection.ADMIN_DATA).doc(Document.STUDENTS).collection(Collection.STUDENTS),
    event.params.studentId,
    event.data?.data()
  )
);

export const onStudentDocUpdated = onDocumentUpdated('/students/{studentId}', async (event) =>
  await updateAdminDataOnDocUpdated(
    adminDb.collection(Collection.ADMIN_DATA).doc(Document.STUDENTS).collection(Collection.STUDENTS),
    event.params.studentId,
    event.data?.after.data()
  )
);

export const onStudentDocDeleted = onDocumentDeleted('/students/{studentId}', async (event) =>
  await updateAdminDataOnDocDeleted(
    adminDb.collection(Collection.ADMIN_DATA).doc(Document.STUDENTS).collection(Collection.STUDENTS),
    event.params.studentId
  )
);