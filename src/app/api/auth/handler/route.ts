import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdToken } from "firebase-admin/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const idToken = req.nextUrl.searchParams.get("state");
  if (!code || !idToken) {
    return NextResponse.json('Invalid parameters', { status: 400 });
  }

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json('Invalid ID token', { status: 401 });
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
    return NextResponse.json('Error fetching token', { status: response.status });
  }
  const tokenData = await response.json();

  await adminAuth.setCustomUserClaims(decodedToken.uid, {
    role: decodedToken.role,
    googleTokens: {
      refreshToken: tokenData.refresh_token,
      accessToken: tokenData.access_token,
    }
  })
  return NextResponse.redirect(process.env.NEXT_PUBLIC_DOMAIN!);
}
