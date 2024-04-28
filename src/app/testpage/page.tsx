import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Assign from '../../components/Assign'; // Import the Assign component
import Create from '../../components/Create'; // Import the Assign component



const Page: React.FC = () => {
  return (

    <div className={styles.container}>
      <Assign userIds={['newUser', 'temp']}></Assign>
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

export default Page;
