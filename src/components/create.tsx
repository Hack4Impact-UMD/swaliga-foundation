"use client";

import React, { useState } from "react";
import styles from "./create.module.css";
import Modal from "./Modal";
import { createSurvey } from "@/data/surveys";

interface CreateProps {
  closeCreate: () => void;
}

export default function Create({ closeCreate }: CreateProps) {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [error, setError] = useState<string>("");

  const handleCreateSurvey = async () => {
    try {
      createSurvey(surveyTitle);
      closeCreate();
    } catch (error) {
      console.error("Error creating survey");
      setError("Error creating survey");
    }
  };

  return (
    <Modal closeModal={closeCreate} width={500} height={200}>
      <>
        <div className={styles.title}>Create Survey</div>
        <div className={styles.centeredOval}>
          <input
            name="surveyTitle"
            placeholder="Survey Name"
            className={styles.inputField}
            value={surveyTitle}
            onChange={(ev) => setSurveyTitle(ev.target.value)}
          />
        </div>
        <div>
          <p className={styles.error}>{error}</p>
          <button className={styles.button} onClick={handleCreateSurvey}>
            Create
          </button>
        </div>
      </>
    </Modal>
  );
}
