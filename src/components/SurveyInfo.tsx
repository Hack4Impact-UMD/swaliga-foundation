"use client";
import Link from "next/link";
import styles from "./SurveyInfo.module.css";
import { useEffect, useState } from "react";
import { Survey } from "@/types/survey-types";
import Create from "./Create";

export default function SurveyInfo(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [surveyList, setSurveyList] = useState<Survey[]>([]);
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/surveys").then((res) => {
      res.json().then((data) => {
        setSurveyList(data);
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.box}>
            <p className={styles.survey}>Fetching Data!</p>
          </div>
        ) : (
          surveyList.map((singleSurvey, i) => {
            console.log(singleSurvey);
            return (
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
            );
          })
        )}

        <div className={styles.btnContainer}>
          <button
            className={styles.createSurvey}
            onClick={() => setIsCreateSurveyOpen(true)}
          >
            Create Survey +
          </button>
        </div>
        {isCreateSurveyOpen && <Create />}
      </div>
    </div>
  );
}
