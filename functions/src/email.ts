import { adminAuth } from "@/config/firebaseAdminConfig";
import { fetchAccessToken } from "@/features/auth/serverAuthZ";
import { onCall } from "firebase-functions/https";
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

let transporter: Promise<Transporter>;

async function createTransporter() {
  const adminUser = await adminAuth.getUserByEmail(process.env.ADMIN_EMAIL!);
  const { refreshToken, accessToken } = await fetchAccessToken(adminUser.customClaims?.googleTokens?.refreshToken || '');
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'nitin.kanchinadam@gmail.com',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken
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


export const sendEmail = onCall(async (data) => {
  try {
    const transporter = await getTransporter();
    const email: Mail.Options = data.data;
    await transporter.sendMail(email)
  } catch (error) {
    throw new Error("Failed to send email");
  }
});  