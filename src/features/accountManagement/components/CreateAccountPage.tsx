"use client";
import React from "react";
import styles from "./CreateAccountPage.module.css";
import EditAccountForm from "./EditAccountForm";
import ImageBackgroundPage from "@/components/layout/pages/ImageBackgroundPage";

export default function CreateAccountPage() {
  return (
    <ImageBackgroundPage>
      <div className={styles.container}>
        <EditAccountForm mode={"CREATE"} />
      </div>
    </ImageBackgroundPage>
  );
}
