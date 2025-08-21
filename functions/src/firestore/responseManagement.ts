import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { addExistingSurvey, getRecentUpdates } from "@/data/apps-script/calls"
import { fetchAccessToken } from '@/features/auth/serverAuthZ';
import { GoogleFormResponse, GoogleFormResponseStudentId, isGoogleFormResponseStudentId, isGoogleFormResponseUnidentified } from "@/types/apps-script-types";
import { SurveyResponseStudentEmail, SurveyResponseStudentId, SurveyResponseUnidentified } from "@/types/survey-types";
import { onCall, onRequest } from "firebase-functions/https";
import { Transaction } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/config/firebaseAdminConfig";
import { Collection, Document } from "@/data/firestore/utils";
import { v4 as uuid } from "uuid";

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

async function getAllStudentIds(transaction: Transaction): Promise<string[]> {
  const collectionRef = adminDb.collection(Collection.ADMIN_DATA).doc(Document.STUDENTS).collection(Collection.STUDENTS);
  const count = (await transaction.get(collectionRef.count())).data().count;
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(transaction.get(collectionRef.doc(i.toString())));
  }
  const studentIds = (await Promise.all(promises)).flatMap(doc => Object.keys(doc.data() || {}));
  return studentIds;
}

const addResponsesToFirestore = async (responses: GoogleFormResponse[], transaction: Transaction) => {
  const surveysCollection = adminDb.collection(Collection.SURVEYS);
  const studentIds = await getAllStudentIds(transaction);

  const idResponses: GoogleFormResponseStudentId[] = [];
  const emailResponses: GoogleFormResponse[] = [];
  const unidentifiedResponses: GoogleFormResponse[] = [];
  responses.forEach(response => {
    if (isGoogleFormResponseStudentId(response)) {
      if (studentIds.includes(response.studentId)) {
        idResponses.push(response);
      } else if (response.studentEmail !== "") {
        emailResponses.push(response);
      } else {
        unidentifiedResponses.push(response);
      }
    } else if (isGoogleFormResponseUnidentified(response)) {
      unidentifiedResponses.push(response);
    } else {
      emailResponses.push(response);
    }
  });

  const existingAssignments = await Promise.all(
    idResponses.map(response => transaction.get(adminDb.collection(Collection.SURVEYS).doc(response.surveyId).collection(Collection.ASSIGNMENTS).where('studentId', '==', response.studentId).where('surveyId', '==', response.surveyId).where('responseId', '==', null).limit(1)))
  );
  idResponses.forEach((response, index) => {
    existingAssignments[index].empty ? transaction.set(surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid()), {
      studentId: response.studentId,
      responseId: response.responseId,
      submittedAt: response.submittedAt
    } as SurveyResponseStudentId) : transaction.update(existingAssignments[index].docs[0].ref, { responseId: response.responseId, submittedAt: response.submittedAt });
  });

  unidentifiedResponses.forEach(response => transaction.set(surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid()), {
    responseId: response.responseId,
    submittedAt: response.submittedAt,
  } as SurveyResponseUnidentified))

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