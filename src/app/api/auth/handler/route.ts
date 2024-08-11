import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { setCredentialsWithAuthCode } from "@/lib/googleAuthorization";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  if (query.get("code")) {
    console.log(query.get("code"));
    const credsSet = await setCredentialsWithAuthCode(query.get("code") as string);
    if (credsSet) {
        return NextResponse.json({ success: true }, { status: 200 });
      //return NextResponse.redirect("http://localhost:3000");
    }
    //redirect("/");
  }
  console.error(query.get("error"));
  //redirect("/");
          return NextResponse.json({ success: true }, { status: 200 });

}
