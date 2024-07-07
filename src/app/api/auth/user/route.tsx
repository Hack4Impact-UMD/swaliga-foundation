import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdminConfig";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body.uid:', body.uid);
  adminAuth.setCustomUserClaims(body.uid, { role: "STUDENT" });
  return NextResponse.json({ success: true }, { status: 200 });
}
