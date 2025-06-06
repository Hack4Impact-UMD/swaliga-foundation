"use client";

import styles from "./ResetPasswordPage.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import CompanyLogoWords from "@/../public/images/logo2.svg";
import React, { useState } from "react";
import { auth } from "@/config/firebaseConfig"; // Path to firebaseConfig.ts
import { sendPasswordResetEmail } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RequireAuth from "@/features/auth/RequireAuth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: any) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email to reset password");
    } catch (error) {
      setError("Email not found");
      console.error("Error resetting password");
    }
  };

  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <div className={styles.page}>
        <div className={styles.logoSide}>
          <Image
            id={styles.design}
            src={CompanyLogo.src}
            alt="Company Logo"
            width={500}
            height={200}
          />
          <Image
            id={styles.sitename}
            src={CompanyLogoWords.src}
            alt="Company Logo with Words (SwaligaFoundation.org)"
            width={1000}
            height={400}
          />
        </div>
        <div className={styles.formSide}>
          <div className={styles.innerBox}>
            <p className={styles.title}>Reset Password</p>
            <form className={styles.form} onSubmit={handleReset}>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={styles.input}
                type="email"
                placeholder="Enter your email"
              />
              <button className={styles.submit} type="submit">
                Reset Password
              </button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <button
              className={styles.backToLoginButton}
              onClick={() => router.push("/")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
