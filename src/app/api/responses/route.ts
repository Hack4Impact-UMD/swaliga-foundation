// pages/route.tsx

import { NextRequest, NextResponse } from 'next/server';
import { getAllResponses, createResponse } from '@/lib/firebase/database/response';
import { GoogleFormResponse, Response, Survey } from '@/types/survey-types';
import { getFormsClient } from '@/lib/googleForms';
import { getSurveyByID } from '@/lib/firebase/database/surveys';

// gets all responses
export async function GET(req: NextRequest) {
  try {
    const allResponses = await getAllResponses();
    return NextResponse.json(allResponses, { status: 200 });
  } catch (error) {
    console.error('Error getting responses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// given a formId, syncs all the responses in Firestore with those in Google Forms 
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { formId } = body;
  try {
    const forms = await getFormsClient();
    const googleResponses = await forms.forms.responses.list({ formId });
    const googleResponseData = (googleResponses.data.responses as GoogleFormResponse[]) || [];
    console.log(googleResponseData);

    const form = await getSurveyByID(formId) as Survey;
    const existingResponseIds = form?.responseIds;
    console.log(existingResponseIds);

    googleResponseData.forEach(async (response: GoogleFormResponse) => {
      if (!existingResponseIds?.includes(response.responseId)) {
        const formTitle = form.info.title;
        const formId = form.formId;
        const userId = (response.answers[form.swaligaIdQuestionId] as any).textAnswers.answers[0].value;
        const updatedResponse: Response = { ...response, userId, formId, formTitle }
        await createResponse(updatedResponse);
      }
    })    

    return NextResponse.json({ message: `Response of form ${formId} successfully updated` }, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
