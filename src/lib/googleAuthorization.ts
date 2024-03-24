import { google } from "googleapis";
import { redirect } from "next/navigation";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/handler"
);

export function authorizeWithGoogle() {
  const scopes = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/spreadsheets",
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  redirect(authorizationUrl);
}

export async function setCredentials(authCode: string): Promise<boolean> {
  try {
    const {tokens} = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);
    console.log(oauth2Client.credentials);
    return true;
  } catch (err) {
    console.error('getting tokens failed');
    return false;
  }
}