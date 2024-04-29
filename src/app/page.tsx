"use client";
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./LoginPage.module.css";
import { getPolygonBackground, getPolygonOverlay } from "./polygons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from 'next/link'

// Login page
export default function LoginPage() {
  const [dims, setDims] = useState<Dims>({width: 0, height: 0});
  const [polygonBackground, setPolygonBackground] = useState<Polygon[]>([]);
  const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  useEffect(() => {
    setAllPolygons(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => {
      setAllPolygons(window.innerWidth, window.innerHeight);
    })
  }, []);

  const setAllPolygons = (width: number, height: number) => {
    setDims({width, height});
    setPolygonBackground(getPolygonBackground(width, height));
    setPolygonOverlay(getPolygonOverlay(width, height));
  }

  // Function to draw a given polygon
  const drawPolygon = useCallback((polygon: Polygon) => (
    <Line
      key={polygon.points.toString()}
      points={polygon.points}
      fill={polygon.fill}
      closed
      stroke="black"
      strokeWidth={0}
    />
  ), []);

  // Include a guard to force code to be executed on client side only
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Stage className={styles.stage} width={dims.width} height={dims.height}>
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
              className={`fas ${
                passwordVisibility ? "fa-eye" : "fa-eye-slash"
              }`}
              onClick={() => setPasswordVisibility(!passwordVisibility)}
            />
          </div>
          <Link href="/reset-password" className={styles.forgot_password}>Forgot Password?</Link>
          <button className={styles.login_button}>Submit</button>
          <p>Click here to sign up for an account</p>
          <img
            className={styles.logo}
            src="/swaliga-website-logo.png"
            alt="swaliga-logo"
          />
        </div>
      </div>
    </div>
  );
}
