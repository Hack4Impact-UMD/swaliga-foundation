import { NextRequest, NextResponse } from "next/server";
import { getSurveyByID } from "@/lib/firebase/database/surveys";

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
