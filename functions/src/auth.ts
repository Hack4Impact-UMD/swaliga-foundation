import { adminAuth, adminDb } from '@/config/firebaseAdminConfig';
import { Collection } from '@/data/firestore/utils';
import { StudentCustomClaims, StudentDecodedIdTokenWithCustomClaims } from '@/types/auth-types';
import { SurveyResponseStudentEmailID } from '@/types/survey-types';
import { FieldValue, Transaction } from 'firebase-admin/firestore';
import { onCall } from "firebase-functions/v2/https";

export const setRole = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  }

  const uid = req.auth?.uid;
  const email = req.auth?.token.email;
  if (!email) {
    throw new Error("No email found");
  }

  try {
    if (email === process.env.ADMIN_EMAIL) {
      await adminAuth.setCustomUserClaims(uid, { role: "ADMIN" });
    } else if (email.endsWith("@swaligafoundation.org")) {
      await adminAuth.setCustomUserClaims(uid, { role: "STAFF" });
    } else {
      await adminAuth.setCustomUserClaims(uid, { role: "STUDENT" });
    }
  } catch (error) {
    throw new Error("Failed to set user role");
  }
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
    docs.forEach(doc => transaction.update(surveysCollectionRef.doc(doc.surveyId).collection(Collection.ASSIGNMENTS).doc(doc.id), updates));
  });

  const decodedToken = req.auth.token as StudentDecodedIdTokenWithCustomClaims
  await adminAuth.setCustomUserClaims(req.auth?.uid, {
    role: decodedToken.role,
    studentId: req.data,
  } as StudentCustomClaims);
});