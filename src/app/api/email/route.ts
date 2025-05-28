import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/features/notifications/email";
import { getGmailClient } from "@/features/auth/googleAuthorization";
import { isUserAdmin } from "@/features/auth/serverAuthentication";

// sends an email with the provided content to the provided recipients
export async function POST(req: NextRequest) {
    try {
        const { recipients, subject, text, idToken } = await req.json();
        if (!recipients || !subject || !text || !idToken) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        } else if (!(await isUserAdmin(idToken))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await sendEmail({ recipients, subject, text });
        return NextResponse.json({ message: 'Emails successfully sent' }, { status: 200 });
    } catch (err) {
        console.error("Error sending email");
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}