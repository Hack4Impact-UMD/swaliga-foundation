import { GoogleForm, Survey } from '@/types/survey-types';
import { getFormsClient } from '../../googleForms';
import { db } from "../firebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { createWatch } from './watches';
import { Watch } from '@/types/watch-types';
import { unassignSurveys } from './users';
import { deleteResponseByID } from './response';

export async function createSurvey(body: {title: string, documentTitle: string}) {
  // creates a new form in Google Forms
  let form: Survey | null = null;
  try {
    const forms = await getFormsClient();
    let googleForm: GoogleForm = (await forms.forms.create({
      requestBody: {
        info: {
          title: body.title,
          documentTitle: body.documentTitle,
        },
      },
    })).data as unknown as GoogleForm;
    
    // creates watches for the form for update & response handling
    const schemaWatch = await createWatch(googleForm.formId || '', "SCHEMA");
    const responsesWatch = await createWatch(googleForm.formId || '', "RESPONSES");

    // adds a question for Swaliga User ID to the form
    // important because watch event inputs do not contain the id of the user that submitted the form, which makes this id field necessary to identify the user later on
    googleForm = (await forms.forms.batchUpdate({
      formId: googleForm.formId,
      requestBody: {
        includeFormInResponse: true,
        requests: [
          {
            createItem: {
              item: {
                itemId: "00000000",
                title: "Swaliga User ID",
                description:
                  "Make sure to copy this ID directly from your student dashboard",
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: {
                      paragraph: false,
                    },
                  },
                },
              },
              location: {
                index: 0,
              },
            },
          },
        ],
        writeControl: {
          targetRevisionId: googleForm.revisionId,
        },
      },
    })).data.form as unknown as GoogleForm;

    // adds extra data to the form object for Firestore
    form = {
      ...googleForm,
      assignedUsers: [],
      responseIds: [],
      schemaWatch: schemaWatch as unknown as Watch,
      responsesWatch: responsesWatch as unknown as Watch,
      swaligaIdQuestionId: (googleForm.items[0] as any).questionItem.question.questionId,
    };
  } catch (err) {
    console.log(err);
    throw Error('unable to create google form');
  }

  try {
    // updates the survey in Firestore
    await setDoc(doc(db, "surveys", form!.formId || ''), form);
    return form;
  } catch (err) {
    throw Error('cannot add survey to firestore');
  }
}

/* Retrieve form data given form id and update it to firebase.
* @params id - id of form
*/
export async function updateSurvey(formId: string) {
  let form = null;
  try {
    const forms = await getFormsClient();
    form = await forms.forms.get({ formId })
  } catch (err) {
    throw Error('unable to get google form');
  }

  try {
    await setDoc(doc(db, 'surveys', form.data.formId || ''), form.data, {merge: true});
    return form;
  } catch (err) {
    throw Error('unable to update survey in firestore');
  }
}

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