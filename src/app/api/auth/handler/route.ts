import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdToken } from "firebase-admin/auth";
import moment from "moment";
import { isTokenAuthorized } from "@/features/auth/serverAuthZ";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  let decodedToken: DecodedIdToken | false;
  if (!(decodedToken = await isTokenAuthorized(idToken))) {
    return NextResponse.json('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json('Invalid code', { status: 400, statusText: 'Bad Request' });
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code || "",
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/handler`,
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) {
    return NextResponse.json('Error fetching token', { status: response.status, statusText: response.statusText });
  }
  const tokenData = await response.json();

  await adminAuth.setCustomUserClaims(decodedToken.uid, {
    role: decodedToken.role,
    googleTokens: {
      refreshToken: tokenData.refresh_token,
      accessToken: tokenData.access_token,
      expirationTime: moment().add(tokenData.expires_in, 'seconds').toISOString(),
    }
  })
  return NextResponse.redirect(process.env.NEXT_PUBLIC_DOMAIN!);
}
