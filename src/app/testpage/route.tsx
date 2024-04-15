import React from "react";
import Link from "next/link";
import styles from "./testpage.module.css";
import Assign from '../../components/Assign'; // Import the Assign component


const TestPage: React.FC = () => {
  return (

    <div className={styles.container}>
      <h1 className={`${styles.text} ${styles.bold}`}>TEST</h1>
      <p className={styles.text}>TESTPAGE</p>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <button className={styles.button}>Go to Homepage</button>
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
