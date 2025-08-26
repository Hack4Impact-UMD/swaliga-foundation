import * as FirestoreSurveys from "@/data/firestore/surveys";
import * as AppsScript from "@/data/apps-script/calls";
import { SurveyID } from "@/types/survey-types";
import { db, functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { WriteBatch, writeBatch } from "firebase/firestore";
import { Firestore } from "firebase-admin/firestore";

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

export async function activateSurvey(accessToken: string, surveyId: string) {
  try {
    await AppsScript.installTrigger(accessToken, surveyId);
  } catch (error) {
    throw new Error("Failed to activate survey");
  }

  try {
    await FirestoreSurveys.updateSurvey(surveyId, { isActive: true });
  } catch (error) {
    await AppsScript.uninstallTrigger(accessToken, surveyId);
    throw new Error("Failed to activate survey");
  }
}

export async function deactivateSurvey(accessToken: string, surveyId: string) {
  try {
    await AppsScript.uninstallTrigger(accessToken, surveyId);
  } catch (error) {
    throw new Error("Failed to deactivate survey");
  }

  try {
    await FirestoreSurveys.updateSurvey(surveyId, { isActive: false });
  } catch (error) {
    await AppsScript.installTrigger(accessToken, surveyId);
    throw new Error("Failed to deactivate survey");
  }
}

export async function deleteSurvey(accessToken: string, surveyId: string) {
  try {
    await FirestoreSurveys.deleteSurvey(surveyId);
  } catch (error) {
    throw new Error('Failed to delete survey');
  }

  try {
    await AppsScript.deleteSurvey(accessToken, surveyId);
  } catch (error) { }
}

export async function deleteSurveys(accessToken: string, surveyIds: string[]) {
  try {
    const batch: WriteBatch = writeBatch(db);
    surveyIds.forEach((surveyId: string) => FirestoreSurveys.deleteSurvey(surveyId, batch));
    await batch.commit();
  } catch (error) {
    throw new Error('Failed to delete surveys');
  }

  try {
    await AppsScript.deleteSurveys(accessToken, surveyIds);
  } catch (error) { }
}