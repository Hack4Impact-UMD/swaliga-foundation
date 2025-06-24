import { adminAuth } from "@/config/firebaseAdminConfig";
import { isTokenAuthorized } from "@/features/auth/serverAuthZ";
import { AuthCustomClaims, DecodedIdTokenWithCustomClaims } from "@/types/auth-types";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isTokenAuthorized(idToken))) {
    return NextResponse.json("Unauthorized", { status: 401, statusText: "Unauthorized" });
  }

  const refreshToken: string | undefined = decodedToken.googleTokens?.refreshToken;
  if (!refreshToken) {
    return NextResponse.json("No refresh token found", { status: 400, statusText: "Bad Request" });
  }
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
    return NextResponse.json('Failed to refresh access token', { status: response.status, statusText: response.statusText });
  }
  const token = await response.json();

  const customClaims: AuthCustomClaims = {
    role: decodedToken.role,
    googleTokens: {
      refreshToken,
      accessToken: token.access_token,
      expirationTime: moment().add(token.expires_in, 'seconds').toISOString(),
    }
  }
  await adminAuth.setCustomUserClaims(decodedToken.uid, customClaims)
  return NextResponse.json(token.access_token, { status: 200, statusText: "OK" });
}