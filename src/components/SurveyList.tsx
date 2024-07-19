"use client";
import Link from "next/link";
import styles from "./SurveyList.module.css";
import { useState } from "react";
import { Survey } from "@/types/survey-types";
import Create from "./create";

export default function SurveyList(props: { surveys: Survey[] }): JSX.Element {
  const { surveys } = props;
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

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
          {singleSurvey.linkedSheetId ? (
            <Link
              href={singleSurvey.linkedSheetId}
              target="_blank"
              className={styles.view}
            >
              View Responses
            </Link>
          ) : (
            <p className={styles.view}>
              Go{" "}
              <Link
                href={`https://docs.google.com/forms/d/${singleSurvey.formId}/edit`}
                target="_blank"
              >
                here
              </Link>{" "}
              to create responses spreadsheet
            </p>
          )}
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button
          className={styles.createSurvey}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Survey +
        </button>
      </div>
      {isCreateOpen && <Create closeCreate={() => setIsCreateOpen(false)} />}
    </>
  );
}
