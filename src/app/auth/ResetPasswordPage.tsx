"use client";

import styles from "./ResetPasswordPage.module.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { resetPassword } from "@/features/auth/authN/emailPasswordAuthN";
import Link from "next/link";

interface ResetPasswordPageProps {
  oobCode: string;
}

export default function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { oobCode } = props;
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleResetPasswordSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(oobCode, password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setError("");
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setConfirmPassword(confirmPassword);
    setError("");
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.header}>Reset Password</h1>
        <div className={styles.fieldContainer}>
          <input
            className={styles.inputField}
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(ev) => handlePasswordChange(ev.target.value)}
          />
          {isPasswordVisible ? (
            <MdVisibility onClick={togglePasswordVisibility} />
          ) : (
            <MdVisibilityOff onClick={togglePasswordVisibility} />
          )}
        </div>
        <div className={styles.fieldContainer}>
          <input
            className={styles.inputField}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(ev) => handleConfirmPasswordChange(ev.target.value)}
          />
        </div>
        <p
          className={`${styles.message} ${
            success ? styles.success : styles.error
          }`}
        >
          {success ? (
            <>
              Password reset successful! You will be redirected to the home page
              shortly. To go there now, click <Link href="/">here</Link>.
            </>
          ) : (
            error
          )}
        </p>
        <button className={styles.button} onClick={handleResetPasswordSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
