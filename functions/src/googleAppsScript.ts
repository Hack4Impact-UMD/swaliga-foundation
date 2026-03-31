import { onCall } from "firebase-functions/https";
import { OAuth2Client } from "google-auth-library";
import { GoogleApis } from "googleapis";
import { getOAuth2ClientWithCredentials } from "./auth";

export async function callAppsScript(oauth2Client: OAuth2Client, functionName: string, parameters?: any[]): Promise<any> {
  const data = (await new GoogleApis({ auth: oauth2Client }).script('v1').scripts.run({
    scriptId: process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID,
    requestBody: {
      function: functionName,
      parameters
    }
  })).data;

  if (!data.done || data.error) {
    throw new Error("An unexpected error occurred. Please try again later.");
  }

  return data.response?.result;
}

const appsScriptEndpoint = onCall(async (req) => {
  if (!req.auth || (req.auth.token.role !== 'ADMIN' && req.auth.token.role !== 'STAFF')) {
    throw new Error("Unauthorized");
  }

  const oauth2Client = await getOAuth2ClientWithCredentials();
  const { functionName, parameters } = req.data;
  return await callAppsScript(oauth2Client, functionName, parameters);
});

export const appsScriptCloudFunctions = { appsScriptEndpoint };