"use client";

import styles from "./SendResetPasswordEmailPage.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { sendResetPasswordEmail } from "@/features/auth/authN/emailPasswordAuthN";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendResetPasswordEmailPage() {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleResetButtonClick = async () => {
    try {
      await sendResetPasswordEmail(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    setError("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.header}>Reset Password</h1>
          <input
            className={styles.inputField}
            placeholder="Email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleResetButtonClick}
          >
            Send Reset Email
          </button>
          <p
            className={`${styles.message} ${
              success ? styles.success : styles.error
            }`}
          >
            {success
              ? "A password reset email was successfully sent! Please check your email."
              : error}
          </p>
        </div>
        <div className={styles.returnButtonContainer}>
          <button
            className={`${styles.button} ${styles.returnHomeButton}`}
            onClick={() => router.push("/")}
          >
            <FaArrowLeft /> Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
