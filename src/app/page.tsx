'use client';

import React, { useEffect, useState, useCallback } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./LoginPage.module.css";
import { getPolygonBackground, getPolygonOverlay } from "./polygons";
import GoogleButton from "react-google-button";
import { loginUser } from "@/lib/firebase/authentication/emailPasswordAuthentication";
import { signInWithGoogle } from "@/lib/firebase/authentication/googleAuthentication";
import RequireSignedOut from "@/components/auth/RequireSignedOut";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function LoginPage() {
  const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });
  const [polygonBackground, setPolygonBackground] = useState<Polygon[]>([]);
  const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [error, setError] = useState<string>("weuifg");
  const router = useRouter();

  const setAllPolygons = (width: number, height: number) => {
    setDims({ width, height });
    setPolygonBackground(getPolygonBackground(width, height));
    setPolygonOverlay(getPolygonOverlay(width, height));
  };

  useEffect(() => {
    setAllPolygons(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      setAllPolygons(window.innerWidth, window.innerHeight);
    });
  }, []);

  const signInWithEmail = async () => {
    const response = await loginUser(email, password);
    if (response.success) {
      // Fetch user details and check if the user is admin or student
      const user = await fetch(`/api/users/${response.userId}`).then((res) =>
        res.json()
      );
      if (user.isAdmin) {
        router.push("/admin-dashboard");
      } else {
        router.push("/student-dashboard");
      }
    } else {
      console.log("Login failed");
      setError("Invalid login credentials");
    }
    setEmail("");
    setPassword("");
  };

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

  return (
    <RequireSignedOut>
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
            <h1 className={styles.login_title}>Login</h1>
            <div className={styles.login_field_container}>
              <input
                type="email"
                className={styles.login_field}
                placeholder="enter email"
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
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <i
                className={
                  styles.icon +
                  ` fas ${passwordVisibility ? "fa-eye" : "fa-eye-slash"}`
                }
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              />
            </div>
            <div className={styles.forgot_password}>
              <a href="/reset-password">Forgot password?</a>
            </div>
            <p className={styles.error}>{error}</p>
            <button className={styles.login_button} onClick={signInWithEmail}>
              Submit
            </button>
            <p>
              Click <a href="/create-account">here</a> to create an account
            </p>
            <div className={styles.google_button}>
              <GoogleButton onClick={signInWithGoogle} />
            </div>
            <Image
              className={styles.logo}
              src="/swaliga-website-logo.png"
              alt="swaliga-logo"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </RequireSignedOut>
  );
}
