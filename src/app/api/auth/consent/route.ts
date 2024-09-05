import { isUserAdmin } from "@/lib/firebase/authentication/serverAuthentication";
import { getAuthUrl } from "@/lib/googleAuthorization";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.get("idToken")) {
    return NextResponse.redirect("http://localhost:3000");
  } else if (!(await isUserAdmin(queryParams.get("idToken") || ""))) {
    return NextResponse.redirect("http://localhost:3000");
  }
  const authUrl = await getAuthUrl();
  redirect(authUrl);
}
