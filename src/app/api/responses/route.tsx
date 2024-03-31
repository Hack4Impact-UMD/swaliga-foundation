import { Request, Response } from 'express';
import { db } from "../../../lib/firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs, DocumentData, DocumentSnapshot, getDoc } from 'firebase/firestore';

interface ResponseObject {
  formId: string;
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  respondentEmail: string;
  answers: {
    [key: string]: any;
  };
  totalScore?: number;
}

export const getAllResponses = async (req: Request, res: Response) => {
  try {
    const responsesSnapshot = await getDocs(collection(db, 'responses'));
    const allResponses: ResponseObject[] = [];
    responsesSnapshot.forEach((doc) => {
      allResponses.push(doc.data() as ResponseObject);
    });
    res.status(200).json(allResponses);
  } catch (error) {
    console.error('Error getting responses:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const createResponse = async (req: Request, res: Response) => {
  try {
    const newResponse: ResponseObject = req.body;
    await setDoc(doc(db, 'responses', 'new'), newResponse);
    res.status(201).send('Response created successfully');
  } catch (error) {
    console.error('Error creating response:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getResponseByID = async (req: Request, res: Response) => {
  try {
    const responseId = req.params.responseId;
    const responseDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'responses', responseId));
    if (responseDoc.exists()) {
      const response = responseDoc.data() as ResponseObject;
      res.status(200).json(response);
    } else {
      res.status(404).send('Response not found');
    }
  } catch (error) {
    console.error('Error getting response by ID:', error);
    res.status(500).send('Internal Server Error');
  }
};
