import { adminAuth } from "@/config/firebaseAdminConfig";
import { fetchAccessToken, isIdTokenValid } from "@/features/auth/serverAuthZ";
import { AuthCustomClaims, DecodedIdTokenWithCustomClaims, GoogleTokens } from "@/types/auth-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isIdTokenValid(idToken))) {
    return NextResponse.json("Unauthorized", { status: 401, statusText: "Unauthorized" });
  }

  const refreshToken: string | undefined = decodedToken.googleTokens?.refreshToken;
  if (!refreshToken) {
    return NextResponse.json("No refresh token found", { status: 400, statusText: "Bad Request" });
  }

  let tokenData: GoogleTokens;
  try {
    tokenData = await fetchAccessToken(refreshToken);
  } catch (error) {
    return NextResponse.json("Failed to refresh access token", { status: 500, statusText: "Internal Server Error" });
  }

  const customClaims: AuthCustomClaims = {
    role: decodedToken.role,
    googleTokens: tokenData
  }
  await adminAuth.setCustomUserClaims(decodedToken.uid, customClaims)
  return NextResponse.json(tokenData.accessToken, { status: 200, statusText: "OK" });
}