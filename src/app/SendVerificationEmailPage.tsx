import { sendVerificationEmail } from "@/features/auth/authN/emailPasswordAuthN";
import styles from "./SendVerificationEmailPage.module.css";
import { useState } from "react";
import useAuth from "@/features/auth/authN/components/useAuth";
import BlankBackgroundPage from "@/components/layout/pages/BlankBackgroundPage";

export default function SendVerificationEmailPage() {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const auth = useAuth();

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail(auth.user!);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <BlankBackgroundPage backgroundColor="#295972">
      <div className={styles.container}>
        <h2 className={styles.header}>We've sent you a verification email!</h2>
        <p className={styles.message}>
          If you didn't receive the email, please check your spam folder or
          click the button below to send another one.
        </p>
        <button className={styles.button} onClick={handleSendVerificationEmail}>
          Resend Verification Email
        </button>
        <p
          className={`${styles.message} ${
            success ? styles.success : styles.error
          }`}
        >
          {success
            ? "Verification email sent successfully! Please check your email."
            : error}
        </p>
      </div>
    </BlankBackgroundPage>
  );
}
