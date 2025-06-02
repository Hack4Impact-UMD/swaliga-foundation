"use client";

import React, { useEffect, useState, useCallback } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./LoginPage.module.css";
import { getPolygonBackground, getPolygonOverlay } from "./polygons";
import GoogleButton from "react-google-button";
import {
  loginUser,
  signUpUser,
} from "@/features/auth/authN/emailPasswordAuthN";
import { signInWithGoogle } from "@/features/auth/authN/googleAuthN";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RequireAuth from "@/features/auth/RequireAuth";

enum LoginPageErrors {
  ACCOUNT_CREATION_FAILED = "Failed to create account",
  LOGIN_FAILED = "Failed to login",
  PASSWORD_TOO_SHORT = "Password must be at least 6 characters",
  PASSWORDS_DONT_MATCH = "Passwords do not match",
}

export default function LoginPage() {
  const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });
  const [polygonBackground, setPolygonBackground] = useState<Polygon[]>([]);
  const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<LoginPageErrors | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setAllPolygons(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      setAllPolygons(window.innerWidth, window.innerHeight);
    });
  }, []);

  const setAllPolygons = (width: number, height: number) => {
    setDims({ width, height });
    setPolygonBackground(getPolygonBackground(width, height));
    setPolygonOverlay(getPolygonOverlay(width, height));
  };

  // renders the polygons in the background of the Login Page from ./polygons.ts
  const drawPolygon = useCallback(
    (polygon: Polygon) => (
      <Line
        key={polygon.points.toString()}
        points={polygon.points}
        fill={polygon.fill}
        closed
        stroke="black"
        strokeWidth={0}
      />
    ),
    []
  );

  // authenticates user
  const signInWithEmail = async () => {
    try {
      await loginUser(email, password);
    } catch (error: any) {
      setError(error)
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
    setIsLogin(!isLogin);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const onPasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (!isLogin) {
      setError(
        newPassword.length < 6 ? LoginPageErrors.PASSWORD_TOO_SHORT : null
      );
    }
  };

  const onConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    setError(
      newConfirmPassword === password
        ? null
        : LoginPageErrors.PASSWORDS_DONT_MATCH
    );
  };

  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <div className={styles.container}>
        <div className={styles.background}>
          <Stage
            className={styles.stage}
            width={dims.width}
            height={dims.height}
          >
            <Layer>
              {polygonBackground.map(drawPolygon)}
              {polygonOverlay.map(drawPolygon)}
            </Layer>
          </Stage>
          <div className={styles.login}>
            <h1 className={styles.login_title}>
              {isLogin ? "Login" : "Sign Up"}
            </h1>
            <div className={styles.login_field_container}>
              <input
                type="email"
                className={styles.login_field}
                placeholder="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div className={styles.login_field_container}>
              <input
                type={passwordVisibility ? "text" : "password"}
                className={styles.login_field}
                placeholder="password"
                value={password}
                onChange={(ev) => onPasswordChange(ev.target.value)}
              />
              <i
                className={
                  styles.icon +
                  ` fas ${passwordVisibility ? "fa-eye" : "fa-eye-slash"}`
                }
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              />
            </div>
            {!isLogin && (
              <div className={styles.login_field_container}>
                <input
                  type="password"
                  className={styles.login_field}
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(ev) => onConfirmPasswordChange(ev.target.value)}
                />
              </div>
            )}
            <div className={styles.forgot_password}>
              <a href="/reset-password">Forgot password?</a>
            </div>
            <p className={styles.error}>{error}</p>
            <button
              className={styles.login_button}
              onClick={isLogin ? signInWithEmail : createAccount}
            >
              Submit
            </button>
            <p className={styles.toggle_text}>
              {isLogin ? "Don't" : "Already"} have an account?
              <br />
              Click{" "}
              <a href="#" onClick={toggleLogin}>
                here
              </a>{" "}
              to {isLogin ? "sign up" : "login"}
            </p>
            <div className={styles.google_button}>
              <GoogleButton onClick={() => signInWithGoogle()} />
            </div>
            <Image
              className={styles.logo}
              onClick={() => router.push("https://swaligafoundation.org/")}
              src="/swaliga-website-logo.png"
              alt="swaliga-logo"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
