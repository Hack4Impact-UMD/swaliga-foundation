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
import { validatePassword } from "firebase/auth";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // authenticates user
  const signInWithEmail = async () => {
    try {
      await loginUser(email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // creates account
  const createAccount = async () => {
    try {
      await signUpUser(email, password);
    } catch (error: any) {
      setError(error);
    }
  };

  const toggleLogin = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div className={styles.login_field_container}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                className={styles.login_field}
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              {isPasswordVisible ? (
                <MdVisibility onClick={togglePasswordVisibility} />
              ) : (
                <MdVisibilityOff onClick={togglePasswordVisibility} />
              )}
            </div>
            {!isLoginMode && (
              <div className={styles.login_field_container}>
                <input
                  type="password"
                  className={styles.login_field}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                />
              </div>
            )}
            <div className={styles.forgot_password}>
              <a href="/reset-password">Forgot password?</a>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              className={styles.login_button}
              onClick={isLoginMode ? signInWithEmail : createAccount}
            >
              Submit
            </button>
            <p className={styles.toggle_text}>
              {isLoginMode ? "Don't" : "Already"} have an account?
              <br />
              Click{" "}
              <a href="#" onClick={toggleLogin}>
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
              onClick={() => signInWithGoogle()}
            />
          </div>
        </div>
        <div className={styles.inverted_bg} />
      </div>
    </div>
  );
}
