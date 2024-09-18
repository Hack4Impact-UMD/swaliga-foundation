import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isRefreshTokenValid, setAdminRefreshToken } from "@/lib/googleAuthorization";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  if (query.get("code")) {
    console.log(query.get("code"));
    const authCode = query.get("code") || "";
    const updateNeeded = !(await isRefreshTokenValid());
    if (updateNeeded) {
      const credsSet = await setAdminRefreshToken(authCode);
      if (credsSet) {
        return NextResponse.redirect("https://swaliga-foundation.web.app");
      }
    }
    redirect("/");
  }
  console.error(query.get("error"));
  redirect("/");
}
