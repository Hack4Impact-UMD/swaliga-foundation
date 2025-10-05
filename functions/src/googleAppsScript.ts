import { getFunctionsURL } from "@/config/utils";
import { onCall } from "firebase-functions/https";
import { Credentials, OAuth2Client } from "google-auth-library";
import { GoogleApis } from "googleapis";
import { adminAuth, adminDb } from "./config/firebaseAdminConfig";
import { Collection } from "./types/serverTypes";

export async function callAppsScript(oauth2Client: OAuth2Client, functionName: string, parameters?: any[]): Promise<any> {
  const data = (await new GoogleApis({ auth: oauth2Client }).script('v1').scripts.run({
    scriptId: process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID,
    requestBody: {
      function: functionName,
      parameters
    }
  })).data;

  if (data.error) {
    throw new Error("An unexpected error occurred. Please try again later.");
  }

  return data;
}

const appsScriptEndpoint = onCall(async (req) => {
  if (!req.auth || (req.auth.token.role !== 'ADMIN' && req.auth.token.role !== 'STAFF')) {
    throw new Error("Unauthorized");
  }

  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
  const uid = adminUser.uid;
  const credentials = (await adminDb.collection(Collection.GOOGLE_OAUTH2_TOKENS).doc(uid).get()).data() as Credentials;

  const oauth2Client = new OAuth2Client({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: getFunctionsURL("handleOAuth2Code"),
    credentials
  })

  const { functionName, parameters } = req.data;
  return await callAppsScript(oauth2Client, functionName, parameters);
});

export const appsScriptCloudFunctions = { appsScriptEndpoint };