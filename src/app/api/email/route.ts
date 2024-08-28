import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getGmailClient } from "@/lib/googleAuthorization";

// sends an email with the provided content to the provided recipients
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await sendEmail(body);
        return NextResponse.json({ message: 'Emails successfully sent' }, { status: 200 }); 
    } catch (err) {
        console.error("Error in POST request:", err);
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}