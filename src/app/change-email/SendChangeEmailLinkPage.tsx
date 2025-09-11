"use client";

import ImageBackgroundPage from "@/components/layout/pages/ImageBackgroundPage";
import useAuth from "@/features/auth/authN/components/useAuth";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { useState } from "react";
import styles from "./SendChangeEmailLinkPage.module.css";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { sendChangeEmailLink } from "@/features/auth/authN/accountLinking";

export default function SendChangeEmailLinkPage() {
  const [newEmail, setNewEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");

  const router = useRouter();
  const auth = useAuth();

  const handleNewEmailChange = (email: string) => {
    setStatus("IDLE");
    setNewEmail(email);
  };

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    setStatus("LOADING");
    sendChangeEmailLink(newEmail)
      .then(() => setStatus("SUCCESS"))
      .catch(() => setStatus("ERROR"));
  };

  return (
    <ImageBackgroundPage>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.header}>Change Email</h1>
          <input
            className={styles.inputField}
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => handleNewEmailChange(e.target.value)}
          />
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleChangeEmail}
          >
            Change Email
          </button>
          <p
            className={`${styles.message} ${
              status === "SUCCESS" ? styles.success : styles.error
            }`}
          >
            {status === "SUCCESS"
              ? `We've sent a confirmation link to ${newEmail}. Please check your inbox (and spam folder) to find the link. If you wish to undo this change, please follow the link in the recovery email that was sent to ${auth.user?.email}`
              : status === "ERROR"
              ? "An error occurred while sending the confirmation link to your new email. Please try again."
              : ""}
          </p>
        </div>
        <div className={styles.returnButtonContainer}>
          <button
            className={`${styles.button} ${styles.returnHomeButton}`}
            onClick={() => router.push("/")}
          >
            <FaArrowLeft /> Return to Home
          </button>
        </div>
      </div>
    </ImageBackgroundPage>
  );
}
