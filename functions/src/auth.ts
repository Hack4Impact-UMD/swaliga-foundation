import { adminAuth, adminDb } from './config/firebaseAdminConfig';
import { Collection } from '@/data/firestore/utils';
import { AdminCustomClaims, DecodedIdTokenWithCustomClaims, GoogleTokens, StaffCustomClaims, StudentCustomClaims, StudentDecodedIdTokenWithCustomClaims } from '@/types/auth-types';
import { SurveyResponseStudentEmailID } from '@/types/survey-types';
import { FieldValue, Transaction } from 'firebase-admin/firestore';
import { onCall, onRequest } from "firebase-functions/v2/https";
import moment from 'moment';
import { getFunctionsURL } from '@/config/utils';
import { getUrlFromRequest } from './utils/utils';

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

export const onStudentAccountCreated = onCall(async (req) => {
  if (!req.auth) {
    throw new Error("Unauthorized");
  } else if (req.auth.token.role !== 'STUDENT') {
    throw new Error("Only STUDENT role can create student accounts")
  } else if (req.auth.token.studentId) {
    throw new Error("Student account already exists for this user");
  }

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const docs = (await transaction.get(adminDb.collectionGroup(Collection.ASSIGNMENTS).where('studentEmail', '==', req.auth!.token.email!))).docs.map(doc => ({ id: doc.id, surveyId: doc.ref.parent.parent!.id, ...doc.data() } as SurveyResponseStudentEmailID));
    const surveysCollectionRef = adminDb.collection(Collection.SURVEYS);
    const updates = { studentId: req.data, studentEmail: FieldValue.delete() }
    docs.forEach(doc => transaction.update(surveysCollectionRef.doc(doc.surveyId).collection(Collection.ASSIGNMENTS).doc(doc.id), updates));
  });

  const decodedToken = req.auth.token as StudentDecodedIdTokenWithCustomClaims
  await adminAuth.setCustomUserClaims(req.auth?.uid, {
    role: decodedToken.role,
    studentId: req.data,
  } satisfies StudentCustomClaims);
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
    await fetchAccessToken(refreshToken);
    return true;
  } catch (error) {
    return false;
  }
})

export const startOAuth2Flow = onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const url = getUrlFromRequest(req);
  const idToken = url.searchParams.get('idToken');
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isIdTokenValid(idToken))) {
    res.status(401).send('Unauthorized');
    return;
  } else if (decodedToken.role !== "ADMIN") {
    res.status(403).send('Forbidden');
    return;
  }

  const redirectUri = encodeURIComponent(getFunctionsURL("handleOAuth2Code"));
  const scopes: string = encodeURIComponent([
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/script.scriptapp',
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://mail.google.com/'
  ].join(' '));

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&login_hint=${decodedToken.email}&access_type=offline&prompt=consent&state=${idToken}`;
  res.status(303).redirect(authUrl);
});

export const handleOAuth2Code = onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const url = getUrlFromRequest(req);

  const idToken = url.searchParams.get('state');
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isIdTokenValid(idToken))) {
    res.status(401).send('Unauthorized');
    return;
  } else if (decodedToken.role !== 'ADMIN') {
    res.status(403).send('Forbidden');
    return;
  }

  const code = url.searchParams.get('code');
  if (!code) {
    res.status(400).send('Bad Request');
    return;
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code || "",
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: getFunctionsURL('handleOAuth2Code'),
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) {
    res.status(500).send('Internal Server Error');
    return;
  }
  const tokens = await response.json();

  const customClaims: AdminCustomClaims = {
    role: decodedToken.role,
    googleTokens: {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expirationTime: moment().add(tokens.expires_in, 'seconds').toISOString(),
    }
  }
  await adminAuth.setCustomUserClaims(decodedToken.uid, customClaims);
  res.status(303).redirect(`${process.env.NEXT_PUBLIC_DOMAIN}?refreshIdToken=true`);
});

export const refreshAccessToken = onCall(async (req) => {
  if (!req.auth || (req.auth.token.role !== 'ADMIN' && req.auth.token.role !== 'STAFF')) {
    throw new Error("Unauthorized");
  }

  if (req.auth.token.role === "ADMIN") {
    var refreshToken: string | undefined = req.auth.token.googleTokens?.refreshToken;
  } else {
    const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
    var refreshToken: string | undefined = adminUser.customClaims?.googleTokens?.refreshToken;
  }
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  let tokenData: GoogleTokens;
  try {
    tokenData = await fetchAccessToken(refreshToken);
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }

  const customClaims: AdminCustomClaims | StaffCustomClaims =
    req.auth.token.role === 'ADMIN' ?
      {
        role: req.auth.token.role,
        googleTokens: tokenData
      } satisfies AdminCustomClaims : {
        role: req.auth.token.role,
        googleTokens: {
          accessToken: tokenData.accessToken,
          expirationTime: tokenData.expirationTime
        }
      } satisfies StaffCustomClaims;
  await adminAuth.setCustomUserClaims(req.auth.uid, customClaims);
  return tokenData.accessToken;
});

export async function isIdTokenValid(idToken: string | undefined | null): Promise<DecodedIdTokenWithCustomClaims | false> {
  if (!idToken) {
    return false;
  }
  try {
    var decodedToken: DecodedIdTokenWithCustomClaims = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return false;
  }
  return decodedToken;
}

export async function fetchAccessToken(refreshToken: string): Promise<GoogleTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      grant_type: 'refresh_token',
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }
  const tokenData = await response.json();
  return {
    refreshToken,
    accessToken: tokenData.access_token,
    expirationTime: moment().add(tokenData.expires_in, 'seconds').toISOString()
  }
}