import { auth } from "@/config/firebaseConfig";
import { OAuth2Client } from "google-auth-library";
import { getFunctionsURL } from "@/config/utils";

export function getOAuth2ConsentURL(): string {
  const user = auth.currentUser;
  const email = user?.email || undefined;

  const oAuth2Client = new OAuth2Client({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: getFunctionsURL("handleOAuth2Code")
  })

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    login_hint: email,
    prompt: 'consent',
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/script.external_request',
      'https://www.googleapis.com/auth/script.scriptapp',
      'https://www.googleapis.com/auth/forms',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://mail.google.com/'
    ].join(' ')
  })
  return authUrl;
}