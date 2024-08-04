import { NextRequest, NextResponse } from "next/server";
import { createSurvey, getAllSurveys } from "@/lib/firebase/database/surveys";

export async function GET() {
  try {
    const allSurveys = await getAllSurveys();
    return NextResponse.json(allSurveys, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'error getting all surveys' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const survey = await createSurvey(body);
    return NextResponse.json(survey, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'error creating survey' }, { status: 500 });
  }
}
