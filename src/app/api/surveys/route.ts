import { NextRequest, NextResponse } from "next/server";
import { createSurvey } from "@/lib/firebase/database/surveys";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const survey = await createSurvey(body);
    return NextResponse.json({data: survey}, {status: 200});
  } catch (err) {
    return NextResponse.json({error: 'error creating survey'}, {status: 500});
  }
}
