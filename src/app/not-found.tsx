import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.text} ${styles.bold}`}>404</h1>
      <p className={styles.text}>Page Not Found</p>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <button className={styles.button}>Go to Home Page</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
