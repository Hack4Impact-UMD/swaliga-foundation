import { Survey, SurveyID } from '@/types/survey-types';
import { db } from "../../config/firebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, Transaction, updateDoc, WriteBatch } from 'firebase/firestore';
import { Collection, FirestorePartial } from './utils';

export async function getSurveyById(id: string, transaction?: Transaction): Promise<SurveyID> {
  const surveyRef = doc(db, Collection.SURVEYS, id);
  let surveyDoc;
  try {
    surveyDoc = await (transaction ? transaction.get(surveyRef) : getDoc(surveyRef));
  } catch (error) {
    throw new Error("Failed to get survey");
  }
  if (!surveyDoc.exists()) {
    throw new Error("Survey not found");
  }
  return { id: surveyDoc.id, ...surveyDoc.data() } as SurveyID;
}

export async function getAllSurveys(): Promise<SurveyID[]> {
  try {
    const surveysRef = collection(db, Collection.SURVEYS);
    const surveyDocs = await getDocs(surveysRef);
    return surveyDocs.docs.map((doc) => {
      const survey: Survey = doc.data() as Survey;
      return {
        id: doc.id,
        ...survey
      } as SurveyID;
    })
  } catch (error) {
    throw new Error("Failed to get surveys");
  }
}

export async function createSurvey(surveyId: string, survey: Survey, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const surveyRef = doc(db, Collection.SURVEYS, surveyId);
    // @ts-ignore
    await (instance ? instance.set(surveyRef, survey) : setDoc(surveyRef, survey));
  } catch (error) {
    throw new Error("Failed to create survey");
  }
}

export async function updateSurvey(id: string, updates: FirestorePartial<Survey>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const surveyRef = doc(db, Collection.SURVEYS, id);
    // @ts-ignore
    await (instance ? instance.update(surveyRef, updates) : updateDoc(surveyRef, updates));
  } catch (error) {
    throw new Error("Failed to update survey");
  }
}

export async function deleteSurvey(id: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const surveyRef = doc(db, Collection.SURVEYS, id);
    // @ts-ignore
    await (instance ? instance.delete(surveyRef) : deleteDoc(surveyRef));
  } catch (error) {
    throw new Error("Failed to delete survey");
  }
}