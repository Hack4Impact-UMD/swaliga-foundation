import { NextRequest, NextResponse } from "next/server";
import { updateRefreshToken } from "@/lib/googleAuthorization";

// refreshs the admin account's refresh token if it does not exist or has expired
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await updateRefreshToken();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
