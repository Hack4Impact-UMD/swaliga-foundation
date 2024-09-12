import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdminConfig";
import { Role } from "@/types/user-types";

// sets the role user claim to "REGISTERING" for new account with the given uid
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  try {
    const role = (await adminAuth.getUser(body.uid)).customClaims?.role;
    if (!role) {
      await adminAuth.setCustomUserClaims(body.uid, { role: Role.REGISTERING });
      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Role already set" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
