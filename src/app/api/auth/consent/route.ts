import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/handler');
  const scope = encodeURIComponent(['https://www.googleapis.com/auth/script.external_request', 'https://www.googleapis.com/auth/script.scriptapp'].join(' '));
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  return NextResponse.redirect(authUrl);
}
