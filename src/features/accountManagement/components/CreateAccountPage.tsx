"use client";
import React from "react";
import styles from "./CreateAccountPage.module.css";
import EditAccountForm from "./EditAccountForm";

export default function CreateAccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <EditAccountForm mode={"CREATE"} />
      </div>
    </div>
  );
}
