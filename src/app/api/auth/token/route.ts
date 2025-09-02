import { adminAuth } from "@/config/firebaseAdminConfig";
import { fetchAccessToken, isIdTokenValid } from "@/features/auth/authZ/serverAuthZ";
import { AdminCustomClaims, DecodedIdTokenWithCustomClaims, GoogleTokens, StaffCustomClaims } from "@/types/auth-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  let decodedToken: DecodedIdTokenWithCustomClaims | false;
  if (!(decodedToken = await isIdTokenValid(idToken))) {
    return NextResponse.json("Unauthorized", { status: 401, statusText: "Unauthorized" });
  } else if (decodedToken.role !== "ADMIN" && decodedToken.role !== "STAFF") {
    return NextResponse.json("You do not have permission to perform this action.", { status: 403, statusText: "Forbidden" });
  }

  if (decodedToken.role === "ADMIN") {
    var refreshToken: string | undefined = decodedToken.googleTokens?.refreshToken;
  } else {
    const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL || "");
    var refreshToken: string | undefined = adminUser.customClaims?.googleTokens?.refreshToken;
  }
  if (!refreshToken) {
    return NextResponse.json("No refresh token found", { status: 400, statusText: "Bad Request" });
  }

  let tokenData: GoogleTokens;
  try {
    tokenData = await fetchAccessToken(refreshToken);
  } catch (error) {
    return NextResponse.json("Failed to refresh access token", { status: 500, statusText: "Internal Server Error" });
  }

  const customClaims: AdminCustomClaims | StaffCustomClaims =
    decodedToken.role === "ADMIN" ?
      {
        role: decodedToken.role,
        googleTokens: tokenData
      } satisfies AdminCustomClaims :
      {
        role: decodedToken.role,
        googleTokens: {
          accessToken: tokenData.accessToken,
          expirationTime: tokenData.expirationTime
        }
      } satisfies StaffCustomClaims
  await adminAuth.setCustomUserClaims(decodedToken.uid, customClaims)
  return NextResponse.json(tokenData.accessToken, { status: 200, statusText: "OK" });
}