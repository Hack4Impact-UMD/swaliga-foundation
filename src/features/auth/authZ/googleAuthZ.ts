import { auth } from "@/config/firebaseConfig";
import { getFunctionsURL } from "@/config/utils";

export function getOAuth2ConsentURL(): string {
  const user = auth.currentUser;
  const email = user?.email || undefined;

  const redirectUri = encodeURIComponent(getFunctionsURL("handleOAuth2Code"));
  const scope = encodeURIComponent([
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/script.scriptapp',
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://mail.google.com/'
  ].join(' '));

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&include_granted_scopes=true${email ? `&login_hint=${email}` : ""}`;
  return authUrl;
}