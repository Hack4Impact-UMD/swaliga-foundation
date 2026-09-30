import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";

if (!admin.apps.length) {
  admin.initializeApp();
}

const adminApp = admin.app();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminFunctions = getFunctions(adminApp);