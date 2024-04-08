import { forms } from '../../googleAuthorization';
import { db } from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';

export async function createSurvey(body: {title: string, documentTitle: string}) {
  let form = null;
  try {
    form = await forms.forms.create({
      requestBody: {
        info: {
          title: body.title,
          documentTitle: body.documentTitle,
        },
      },
    });
  } catch (err) {
    throw Error('unable to create google form');
  }

  try {
    await setDoc(doc(db, "surveys", form.data.formId || ''), form.data);
    return form.data;
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