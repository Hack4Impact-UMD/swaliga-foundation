import { google } from "googleapis";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebaseConfig";
import { redirect } from "next/navigation";

export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/handler"
);

// ensures the credentials in oauth2Client are up to date
export async function setCredentials() {
  if (!oauth2Client.credentials.refresh_token) {
    const response = await getDoc(doc(db, "metadata", "adminRefreshToken"));
    if (!response.exists()) {
      throw new Error("invalid refresh token");
    }
    const { adminRefreshToken } = response.data();
    oauth2Client.setCredentials({ refresh_token: adminRefreshToken });
    console.log(auth.currentUser);
  }

  if (
    !oauth2Client.credentials.access_token ||
    (oauth2Client.credentials.expiry_date &&
      Date.now() > oauth2Client.credentials.expiry_date)
  ) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log(oauth2Client.credentials);
  }
  const response = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(response.credentials);
}

export function authorizeWithGoogle() {
  const scopes = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  redirect(authorizationUrl);
}

export async function setCredentialsWithAuthCode(authCode: string): Promise<boolean> {
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    console.log('tokens', tokens);
    oauth2Client.setCredentials(tokens);
    await setDoc(doc(db, "metadata", "adminRefreshToken"), { adminRefreshToken: tokens.refresh_token })
    return true;
  } catch (err) {
    console.error("getting tokens failed");
    console.log(err);
    return false;
  }
}

export async function updateRefreshToken() {
  if (await isRefreshTokenValid()) {
    return;
  }
  redirect("/api/auth/consent");
}

export async function isRefreshTokenValid(): Promise<boolean> {
  const response = await getDoc(doc(db, "metadata", "adminRefreshToken"));
  if (!response.exists()) {
    return false;
  }
  try {
    await setCredentials();
    return true;
  } catch (err) {
    return false;
  }
}