"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>404</h1>
      <p className={styles.text}>{error.message}</p>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <button className={styles.button}>Go to Home Page</button>
        </Link>
      </div>
    </div>
  );
}
