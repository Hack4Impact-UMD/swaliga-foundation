import { NextRequest, NextResponse } from "next/server";
import { deleteSurveyByID, getSurveyByID, updateSurvey } from "@/lib/firebase/database/surveys";

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

export async function PUT(req: NextRequest, { params }: { params: { surveyId: string } }) {
  const { surveyId } = params;
  try {
    await updateSurvey(surveyId);
    return NextResponse.json({ message: "survey updated successfully" }, { status: 200 });
  } catch (err) {
    console.log('error updating survey', err);
    return NextResponse.json({ error: "error updating survey" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { surveyId: string } }) {
  const { surveyId } = params;
  try {
    await deleteSurveyByID(surveyId);
    return NextResponse.json({ message: "survey deleted successfully" }, { status: 200 });
  } catch (err) {
    console.log('error deleting survey', err);
    return NextResponse.json({ error: "error deleting survey" }, { status: 500 });
  }
}