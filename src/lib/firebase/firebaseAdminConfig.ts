import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
  credential: credential.applicationDefault(),
  projectId: "swaliga-foundation",
  databaseURL: "https://swaliga-foundation-default-rtdb.firebaseio.com",
}, "adminApp");

export const adminAuth = getAuth(app);