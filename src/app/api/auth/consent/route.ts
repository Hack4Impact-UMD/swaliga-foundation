import { isUserAdmin } from "@/lib/firebase/authentication/serverAuthentication";
import { getAuthUrl } from "@/lib/googleAuthorization";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.get("idToken")) {
    await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${`idToken not found`}`);
    return NextResponse.redirect("https://swaliga-foundation.web.app");
  } else if (!(await isUserAdmin(queryParams.get("idToken") || ""))) {
    await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${`user doesn't have admin privileges`}`);
    return NextResponse.redirect("https://swaliga-foundation.web.app");
  }
  const authUrl = await getAuthUrl();
  await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${authUrl}`);
  redirect(authUrl);
}
