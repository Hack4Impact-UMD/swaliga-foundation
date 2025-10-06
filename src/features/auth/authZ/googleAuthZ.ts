import { auth } from "@/config/firebaseConfig";
import { getFunctionsURL } from "@/config/utils";

export function getOAuth2ConsentURL(): string {
  const user = auth.currentUser;
  const email = user?.email || undefined;

  const scopes = [
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/script.scriptapp',
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://mail.google.com/'
  ]

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirect_uri: getFunctionsURL("handleOAuth2Code"),
    response_type: "code",
    scope: scopes.join(' '),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    login_hint: email || ""
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}