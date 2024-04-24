// This code should be client side
"use client";

// Import statements
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./LoginPage.module.css";

// Environment check
const isWindow = () => typeof window !== 'undefined';

// Login page
export default function LoginPage() {
  // Determine initial dimensions of the page
  const windowDefined = typeof window !== 'undefined';
  const initDims: Dims = windowDefined ? { width: window.innerWidth, height: window.innerHeight } : { width: 0, height: 0 };

  // Login page states
  const [dims, setDims] = useState<Dims>(initDims);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Effect to update page dimensions and create polygons on window resize
  useLayoutEffect(() => {
    function updateDims() {
      // Update the dims state based on new window dimensions 
      setDims({ width: window.innerWidth, height: window.innerHeight });

      // Dynamically render the background polygons
      generatePolygons();
    }

    // Only run this code client-side(?)
    if (isWindow()) {

    // Add an event listener to call updateDims on window resize
    window.addEventListener('resize', updateDims);
    updateDims(); // Call on mount

    // Cleanup function
    return () => window.removeEventListener('resize', updateDims);
    }
  }, []);

  // Function to generate new polygon background
  const generatePolygons = useCallback(() => {
    const polygons: Polygon[] = [
      // Background polygons (behind login container)
      {
        points: [
          0,
          0,
          0,
          dims.height / 60,
          (50 / 85) * dims.width,
          dims.height,
          dims.width,
          dims.height,
          dims.width,
          0.45 * dims.height,
          dims.height / 60,
          0,
        ],
        fill: "#D0D12A",
      },
      {
        points: [
          0,
          dims.height / 60,
          0,
          dims.height,
          (50 / 85) * dims.width,
          dims.height,
        ],
        fill: "#295972",
      },
      {
        points: [
          dims.height / 60,
          0,
          dims.width,
          0,
          dims.width,
          0.45 * dims.height,
        ],
        fill: "#295972",
      },
      // Overlay ("swapped polygons"...simulated part of the login container)
      {
        points: [
          dims.width / 2,
          0.15 * dims.height,
          0.875 * dims.width,
          0.15 * dims.height,
          0.875 * dims.width,
          0.39375 * dims.height,
          dims.width / 2,
          0.225 * dims.height,
        ],
        fill: "#D0D12A",
      },
      {
        points: [
          dims.width / 2,
          0.225 * dims.height,
          0.875 * dims.width,
          0.39375 * dims.height,
          0.875 * dims.width,
          0.85 * dims.height,
          0.5 * dims.width,
          0.85 * dims.height,
        ],
        fill: "#295972",
      },
    ];

    // Update the polygons state
    setPolygons(polygons);
  }, []);

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
    isWindow() &&
    (<div className={styles.container}>
      <div className={styles.background}>
        <Stage className={styles.stage} width={dims.width} height={dims.height}>
          <Layer>
            {polygons.map(drawPolygon)}
            {polygonOverlay.map(drawPolygon)}
          </Layer>
        </Stage>
        <div className={styles.login}>
          <h1 className={styles.login_title}>Login</h1>
          <input
            type="email"
            className={styles.login_input}
            placeholder="enter email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            className={styles.login_input}
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <a className={styles.forgot_password}>Forgot password?</a>
          <button className={styles.login_button}>Submit</button>
          <p>Click here to sign up for an account</p>
          <img
            className={styles.logo}
            src="/swaliga-website-logo.png"
            alt="swaliga-logo"
          />
        </div>
      </div>
    </div>)
  );
}
