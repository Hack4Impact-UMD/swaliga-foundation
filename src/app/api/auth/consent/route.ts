import { isUserAdmin } from "@/lib/firebase/authentication/serverAuthentication";
import { getAuthUrl } from "@/lib/googleAuthorization";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.get("idToken")) {
    await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${`idToken not found`}`);
    console.log('failure 1')
    return NextResponse.redirect("https://swaliga-foundation.web.app");
  } else if (!(await isUserAdmin(queryParams.get("idToken") || ""))) {
    console.log('failure 2')
    await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${`user doesn't have admin privileges`}`);
    return NextResponse.redirect("https://swaliga-foundation.web.app");
  }
  const authUrl = await getAuthUrl();
  console.log(authUrl);
  await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${authUrl}`);
  try {
    console.log('success')
    return NextResponse.redirect(authUrl);
  } catch (e: any) {
    console.log('failure 3')
    console.log(e)
    await fetch(`https://logger-fuicsqotja-uk.a.run.app?message=${`error: ${e}`}`);
    return NextResponse.redirect("https://swaliga-foundation.web.app");
  }
}
