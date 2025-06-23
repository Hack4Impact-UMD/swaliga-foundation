import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/handler`);
  const scopes: string[] = [
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/script.scriptapp'
  ]
  const scope = encodeURIComponent(scopes.join(' '));
  const email = req.nextUrl.searchParams.get('email') || ''
  const idToken = req.nextUrl.searchParams.get('idToken') || '';
  if (!email || !idToken) {
    return NextResponse.json('Invalid parameters', { status: 400 });
  }
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&login_hint=${email}&access_type=offline&prompt=consent&state=${idToken}`;
  return NextResponse.redirect(authUrl);
}
