import { adminAuth, adminDb } from './config/firebaseAdminConfig';
import { Collection } from './types/serverTypes';
import { StudentCustomClaims, StudentDecodedIdTokenWithCustomClaims } from '@/types/auth-types';
import { SurveyResponseStudentEmailID } from '@/types/survey-types';
import { FieldValue, Transaction } from 'firebase-admin/firestore';
import { onCall, onRequest } from "firebase-functions/v2/https";
import { getFunctionsURL } from '@/config/utils';
import { Credentials, OAuth2Client, TokenPayload } from 'google-auth-library';
import moment from 'moment';

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

async function changeEmailAssignmentsToIdAssignments(email: string, studentId: string, transaction: Transaction) {
  const docs = (await transaction.get(adminDb.collectionGroup(Collection.ASSIGNMENTS).where('studentEmail', '==', email))).docs.map(doc => ({ id: doc.id, surveyId: doc.ref.parent.parent!.id, ...doc.data() } as SurveyResponseStudentEmailID));
  const surveysCollectionRef = adminDb.collection(Collection.SURVEYS);
  const updates = { studentId, studentEmail: FieldValue.delete() }
  docs.forEach(doc => transaction.update(surveysCollectionRef.doc(doc.surveyId).collection(Collection.ASSIGNMENTS).doc(doc.id), updates));
}

export const onStudentAccountCreated = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  } else if (req.auth.token.role !== 'STUDENT') {
    throw new Error("Only STUDENT role can create student accounts")
  } else if (req.auth.token.studentId) {
    throw new Error("Student account already exists for this user");
  }

  await adminDb.runTransaction(async (transaction: Transaction) => await changeEmailAssignmentsToIdAssignments(req.auth!.token.email!, req.data, transaction));

  const decodedToken = req.auth.token as StudentDecodedIdTokenWithCustomClaims
  await adminAuth.setCustomUserClaims(req.auth.uid, {
    role: decodedToken.role,
    studentId: req.data,
  } satisfies StudentCustomClaims);
});

export const handleEmailChange = onCall(async (req) => {
  if (!req.auth || req.auth.token.role !== 'STUDENT' || !req.auth.token.studentId) {
    throw new Error("Unauthorized");
  }
  await adminDb.runTransaction(async (transaction: Transaction) => {
    await Promise.all([
      transaction.update(adminDb.collection(Collection.STUDENTS).doc(req.auth!.token.studentId), { email: req.data }),
      changeEmailAssignmentsToIdAssignments(req.data, req.auth!.token.studentId, transaction)
    ]);
  });
});

export const checkRefreshTokenValidity = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  }

  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const refreshToken = adminUser.customClaims?.googleTokens?.refreshToken;
  if (!refreshToken) {
    return false;
  }

  try {
    return true;
  } catch (error) {
    return false;
  }
})

export const handleOAuth2Code = onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}`);
    return;
  }

  const code = req.query.code as string;
  if (!code) {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}`);
    return;
  }

  const oAuth2Client = getOAuth2Client();
  let tokens: Credentials;
  try {
    tokens = (await oAuth2Client.getToken(code)).tokens;
  } catch {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?error=true`);
    return;
  }

  if (!tokens.id_token) {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?error=true`);
    return;
  }

  let decodedIdToken: TokenPayload | undefined;
  try {
    decodedIdToken = (await oAuth2Client.verifyIdToken({ idToken: tokens.id_token })).getPayload();
    if (!decodedIdToken || !decodedIdToken.email || !decodedIdToken.email_verified) {
      res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?error=true`);
      return;
    }
  } catch {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?error=true`);
    return;
  }

  const email = decodedIdToken.email;
  if (email !== process.env.ADMIN_EMAIL) {
    res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?error=true`);
    return;
  }

  const adminUser = await adminAuth.getUserByEmail(email);
  const uid = adminUser.uid;
  await adminDb.collection(Collection.GOOGLE_OAUTH2_TOKENS).doc(uid).set(tokens);
  res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?success=true`);
});

export async function refreshAccessToken(oauth2Client: OAuth2Client): Promise<void> {
  if (!oauth2Client.credentials.refresh_token) {
    throw new Error("Refresh token not found");
  }
  let tokens: Credentials;
  try {
    tokens = (await oauth2Client.refreshAccessToken()).credentials;
  } catch {
    throw new Error("Failed to refresh access token");
  }
  oauth2Client.setCredentials(tokens);
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const uid = adminUser.uid;
  await adminDb.collection(Collection.GOOGLE_OAUTH2_TOKENS).doc(uid).set(tokens);
}

export function getOAuth2Client(): OAuth2Client {
  return new OAuth2Client({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: getFunctionsURL("handleOAuth2Code")
  });
}

export async function getOAuth2ClientWithCredentials(): Promise<OAuth2Client> {
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const uid = adminUser.uid;
  const credentials = (await adminDb.collection(Collection.GOOGLE_OAUTH2_TOKENS).doc(uid).get()).data() as Credentials;
  const oAuth2Client = getOAuth2Client();
  if (moment(credentials.expiry_date).isBefore(moment())) {
    await refreshAccessToken(oAuth2Client);
  }
  return oAuth2Client;
}