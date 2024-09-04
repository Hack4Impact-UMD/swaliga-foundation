import { getFormsClient } from "@/lib/googleAuthorization";
import { GoogleFormResponse } from "@/types/survey-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const formId = queryParams.get("formId");
    console.log(formId);
    if (!formId) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
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