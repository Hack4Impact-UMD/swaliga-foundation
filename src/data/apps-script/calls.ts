import { auth, functions } from "@/config/firebaseConfig";
import { GoogleFormResponse } from "@/types/apps-script-types";
import { SurveyID } from "@/types/survey-types";
import { Role } from "@/types/user-types";
import { httpsCallable } from "firebase/functions";

async function callAppsScript(functionName: string, parameters?: any[]): Promise<any> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Unauthenticated");
  }

  const decodedIdToken = await user.getIdTokenResult();
  const role = decodedIdToken.claims.role as Role;
  if (role !== "ADMIN" && role !== "STAFF") {
    throw new Error("Unauthorized");
  }

  return httpsCallable(functions, 'appsScriptEndpoint')({ functionName, parameters });
}

export async function createNewSurvey(title: string, description: string): Promise<SurveyID> { return await callAppsScript('createNewSurvey', [title, description]); }
export async function addExistingSurvey(surveyId: string): Promise<{ survey: SurveyID; responses: GoogleFormResponse[]; }> { return await callAppsScript('addExistingSurvey', [surveyId]); }
export async function activateSurvey(surveyId: string): Promise<void> { return await callAppsScript('activateSurvey', [surveyId]); }
export async function deactivateSurvey(surveyId: string): Promise<void> { return await callAppsScript('deactivateSurvey', [surveyId]); }
export async function deleteSurvey(surveyId: string): Promise<void> { return await callAppsScript('deleteSurvey', [surveyId]); }
export async function deleteSurveys(surveyIds: string[]): Promise<void> { return await callAppsScript('deleteSurveys', [surveyIds]); }
export async function getUpdatedSurveyTitlesAndDescriptions(surveyIds: string[], startTime: string): Promise<Pick<SurveyID, 'id' | 'name' | 'description'>[]> { return await callAppsScript('getUpdatedSurveyTitlesAndDescriptions', [surveyIds, startTime]); }