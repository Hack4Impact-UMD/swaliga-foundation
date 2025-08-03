import { functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import Mail from "nodemailer/lib/mailer";

export async function sendEmail(email: Mail.Options): Promise<void> {
  try {
    await httpsCallable(functions, "sendEmail")(email);
  } catch (error) {
    throw new Error("Failed to send email");
  }
}