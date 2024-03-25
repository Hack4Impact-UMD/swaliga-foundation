"use client";
import React, { useEffect, useState, useCallback } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
    const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);
    const [email, setEmail] = useState("");

    const updateDims = useCallback(() => {
      setDims({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
      updateDims();
      window.addEventListener("resize", updateDims);
      return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);

    const generatePolygons = useCallback((dims: Dims) => {
      const coords: Polygon[] = [
        {
          points: [
            0,
            0,
            0,

            dims.height / 30,
            (50 / 100) * dims.width,
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
      ];
      setPolygons(coords);
    }, []);

    const generatePolygonOverlay = useCallback((dims: Dims) => {
      const coords: Polygon[] = [
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
      setPolygonOverlay(coords);
    }, []);

    useEffect(() => {
      if (dims.width && dims.height) {
        generatePolygons(dims);
        generatePolygonOverlay(dims);
      }
    }, [dims, generatePolygons]);

    const drawPolygon = (polygon: Polygon) => (
      <Line
        key={polygon.points.toString()}
        points={polygon.points}
        fill={polygon.fill}
        closed
        stroke="black"
        strokeWidth={0}
      />
    );
  
    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <Stage className={styles.stage} width={dims.width} height={dims.height}>
                    <Layer>
                        {polygons.map(drawPolygon)}
                        {polygonOverlay.map(drawPolygon)}
                    </Layer>
                </Stage>
                <div className={styles.passwordReset}>
                    <h2 className={styles.passwordReset_title}>Password Reset</h2>
                    <input
                        type="email"
                        className={styles.passwordReset_input}
                        placeholder="input email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <button className={styles.passwordReset_button}>Submit</button>
                    <a className={styles.back_to_login}>← Back to login</a>
                </div>
            </div>
        </div>
  );
}