import { google } from 'googleapis';
import { oauth2Client } from "../../../lib/googleAuthorization";
import { db } from "../../../lib/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from 'next';

const auth = oauth2Client;
const forms = google.forms({
  version: "v1",
  auth: auth,
});

// client-server
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { formId, question, itemIndex } = req.body;
      const result = await createQuestion(formId, question, itemIndex);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create question' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { formId, itemIndex, updatedQuestion } = req.body;
      const result = await editQuestion(formId, itemIndex, updatedQuestion);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to edit question' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { formId, itemIndex } = req.body;
      const result = await deleteQuestion(formId, itemIndex);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to delete question' });
    }
  } else {
    res.status(405).end();
  }
}

/* Creates a question in the form and then updates the firebase db to reflect the addition.
 * @param formId - pass in the id of the form
 * @param question - pass in the question to create. The question should be a Question object
 * @param questionNumber - pass in the position of the question, e.g., passing in 0 will add the question to the beginning of form */
export async function createQuestion(
  formId: string,
  question: any,
  itemIndex: number
) {
  try {
    const request = {
      includeFormInResponse: true,
      requests: [
        {
          createItem: {
            item: {
              questionItem: question,
            },
            location: { index: itemIndex },
          },
        },
      ],
    };

    const res = await forms.forms.batchUpdate({
      auth,
      formId,
      requestBody: request,
    });

    await updateDB(formId, res.data.form);
    return res.data;
  } catch (error) {
    console.log("Error with creating a question: ", error);
    throw error;
  }
}

/* Edits a question in the form given the index of the question and the updated question
 * @params formId - the form id
 * @params itemIndex - the index of the item to be edited. Used to locate the question item
 * @params updatedQuestion - the question to update the question object with */
export async function editQuestion(
  formId: string,
  itemIndex: number,
  updatedQuestion: any
) {
  try {
    const request = {
      includeFormInResponse: true,
      requests: [
        {
          updateItem: {
            item: {
              questionItem: {
                question: updatedQuestion,
              },
              location: {
                index: itemIndex,
              },
              updateMask: "question",
            },
          },
        },
      ],
    };

    const res = await forms.forms.batchUpdate({
      auth,
      formId,
      requestBody: request,
    });

    await updateDB(formId, res.data.form);
    return res.data;
  } catch (error) {
    console.log("Error with editing a question: ", error);
    throw error;
  }
}

/* Deletes a question in the form given the index of the question
 * @params formId - the form id
 * @params itemIndex - the index of the item to be edited. Used for locating the question
 * @params updatedQuestion - the question to update the question object with */
export async function deleteQuestion(formId: string, itemIndex: number) {
  try {
    const request = {
      includeFormInResponse: true,
      requests: [
        {
          deleteItem: {
            location: { index: itemIndex },
          },
        },
      ],
    };

    const res = await forms.forms.batchUpdate({
      auth,
      formId,
      requestBody: request,
    });

    await updateDB(formId, res.data.form);
    return res.data;
  } catch (error) {
    console.log("Error with deleting a question: ", error);
    throw error;
  }
}

/* Sends the updated form to the firebase db forms collection. Uses setDoc() to overwrite fields in the document
 * or creates them if they don't exist.
 * @params formId - the form id used to identify the form amongst the collection
 * @params formData - the updated data in the form used to replace the data existing in the form doc*/
async function updateDB(formId: string, formData: any) {
  try {
    const formsRef = doc(db, "forms", formId);
    await setDoc(formsRef, formData, { merge: true });
    console.log("Form updated in Firebase:", formId);
  } catch (error) {
    console.error("Error updating form in Firebase:", error);
    throw error;
  }
}
