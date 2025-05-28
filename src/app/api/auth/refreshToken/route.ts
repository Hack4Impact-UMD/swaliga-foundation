import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/firebaseConfig";
import { isRefreshTokenValid } from "@/features/auth/googleAuthorization";

// refreshs the admin account's refresh token if it does not exist or has expired
export async function GET(req: NextRequest): Promise<NextResponse> {
  const valid = await isRefreshTokenValid();
  return NextResponse.json(valid, { status: 200 });
}
