import { app, apps, initializeApp } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!apps.length) {
  initializeApp();
}

const adminApp = app();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);