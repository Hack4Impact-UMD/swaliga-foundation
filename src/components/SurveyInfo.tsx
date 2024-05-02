"use client";
import Link from "next/link";
import styles from "./SurveyInfo.module.css";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey-types";

export default function SurveyInfo(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [surveyList, setSurveyList] = useState<Survey[]>([]);
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/surveys").then((res) => {
      res.json().then((data) => {
        setSurveyList(data.surveys);
        setIsLoading(false);
      });
    });
  }, []);

  function handleCreateSurvey() {
    setIsCreateSurveyOpen(true);
    /* TODO: integrate Create Survey component here */
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.box}>
            <p className={styles.survey}>Fetching Data!</p>
          </div>
        ) : (
          surveyList.map((singleSurvey, i) => (
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
          ))
        )}

        <div className={styles.btnContainer}>
          <button className={styles.createSurvey} onClick={handleCreateSurvey}>
            Create Survey +
          </button>
        </div>
      </div>
    </div>
  );
}