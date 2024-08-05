import nodemailer from "nodemailer";
import { auth } from "./firebase/firebaseConfig";
import { oauth2Client, setCredentials } from "./googleAuthorization";
import { google } from "googleapis";

async function getGmailClient() {
  await setCredentials();
  return google.gmail({ version: "v1", auth: oauth2Client });
}

export async function sendEmail(body: { recipients: string[], subject: string, text: string }) {
    const { recipients, subject, text } = body;
    const gmailClient = await getGmailClient();
    for (const recipient of recipients) {
        const emailInfo = await gmailClient.users.messages.send({
         userId: "me",
         requestBody: {
           raw: Buffer.from(`To: ${"nitin.kanchinadam@gmail.com"}
           Subject: ${"test 123"}
           ${"pls fucking work"}`).toString("base64"),
         }
        });

        try {
            console.log(emailInfo)
        } catch (err) {
            throw Error('Unable to send email');
        }
    }
}