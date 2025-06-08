import { getAllSurveys } from "@/data/firestore/surveys";
import { renewWatch } from "@/data/watches";
import { Survey } from "@/types/survey-types";
import { NextRequest, NextResponse } from "next/server";

// renews all watches for currently active surveys
export async function POST(req: NextRequest) {
  try {
    const surveys: Survey[] = await getAllSurveys();
    surveys.forEach((survey: Survey) => {
      renewWatch(survey.formId, survey.responsesWatch.id);
      renewWatch(survey.formId, survey.schemaWatch.id);
    });
    return NextResponse.json({ message: "all watches renewed" }, { status: 200 });
  } catch (err) {
    console.error("error renewing all watches");
    return NextResponse.json({ error: 'error renewing all watches' }, { status: 500 });
  }
}