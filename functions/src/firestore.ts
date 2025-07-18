import { onSchedule, ScheduledEvent } from "firebase-functions/scheduler";
import { addExistingSurvey, getRecentUpdates } from "@/data/apps-script/calls"
import { fetchAccessToken } from '@/features/auth/serverAuthZ';
import { adminAuth, adminDb } from "@/config/firebaseAdminConfig";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { GoogleFormResponse, isGoogleFormResponseStudentEmail, isGoogleFormResponseStudentId, isGoogleFormResponseUnidentified } from "@/types/apps-script-types";
import { Collection } from "@/data/firestore/utils";
import { SurveyResponseStudentEmail, SurveyResponseStudentId, SurveyResponseUnidentified } from "@/types/survey-types";
import { v4 as uuid } from "uuid";
import { onCall, onRequest } from "firebase-functions/https";
import { onDocumentCreated, onDocumentDeleted } from "firebase-functions/firestore";

const addResponsesToFirestore = async (responses: GoogleFormResponse[], transaction: Transaction) => {
  const surveysCollection = adminDb.collection(Collection.SURVEYS);
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

  const idResponses = responses.filter(isGoogleFormResponseStudentId);
  const existingDocs = (await Promise.all(
    idResponses.map(response => transaction.get(adminDb.collection(Collection.SURVEYS).doc(response.surveyId).collection(Collection.ASSIGNMENTS).where('studentId', '==', response.studentId).where('surveyId', '==', response.surveyId).where('responseId', '==', null).limit(1)))
  ));
  idResponses.forEach((response, index) => {
    existingDocs[index].empty ? transaction.set(surveysCollection.doc(response.surveyId).collection(Collection.ASSIGNMENTS).doc(uuid()), {
      studentId: response.studentId,
      responseId: response.responseId,
      submittedAt: response.submittedAt
    } as SurveyResponseStudentId) : transaction.update(existingDocs[index].docs[0].ref, { responseId: response.responseId, submittedAt: response.submittedAt });
  });
}

const handleRecentUpdatesCallback = async (e: ScheduledEvent) => {
  const endTime = e.scheduleTime;
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const tokenData = await fetchAccessToken(adminUser.customClaims?.googleTokens?.refreshToken || '');

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const { surveyIds, timestamp } = (await transaction.get(adminDb.collection(Collection.METADATA).doc('surveyIds'))).data() || {};
    const { surveys, responses } = await getRecentUpdates(tokenData.accessToken, surveyIds, endTime, timestamp);
    const surveysCollection = adminDb.collection(Collection.SURVEYS);
    surveys.forEach(survey => transaction.update(surveysCollection.doc(survey.id), {
      name: survey.name,
      description: survey.description,
    }));
    addResponsesToFirestore(responses, transaction);
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
    transaction.set(adminDb.collection(Collection.SURVEYS).doc(id), surveyData);
    addResponsesToFirestore(responses, transaction);
    return survey;
  })
});

export const onSurveyDocCreated = onDocumentCreated('/surveys/{surveyId}', (event) => {
  const surveyId = event.params.surveyId;
  adminDb.collection(Collection.METADATA).doc('surveyIds').update({ surveyIds: FieldValue.arrayUnion(surveyId) })
});

export const onSurveyDocDeleted = onDocumentDeleted('/surveys/{surveyId}', (event) => {
  const surveyId = event.params.surveyId;
  adminDb.collection(Collection.METADATA).doc('surveyIds').update({ surveyIds: FieldValue.arrayRemove(surveyId) });
  adminDb.recursiveDelete(adminDb.collection(Collection.SURVEYS).doc(surveyId));
});