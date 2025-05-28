import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const existingApps = getApps();
const adminApp =
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

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);