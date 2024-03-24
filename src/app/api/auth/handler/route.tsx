import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { setCredentials } from "@/lib/googleAuthorization";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  if (query.get("code")) {
    const credsSet = await setCredentials(query.get("code") as string);
    if (credsSet) {
      return NextResponse.redirect("http://localhost:3000");
    }
    redirect("/");
  }
  console.error(query.get("error"));
  redirect("/");
}
