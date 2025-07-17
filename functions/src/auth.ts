import { adminAuth } from '@/config/firebaseAdminConfig';
import { onCall } from "firebase-functions/v2/https";

export const setAdminRole = onCall(async (req) => {
  return new Promise(async (resolve, reject) => {
    const uid = req.auth?.uid;
    if (!uid) {
      reject("Unauthorized");
      throw new Error("Unauthorized");
    }
    await adminAuth.setCustomUserClaims(uid, { role: "ADMIN" })
    resolve(`User ${uid} has been given ADMIN role`);
  });
});

export const setStudentRole = onCall(async (req) => {
  return new Promise(async (resolve, reject) => {
    const uid = req.auth?.uid;
    if (!uid) {
      reject("Unauthorized");
      throw new Error("Unauthorized");
    }
    await adminAuth.setCustomUserClaims(uid, { role: "STUDENT" })
    resolve(`User ${uid} has been given STUDENT role`);
  });
});