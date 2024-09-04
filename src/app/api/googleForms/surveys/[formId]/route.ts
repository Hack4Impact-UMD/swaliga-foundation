import { getFormsClient } from "@/lib/googleAuthorization";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
  const { formId } = params;
  try {
    const forms = await getFormsClient();
    const form = await forms.forms.get({ formId });
    return NextResponse.json(form, { status: 200 });
  } catch (err) {
    throw NextResponse.json(
      { error: "unable to get google form" },
      { status: 500 }
    );
  }
}
