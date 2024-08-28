import { getGmailClient } from "./googleAuthorization";

export async function sendEmail(body: {
  recipients: string[];
  subject: string;
  text: string;
}) {
  const { recipients, subject, text } = body;
  const gmailClient = await getGmailClient();
  for (const recipient of recipients) {
    try {
      await gmailClient.users.messages.send({
        userId: "me",
        requestBody: {
          raw: Buffer.from(
            `Subject: ${subject}\r\nTo: ${recipient}\r\n
              ${text}`
          ).toString("base64"),
        },
      });
    } catch (err) {
      throw Error("unable to send email");
    }
  }
}
