import { GoogleForm, Survey } from '@/types/survey-types';
import { getFormsClient } from '../../googleAuthorization';
import { db } from "../firebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { createWatch } from './watches';
import { Watch } from '@/types/watch-types';

export async function createSurvey(body: {title: string, documentTitle: string}) {
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
    
    const schemaWatch = await createWatch(googleForm.formId || '', "SCHEMA");
    const responsesWatch = await createWatch(googleForm.formId || '', "RESPONSES");

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
    console.log('form', form);
    await setDoc(doc(db, "surveys", form!.formId || ''), form);
    return form;
  } catch (err) {
    throw Error('cannot add survey to firestore');
  }
}

/* Retrieve form data given form id and update it to firebase.
* @params id - id of form
*/
export async function updateSurvey(id: string) {
  let form = null;
  try {
    const forms = await getFormsClient();
    form = await forms.forms.get({formId: id})
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

export async function deleteSurveyByID(id: string) {
  try {
    await deleteDoc(doc(db, 'surveys', id));
  } catch (err) {
    console.log(err);
    throw Error('unable to delete survey');
  }
}