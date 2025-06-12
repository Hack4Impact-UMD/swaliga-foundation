import { sendVerificationEmail } from "@/features/auth/authN/emailPasswordAuthN";
import styles from "./SendVerificationEmailPage.module.css";
import { useState } from "react";
import useAuth from "@/features/auth/useAuth";

export default function SendVerificationEmailPage() {
  const [error, setError] = useState<string>("");

  const auth = useAuth();

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail(auth.user!);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.header}>We've sent you a verification email!</h2>
        <p className={styles.message}>
          If you didn't receive the email, please check your spam folder or
          click the button below to send another one.
        </p>
        <button className={styles.button} onClick={handleSendVerificationEmail}>
          Resend Verification Email
        </button>
        <p className={`${styles.message} ${styles.error}`}>{error}</p>
      </div>
    </div>
  );
}
