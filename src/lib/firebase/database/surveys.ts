import { forms } from '../../googleAuthorization';
import { db } from "../firebaseConfig";
import {collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

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
    throw Error('cannot add survey to firestore')
  }
}

/* Retrieve form data given form id and update it to firebase.
* @params id - id of form, not document id of the form.
*/
export async function updateForm(id: string) {
  try {
    const res = await forms.forms.get({formId: id})
    console.log("Content to update with: ", res.data);

    /* Find the document with the matching formid */
    const q = query(collection(db, 'surveys'), where("formId", "==", id));
    const querySnapshot = await getDocs(q);
    
    // Check if there's a matching document
    if (querySnapshot.size === 0) {
      console.log("No document with the specified formId found.");
      return;
    }
    
    //in any case we have multiple form ids, just change the first
    const docSnapshot = querySnapshot.docs[0];
    await setDoc(docSnapshot.ref, res.data, { merge: true });

     // Print the form's content to confirm it contains the updated content
    const formData = docSnapshot.data();
    console.log("Updated form: ", formData);
    return formData;
  } catch (error) {
    console.error('Error retrieving form or updating form in firebase: ', error);
    throw error;
  }
}