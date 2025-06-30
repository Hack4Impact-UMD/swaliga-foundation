import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdTokenWithCustomClaims, GoogleTokens } from "@/types/auth-types";
import moment from "moment";

export async function isIdTokenValid(idToken: string | undefined | null): Promise<DecodedIdTokenWithCustomClaims | false> {
  if (!idToken) {
    return false;
  }
  let decodedToken: DecodedIdTokenWithCustomClaims;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
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