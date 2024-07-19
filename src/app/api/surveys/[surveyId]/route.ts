import { NextRequest, NextResponse } from "next/server";
import { deleteSurveyByID, getAllSurveys, getSurveyByID } from "@/lib/firebase/database/surveys";

export async function generateStaticParams() {
  const surveys = await getAllSurveys();
  return surveys.map((survey) => ({ surveyId: survey.formId }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const { surveyId } = params;
  try {
    const survey = await getSurveyByID(surveyId);
    return NextResponse.json(survey, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "error getting survey by id" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { surveyId: string } }) {
  const { surveyId } = params;
  try {
    await deleteSurveyByID(surveyId);
    return NextResponse.json({ message: "survey deleted successfully" }, { status: 200 });
  } catch (err) {
    console.log('error deleting survey', err);
    return NextResponse.json({ message: "error deleting survey" }, { status: 500 });
  }
}