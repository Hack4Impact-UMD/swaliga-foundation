"use client";

import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import GoogleButton from "react-google-button";
import {
  loginUser,
  signUpUser,
} from "@/features/auth/authN/emailPasswordAuthN";
import { signInWithGoogle } from "@/features/auth/authN/googleAuthN";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleEmailPasswordLogin = async () => {
    try {
      await loginUser(email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    try {
      await signUpUser(email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    setError("");
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setError("");
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setConfirmPassword(confirmPassword);
    setError("");
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsPasswordVisible(false);
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.login}>
          <h1 className={styles.login_title}>
            {isLoginMode ? "Login" : "Sign Up"}
          </h1>
          <div className={styles.email_pw_container}>
            <div className={styles.login_field_container}>
              <input
                type="email"
                className={styles.login_field}
                placeholder="Email"
                value={email}
                onChange={(ev) => handleEmailChange(ev.target.value)}
              />
            </div>
            <div className={styles.login_field_container}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                className={styles.login_field}
                placeholder="Password"
                value={password}
                onChange={(ev) => handlePasswordChange(ev.target.value)}
              />
              {isPasswordVisible ? (
                <MdVisibility className={styles.passwordButton} onClick={togglePasswordVisibility} />
              ) : (
                <MdVisibilityOff className={styles.passwordButton} onClick={togglePasswordVisibility} />
              )}
            </div>
            {!isLoginMode && (
              <div className={styles.login_field_container}>
                <input
                  type="password"
                  className={styles.login_field}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(ev) =>
                    handleConfirmPasswordChange(ev.target.value)
                  }
                />
              </div>
            )}
            <div className={styles.forgot_password}>
              <a href="/reset-password">Forgot password?</a>
            </div>
            <p className={styles.error}>{error}</p>
            <button
              className={styles.login_button}
              onClick={isLoginMode ? handleEmailPasswordLogin : handleSignUp}
            >
              {isLoginMode ? "Login" : "Sign Up"}
            </button>
            <p className={styles.toggle_text}>
              {isLoginMode ? "Don't" : "Already"} have an account?
              <br />
              Click{" "}
              <a href="#" onClick={toggleMode}>
                here
              </a>{" "}
              to {isLoginMode ? "sign up" : "login"}
            </p>
          </div>
          <div className={styles.divider}>
            <hr className={styles.divider_line} />
            <p className={styles.divider_text}>OR</p>
            <hr className={styles.divider_line} />
          </div>
          <div className={styles.google_container}>
            <GoogleButton
              className={styles.google_container}
              onClick={handleGoogleLogin}
            />
          </div>
        </div>
        <div className={styles.inverted_bg} />
      </div>
    </div>
  );
}
