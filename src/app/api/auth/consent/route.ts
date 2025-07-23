import { isIdTokenValid } from "@/features/auth/serverAuthZ";
import { DecodedIdTokenWithCustomClaims } from "@/types/auth-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const idToken = req.nextUrl.searchParams.get('idToken');
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isIdTokenValid(idToken))) {
    return NextResponse.json('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  }

  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/handler`);
  const scopes: string = encodeURIComponent([
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://mail.google.com/'
  ].join(' '));

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&login_hint=${decodedToken.email}&access_type=offline&prompt=consent&state=${idToken}`;
  return NextResponse.redirect(authUrl);
}
