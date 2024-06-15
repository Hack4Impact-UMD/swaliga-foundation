"use client";
import Link from "next/link";
import styles from "./SurveyList.module.css";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey-types";

export default function SurveyList(props: { surveys: Survey[] }): JSX.Element {
  const { surveys } = props;
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState<boolean>(false);

  function handleCreateSurvey() {
    setIsCreateSurveyOpen(true);
    /* TODO: integrate Create Survey component here */
  }

  return (
    <>
      {surveys.map((singleSurvey, i) => (
        <div key={i} className={styles.box}>
          <Link
            href={singleSurvey.responderUri}
            target="_blank"
            className={styles.view}
          >
            View
          </Link>
          <p className={styles.survey}>
            {singleSurvey.info && singleSurvey.info.title}
          </p>
          <button className={styles.export}>Export</button>
        </div>
      ))}

      <div className={styles.btnContainer}>
        <button className={styles.createSurvey} onClick={handleCreateSurvey}>
          Create Survey +
        </button>
      </div>
    </>
  );
}
