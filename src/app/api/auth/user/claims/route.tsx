import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdminConfig";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  try {
    adminAuth.setCustomUserClaims(body.uid, { role: "STUDENT" });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}