import { google } from "googleapis";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebaseConfig";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
);

export async function getFormsClient() {
  if (!oauth2Client.credentials.refresh_token) {
    const response = await getDoc(doc(db, 'metadata', 'adminRefreshToken'));
    if (!response.exists()) {
      throw new Error("no refresh token found");
    }
    const { adminRefreshToken } = response.data();
    oauth2Client.setCredentials({ refresh_token: adminRefreshToken });
    console.log(auth.currentUser)
  }

  if (!oauth2Client.credentials.access_token || (oauth2Client.credentials.expiry_date && Date.now() > oauth2Client.credentials.expiry_date)) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log(oauth2Client.credentials);
  }

  return google.forms({
    version: 'v1',
    auth: oauth2Client
  })
}