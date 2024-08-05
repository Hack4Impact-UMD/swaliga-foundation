import { google } from "googleapis";
import { oauth2Client, setCredentials } from "./googleAuthorization";

export async function getFormsClient() {
  await setCredentials();
  return google.forms({
    version: "v1",
    auth: oauth2Client,
  });
}