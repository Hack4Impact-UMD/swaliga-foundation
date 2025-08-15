import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { addExistingSurvey, getRecentUpdates } from "@/data/apps-script/calls"
import { fetchAccessToken } from '@/features/auth/serverAuthZ';
import { adminAuth, adminDb } from "@/config/firebaseAdminConfig";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { GoogleFormResponse, isGoogleFormResponseStudentEmail, isGoogleFormResponseStudentId, isGoogleFormResponseUnidentified } from "@/types/apps-script-types";
import { Collection } from "@/data/firestore/utils";
import { PendingAssignmentID, SurveyResponseStudentEmail, SurveyResponseStudentId, SurveyResponseUnidentified } from "@/types/survey-types";
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
    const { surveyIds, timestamp } = (await transaction.get(adminDb.collection(Collection.METADATA).doc('surveyIds'))).data() || {};
    const { surveys, responses } = await getRecentUpdates(tokenData.accessToken, surveyIds, endTime, timestamp);
    const surveysCollection = adminDb.collection(Collection.SURVEYS);
    await addResponsesToFirestore(responses, transaction);
    surveys.forEach(survey => transaction.update(surveysCollection.doc(survey.id), {
      name: survey.name,
      description: survey.description,
    }));
    transaction.update(adminDb.collection(Collection.METADATA).doc('surveyIds'), { timestamp: endTime })
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

export const addExistingSurveyAndResponses = onCall(async (data) => {
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const tokenData = await fetchAccessToken(adminUser.customClaims?.googleTokens?.refreshToken || '');
  return await adminDb.runTransaction(async (transaction: Transaction) => {
    const { timestamp } = (await transaction.get(adminDb.collection(Collection.METADATA).doc('surveyIds'))).data() || {};
    const { survey, responses } = await addExistingSurvey(tokenData.accessToken, data.data, timestamp);
    const { id, ...surveyData } = survey;
    await addResponsesToFirestore(responses, transaction);
    transaction.set(adminDb.collection(Collection.SURVEYS).doc(id), surveyData);
    return survey;
  })
});

export const assignSurveys = onCall(async (data) => {
  const { studentIds, surveyIds }: { studentIds: string[]; surveyIds: string[]; } = data.data;
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

export const setStudentId = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  } else if (req.auth.token.role !== 'STUDENT') {
    throw new Error("Only STUDENT role can have a studentId")
  }

  const decodedToken = req.auth.token as StudentDecodedIdTokenWithCustomClaims
  await adminAuth.setCustomUserClaims(req.auth?.uid, {
    role: decodedToken.role,
    studentId: req.data,
  } as StudentCustomClaims);
});

export const onSurveyDocCreated = onDocumentCreated('/surveys/{surveyId}', async (event) => {
  const surveyId = event.params.surveyId;
  const doc = event.data?.data();
  await adminDb.runTransaction(async (transaction: Transaction) => {
    await addSurveyToAdminData(surveyId, doc, transaction);
  })
});

async function addSurveyToAdminData(docId: string, doc: any, transaction: Transaction, count?: number) {
  const collectionRef = adminDb.collection(Collection.ADMIN_DATA).doc('surveys').collection(Collection.SURVEYS);
  if (!count) {
    count = (await transaction.get(collectionRef.count())).data().count;
  }
  for (let i = count - 1; i >= 0; i--) {
    try {
      await transaction.set(collectionRef.doc(i.toString()), { [docId]: doc }, { merge: true });
      return;
    } catch (error) { }
  }
  await transaction.set(collectionRef.doc(count.toString()), { [docId]: doc }, { merge: true });
}

export const onSurveyDocUpdated = onDocumentUpdated('/surveys/{surveyId}', async (event) => {
  const surveyId = event.params.surveyId;
  const afterDoc = event.data?.after.data();
  const collectionRef = adminDb.collection(Collection.ADMIN_DATA).doc('surveys').collection(Collection.SURVEYS);
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docNum = (await transaction.get(collectionRef.orderBy(surveyId).limit(1))).docs[0]?.id;
    const count = (await transaction.get(collectionRef.count())).data().count;
    if (!docNum) {
      await addSurveyToAdminData(surveyId, afterDoc, transaction, count);
      return;
    }
    try {
      await transaction.set(collectionRef.doc(docNum), { [surveyId]: afterDoc }, { merge: true });
    } catch (error) {
      await transaction.set(collectionRef.doc(docNum), { [surveyId]: FieldValue.delete() }, { merge: true });
      await addSurveyToAdminData(surveyId, afterDoc, transaction, count);
    }
  });
});

export const onSurveyDocDeleted = onDocumentDeleted('/surveys/{surveyId}', async (event) => {
  const surveyId = event.params.surveyId;
  adminDb.recursiveDelete(adminDb.collection(Collection.SURVEYS).doc(surveyId));
  const collectionRef = adminDb.collection(Collection.ADMIN_DATA).doc('surveys').collection(Collection.SURVEYS);
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docNum = (await collectionRef.orderBy(surveyId).limit(1).get()).docs[0]?.id;
    if (!docNum) { return; }
    await transaction.set(collectionRef.doc(docNum), { [surveyId]: FieldValue.delete() }, { merge: true });
  });
});