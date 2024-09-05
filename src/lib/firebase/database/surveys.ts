import { GoogleForm, Survey } from '@/types/survey-types';
import { auth, db } from "../firebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { createWatch } from './watches';
import { Watch } from '@/types/watch-types';
import { unassignSurveys } from './users';
import { deleteResponseByID } from './response';

export async function createSurvey(title: string) {
  // creates a new form in Google Forms
  try {
    const res = await fetch(`http://localhost:3000/api/googleForms/surveys`, {
      method: "POST",
      body: JSON.stringify({ title, idToken: await auth.currentUser?.getIdToken() }),
    });
    if (res.status !== 200) {
      throw new Error('unable to create survey');
    }
    const form = await res.json() as GoogleForm;
    await setDoc(doc(db, "surveys", form!.formId || ""), form);
    return form;
  } catch (err) {
    console.log(err);
    throw Error('unable to create survey');
  }
}

/* Retrieve form data given form id and update it to firebase.
* @params id - id of form
*/

export async function getAllSurveys() {
  try {
    const surveySnapshot = await getDocs(collection(db, 'surveys'));
    const allSurveys: Survey[] = surveySnapshot.docs.map((doc) => doc.data() as Survey);
    return allSurveys;
  } catch (error) {
    console.error('unable to get all surveys');
    throw new Error('unable to get surveys');
  }
}

export async function getSurveyByID(id: string) {
  try {
    const snapshot = await getDoc(doc(db, 'surveys', id));
    return snapshot.exists() ? snapshot.data() as Survey : null
  } catch (err) {
    throw Error('survey with given id not found')
  }
}

export async function deleteSurveyByID(surveyId: string) {
  try {
    const survey = await getSurveyByID(surveyId);
    if (!survey) {
      throw Error('survey with given id not found');
    }
    await unassignSurveys(survey.assignedUsers, [survey.formId]);
    Promise.all(survey.responseIds.map((responseId: string) => deleteResponseByID(responseId))).then(async () => {
      await deleteDoc(doc(db, "surveys", surveyId));
    });
  } catch (err) {
    console.log(err);
    throw Error('unable to delete survey');
  }
}