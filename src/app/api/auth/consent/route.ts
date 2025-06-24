import { adminAuth } from "@/config/firebaseAdminConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/handler`);
  const scopes: string = encodeURIComponent([
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/script.scriptapp'
  ].join(' '));
  const idToken = req.nextUrl.searchParams.get('idToken') || '';
  if (!idToken) {
    return NextResponse.json('Invalid parameters', { status: 400, statusText: 'Bad Request' });
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return NextResponse.json('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&login_hint=${decodedToken.email}&access_type=offline&prompt=consent&state=${idToken}`;
  return NextResponse.redirect(authUrl);
}
