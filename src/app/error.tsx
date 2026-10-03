"use client";

import { Anchor } from "@mantine/core";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: string | (Error & { digest?: string });
  reset?: () => void;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.header}>Error</h1>
        <p className={styles.message}>
          {typeof error === "string" ? error : error.message}
        </p>
        {reset ? (
          <button className={styles.button} onClick={reset}>
            Try Again
          </button>
        ) : (
          <Anchor href="/">
            <button className={styles.button}>Back to Home</button>
          </Anchor>
        )}
      </div>
    </div>
  );
}
