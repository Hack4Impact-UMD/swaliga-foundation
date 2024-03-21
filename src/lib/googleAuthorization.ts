import { google } from "googleapis";
import { redirect } from "next/navigation";

export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/__/auth/handler"
  );

  const scopes = ["https://www.googleapis.com/auth/drive.file"];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  redirect(authorizationUrl);
}
