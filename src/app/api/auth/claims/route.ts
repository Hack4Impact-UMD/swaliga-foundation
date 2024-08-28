import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdminConfig";

// sets the role user claim to "STUDENT" for new account with the given uid
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  try {
    await adminAuth.setCustomUserClaims(body.uid, { role: "ADMIN" });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
