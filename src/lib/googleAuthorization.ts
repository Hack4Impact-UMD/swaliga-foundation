import { doc, getDoc, setDoc } from "firebase/firestore";
import { google } from "googleapis";
import { db } from "./firebase/firebaseConfig";
import { adminDb } from "./firebase/firebaseAdminConfig";
import { DocumentData } from "firebase-admin/firestore";

export async function getOauth2Client() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      "http://localhost:3000/api/auth/handler"
    );
    await setCredentials(oauth2Client);
    return oauth2Client;
  } catch (err) {
    throw new Error("failed to set credentials");
  }
}

export async function setCredentials(oauth2Client: any) {
  if (!oauth2Client.credentials.refresh_token) {
    const response = await adminDb.doc("/metadata/adminRefreshToken").get();
    if (!response.exists) {
      throw new Error("invalid refresh token");
    }
    const { adminRefreshToken } = response.data() as DocumentData;
    try {
      oauth2Client.setCredentials({ refresh_token: adminRefreshToken });
    } catch (error) {
      throw new Error("invalid refresh token");
    }
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

export async function getAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ];
  const oauth2Client = await getOauth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });
}

export async function isRefreshTokenValid(): Promise<boolean> {
  const response = await adminDb.doc("/metadata/adminRefreshToken").get();
  if (!response.exists) {
    return false;
  }
  try {
    await getOauth2Client();
    return true;
  } catch (err) {
    return false;
  }
}

export async function setAdminRefreshToken(authCode: string) {
  try {
    const oauth2Client = await getOauth2Client();
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);
    await adminDb.runTransaction(async (transaction) => {
      transaction.update(adminDb.doc("/metadata/adminRefreshToken"), {
        adminRefreshToken: tokens.refresh_token,
      })
    })
    return true;
  } catch (err) {
    return false;
  }
}

export async function getFormsClient() {
  const oauth2Client = await getOauth2Client();
  return google.forms({
    version: "v1",
    auth: oauth2Client,
  });
}

export async function getGmailClient() {
  const oauth2Client = await getOauth2Client();
  return google.gmail({
    version: "v1",
    auth: oauth2Client
  });
}
