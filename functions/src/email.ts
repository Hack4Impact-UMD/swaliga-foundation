import { onCall } from "firebase-functions/https";
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { getOAuth2ClientWithCredentials } from "./auth";

let transporter: Promise<Transporter>;

async function createTransporter() {
  const oAuth2Client = await getOAuth2ClientWithCredentials();
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'nitin.kanchinadam@gmail.com',
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: oAuth2Client.credentials.refresh_token || undefined,
      accessToken: oAuth2Client.credentials.access_token || undefined
    },
    tls: process.env.NODE_ENV === 'development' ? { rejectUnauthorized: false } : undefined,
    logger: process.env.NODE_ENV === 'development' ? true : false,
    debug: process.env.NODE_ENV === 'development' ? true : false
  });
  return transporter;
}

async function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}


export const sendEmail = onCall(async (req) => {
  if (!req.auth || (req.auth.token.role !== 'ADMIN' && req.auth.token.role !== 'STAFF')) {
    throw new Error("Unauthorized");
  }

  try {
    const transporter = await getTransporter();
    const email: Mail.Options = req.data;
    await transporter.sendMail(email)
  } catch (error) {
    throw new Error("Failed to send email");
  }
});  