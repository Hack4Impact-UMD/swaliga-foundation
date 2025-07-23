import { functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";

export interface Email {
  recipients: string[];
  subject: string;
  html: string;
}

export async function sendEmail(email: Email): Promise<void> {
  try {
    await httpsCallable(functions, "sendEmail")(email);
  } catch (error) {
    throw new Error("Failed to send email");
  }
}