"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.header}>Error</h1>
        <p className={styles.message}>{error.message}</p>
        <Link href="/">
          <button className={styles.button}>Back to Home</button>
        </Link>
      </div>
    </div>
  );
}
