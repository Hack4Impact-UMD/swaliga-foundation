import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.header}>404 Error</h1>
        <p className={styles.message}>Page Not Found</p>
        <Link href="/">
          <button className={styles.button}>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
