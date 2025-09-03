import { adminDb } from "@/config/firebaseAdminConfig";
import { Collection, Document } from "@/data/firestore/utils";
import { PendingAssignmentID } from "@/types/survey-types";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { onDocumentWritten } from "firebase-functions/firestore";
import { onCall } from "firebase-functions/https";
import moment from "moment";
import { v4 as uuid } from "uuid";

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
          } satisfies PendingAssignmentID);
        }
      })
    });
    assignmentsToCreate.forEach(assignment => {
      const { id, surveyId, ...data } = assignment;
      transaction.set(surveysCollection.doc(surveyId).collection(Collection.ASSIGNMENTS).doc(id), data);
    })
  });
})

export const onAssignmentWritten = onDocumentWritten('/surveys/{surveyId}/assignments/{assignmentId}', async (event) => {
  const { surveyId } = event.params;
  const beforeId = event.data?.before.exists ? event.data?.before.data()?.studentId : undefined;
  const afterId = event.data?.after.exists ? event.data?.after.data()?.studentId : undefined;

  const accessListRef = adminDb.collection(Collection.SURVEYS).doc(surveyId).collection(Collection.SURVEY_ACCESS_LIST).doc(Document.SURVEY_ACCESS_LIST);
  if (!beforeId && afterId) {
    await accessListRef.set({ [afterId]: FieldValue.increment(1) }, { merge: true });
  } else if (beforeId && afterId) {
    await adminDb.runTransaction(async (transaction: Transaction) => {
      const currCount = (await transaction.get(accessListRef)).data()?.[beforeId]
      await transaction.update(accessListRef, {
        [beforeId]: currCount === 1 ? FieldValue.delete() : FieldValue.increment(-1),
        [afterId]: FieldValue.increment(1)
      })
    })
  } else if (beforeId && !afterId) {
    await adminDb.runTransaction(async (transaction: Transaction) => {
      const currCount = (await transaction.get(accessListRef)).data()?.[beforeId]
      await transaction.update(accessListRef, {
        [beforeId]: currCount === 1 ? FieldValue.delete() : FieldValue.increment(-1)
      })
    })
  }
});