import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const existingApps = getApps();
const app =
  existingApps.length === 0
    ? initializeApp(
        {
          credential: credential.cert(
            process.env
              .NEXT_PUBLIC_FIREBASE_ADMIN_CREDENTIALS_FILEPATH as string
          ),
          projectId: "swaliga-foundation",
          databaseURL: "https://swaliga-foundation-default-rtdb.firebaseio.com",
        },
        "adminApp"
      )
    : existingApps[0];

export const adminAuth = getAuth(app);