import {forms } from '../../../lib/googleAuthorization';
import { db } from "../../../lib/firebase/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';

/* Retrieve form data given form id and update it to firebase. Returns the form data. 
* @params id - id of form 
*/
export async function updateForm(id: string) {
  try {
    const formsRef = doc(db, 'users', id);

    /* Retrieve form given id */
    const res = await forms.forms.get({formId: id})
    console.log("Updated form in firebase to: ", res.data);

    /* Update form in database */
    await setDoc(formsRef, res.data, { merge: true });
  } catch (error) {
    console.error('Error retrieving form or updating form in firebase: ', error);
    throw error;
  }
}