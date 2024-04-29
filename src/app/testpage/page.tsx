import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Assign from '../../components/Assign'; // Import the Assign component
import Create from '../../components/Create'; // Import the Assign component



const Page: React.FC = () => {
  return (

    <div className={styles.container}>
      <Assign userIds={['newUser', 'temp']}></Assign>
      <Create></Create>
    </div>
  );
};

export default Page;
