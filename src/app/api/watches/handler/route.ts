import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdminConfig";
import { GoogleFormResponse, Survey, Response } from "@/types/survey-types";
import { getFormsClient } from "@/lib/googleAuthorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, formId } = body;
    if (eventType === "RESPONSES") {
      await createResponse(formId);
    } else {
      await updateSurvey(formId);
    }
    return NextResponse.json({ message: "watch event successfully handled" }, { status: 200 });
  } catch (err) {
    console.log("unable to handle watch event");
    return NextResponse.json({ error: "unable to handle watch event" }, { status: 500 });
  }
}

async function createResponse(formId: string) {
  const forms = await getFormsClient();
  const responses = await forms.forms.responses.list({ formId });
  const googleResponseData = responses.data.responses as GoogleFormResponse[] || [];

  const response = await adminDb.doc(`/surveys/${formId}`).get();
  const form = response.data() as Survey;
  const existingResponseIds = form?.responseIds;

  googleResponseData.forEach(async (response: GoogleFormResponse) => {
    if (!existingResponseIds?.includes(response.responseId)) {
      const formTitle = form.info.title;
      const formId = form.formId;
      const swaligaId: number = parseInt((response.answers[form.swaligaIdQuestionId] as any).textAnswers.answers[0].value);
      const user = (await adminDb.collection("/users").where("swaligaID", "==", swaligaId).limit(1).get()).docs[0].data();
      const userId = user.id;

      const updatedResponse: Response = {
        ...response,
        userId,
        formId,
        formTitle,
      };

      adminDb.runTransaction(async (transaction) => {
        transaction.create(adminDb.doc(`/responses/${response.responseId}`), { ...updatedResponse });
        transaction.update(adminDb.doc(`/users/${userId}`), {
          completedResponses: [...user.completedResponses, response.responseId],
          assignedSurveys: user.assignedSurveys.filter((surveyId: string) => surveyId !== formId),
        });
        transaction.update(adminDb.doc(`/surveys/${formId}`), {
          responseIds: [...form.responseIds, response.responseId],
          assignedUsers: form.assignedUsers.filter((id: string) => id !== userId),
        });
      });
    }
  });
}

async function updateSurvey(formId: string) {
  const forms = await getFormsClient();
  const form = await forms.forms.get({ formId });
  adminDb.doc(`/surveys/${form.data.formId}`).set(form.data, { merge: true });
}