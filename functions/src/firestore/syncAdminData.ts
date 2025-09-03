import { adminDb } from "@/config/firebaseAdminConfig";
import { Collection, Document } from "@/data/firestore/utils";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/firestore";

const addDocToAdminData = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string, docData: any, transaction: Transaction, count?: number) => {
  if (!count) {
    count = (await transaction.get(collectionRef.count())).data().count;
  }
  for (let i = count - 1; i >= 0; i--) {
    try {
      transaction.update(collectionRef.doc(i.toString()), { [docId]: docData });
      return;
    } catch (error) { }
  }
  transaction.set(collectionRef.doc(count.toString()), { [docId]: docData });
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
      transaction.update(collectionRef.doc(docNum), { [docId]: docData });
    } catch (error) {
      transaction.update(collectionRef.doc(docNum), { [docId]: FieldValue.delete() });
      await addDocToAdminData(collectionRef, docId, docData, transaction, count);
    }
  });
}

const updateAdminDataOnDocDeleted = async (collectionRef: FirebaseFirestore.CollectionReference, docId: string) => {
  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docNum = (await collectionRef.orderBy(docId).limit(1).get()).docs[0]?.id;
    if (!docNum) { return; }
    transaction.update(collectionRef.doc(docNum), { [docId]: FieldValue.delete() });
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
    adminDb.recursiveDelete(adminDb.collection(Collection.SURVEYS).doc(surveyId).collection(Collection.SURVEY_ACCESS_LIST)),
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