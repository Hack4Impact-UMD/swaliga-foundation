"use client";
import React, { useEffect, useState, useCallback } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Dims, Polygon } from "@/types/konva-types";
import styles from "./ForgotPasswordPage.module.css";
import {
  getInnerPolygonLayer,
  getOuterPolygonLayer,
  getPolygonBorder,
} from "./polygons";
import RequireStudentAuth from "@/components/auth/RequireStudentAuth";

export default function ForgotPasswordPage() {
  const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });
  const [outerPolygons, setOuterPolygons] = useState<Polygon[]>([]);
  const [polygonBorder, setPolygonBorder] = useState<Polygon[]>([]);
  const [innerPolygons, setInnerPolygons] = useState<Polygon[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setAllPolygons(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      setAllPolygons(window.innerWidth, window.innerHeight);
    });
  }, []);

  const setAllPolygons = (width: number, height: number): void => {
    setDims({ width, height });
    setOuterPolygons(
      getOuterPolygonLayer(window.innerWidth, window.innerHeight)
    );
    setPolygonBorder(getPolygonBorder(window.innerWidth, window.innerHeight));
    setInnerPolygons(
      getInnerPolygonLayer(window.innerWidth, window.innerHeight)
    );
  };

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
    <RequireStudentAuth>
      <div className={styles.container}>
        <div className={styles.background}>
          <Stage
            className={styles.stage}
            width={dims.width}
            height={dims.height}
          >
            <Layer>
              {outerPolygons.map(drawPolygon)}
              {polygonBorder.map(drawPolygon)}
              {innerPolygons.map(drawPolygon)}
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
    </RequireStudentAuth>
  );
}
