import * as FirestoreSurveys from "@/data/firestore/surveys";
import * as AppsScript from "@/data/apps-script/calls";
import { SurveyID } from "@/types/survey-types";
import { functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";

export async function createNewSurvey(accessToken: string, name: string, description: string): Promise<string> {
  try {
    var survey: SurveyID = await AppsScript.createNewForm(accessToken, name, description);
  } catch (error) {
    throw new Error('Failed to create new survey');
  }

  const { id, ...surveyData } = survey;
  try {
    await FirestoreSurveys.createSurvey(id, surveyData);
  } catch (error) {
    await AppsScript.deleteForm(accessToken, id);
    throw new Error('Failed to create new survey');
  }
  return id;
}

export async function addExistingSurvey(surveyId: string) {
  try {
    FirestoreSurveys.getSurveyById(surveyId);
    var exists = true;
  } catch (error) {
    var exists = false;
  }

  if (exists) {
    throw new Error('Survey already exists');
  }

  try {
    await httpsCallable(functions, 'addExistingSurveyAndResponses')(surveyId);
  } catch (error) {
    throw new Error('Failed to add existing survey');
  }
}