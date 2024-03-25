import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { oauth2Client } from "@/lib/googleAuthorization";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  if (query.get("code")) {
    try {
      const { tokens } = await oauth2Client.getToken(query.get("code") as string);
      oauth2Client.setCredentials(tokens);
      console.log("Test: ", tokens);
      return NextResponse.redirect('http://localhost:3000');
    } catch (err) {
      console.error("getting tokens failed");
      redirect('/');
    }
  }
  console.error(query.get('error'));
  redirect('/');
}
