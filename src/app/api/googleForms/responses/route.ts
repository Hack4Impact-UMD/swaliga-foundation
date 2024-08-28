import { getFormsClient } from "@/lib/googleAuthorization";
import { GoogleFormResponse } from "@/types/survey-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const body: { formId: string } = await req.json();
    const { formId } = body;
    const forms = await getFormsClient();
    const responses = await forms.forms.responses.list({ formId });
    return NextResponse.json(
      responses.data.responses as GoogleFormResponse[] || [],
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to Load Data" }, { status: 500 });
  }
}