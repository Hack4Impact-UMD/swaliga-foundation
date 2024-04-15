import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/firebase/database/email";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const email = await sendEmail(body);
        return NextResponse.json({message: 'emails successfully sent'}, {status: 200}); 
    } catch (err) {
        return NextResponse.json({error: 'error sending email'}, {status: 500});
    }
}