import * as FirestoreSurveys from "@/data/firestore/surveys";
import * as AppsScript from "@/data/apps-script/calls";
import { SurveyID } from "@/types/survey-types";
import { db, functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { runTransaction } from "firebase/firestore";

export async function createNewSurvey(accessToken: string, name: string, description: string): Promise<SurveyID> {
  try {
    var survey: SurveyID = await AppsScript.createNewSurvey(accessToken, name, description);
  } catch (error) {
    throw new Error('Failed to create new survey');
  }

  const { id, ...surveyData } = survey;
  try {
    await FirestoreSurveys.createSurvey(id, surveyData);
  } catch (error) {
    await AppsScript.deleteSurvey(accessToken, id);
    throw new Error('Failed to create new survey');
  }
  return survey;
}

export async function addExistingSurvey(surveyId: string): Promise<SurveyID> {
  try {
    await FirestoreSurveys.getSurveyById(surveyId);
    var exists = true;
  } catch (error) {
    var exists = false;
  }

  if (exists) {
    throw new Error('Survey already exists');
  }

  try {
    return (await httpsCallable(functions, 'addExistingSurveyAndResponses')(surveyId)).data as SurveyID;
  } catch (error) {
    throw new Error('Failed to add existing survey');
  }
}

export async function deleteSurvey(accessToken: string, surveyId: string) {
  try {
    await FirestoreSurveys.deleteSurvey(surveyId);
    await AppsScript.deleteSurvey(accessToken, surveyId);
  } catch (error) {
    throw new Error('Failed to delete survey');
  }
}

export async function deleteSurveys(accessToken: string, surveyIds: string[]) {
  try {
    await runTransaction(db, async (transaction) => surveyIds.forEach((surveyId: string) => FirestoreSurveys.deleteSurvey(surveyId, transaction)));
    await AppsScript.deleteSurveys(accessToken, surveyIds);
  } catch (error) {
    throw new Error('Failed to delete surveys');
  }
}