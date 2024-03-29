import { NextResponse } from "next/server";
import { listenForMessages } from "@/lib/pubsub";

export async function GET() {
  listenForMessages();
  return NextResponse.redirect('http://localhost:3000')
}
