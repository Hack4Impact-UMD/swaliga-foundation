import { adminAuth } from '@/config/firebaseAdminConfig';
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