"use client";

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import UpArrow from "@/../public/icons/up-arrow-icon.png";
import DownArrow from "@/../public/icons/down-arrow-icon.png";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Role, User } from "@/types/user-types";
import { Survey } from "@/types/survey-types";
import { auth } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/Loading";
import { getAccountById } from "@/data/firestore/users";
import { getSurveyByID } from "@/data/firestore/surveys";
import { getResponseByID } from "@/data/firestore/assignments";
import { logOut } from "@/features/auth/authN/googleAuthN";
import { useRouter } from "next/navigation";
import RequireAuth from "@/features/auth/RequireAuth";

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [openSurvey, setOpenSurvey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await fetchCurrentUserData(currentUser.uid);
      } else {
        console.error("No signed-in user");
      }
      setLoading(false);
    });
  }, []);

  const fetchCurrentUserData = async (userId: string) => {
    try {
      const user = await getAccountById(userId);
      setUser(user);

      Promise.all(
        user.assignedSurveys.map((surveyId) => getSurveyByID(surveyId))
      ).then((surveys) => {
        setSurveys(surveys.filter((survey) => survey) as Survey[]);
      });
      Promise.all(
        user.completedResponses.map((responseId) => getResponseByID(responseId))
      ).then((responses) => {
        setResponses(
          responses
            .filter((response) => response)
            .map((response) => response!.formTitle)
        );
      });
    } catch (error) {
      console.error("unable to load student dashboard");
      throw new Error("unable to load student dashboard");
    }
  };

  const handleSurveyButtonClick = (surveyId: string) => {
    setOpenSurvey(surveyId === openSurvey ? "" : surveyId);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <RequireAuth allowedRoles={[Role.STUDENT]}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Image src={CompanyLogo} alt="Company Logo" className={styles.img} />
          <p className={styles.info}>
            Student ID: {user?.swaligaID || "No user ID found"}
          </p>
          <Link href="/settings">
            <button className={styles.settingButton}>Settings</button>
          </Link>
          <Link
            href="/"
            className={styles.logOut}
            onClick={async () => {
              await logOut();
              router.refresh();
            }}
          >
            Log Out
          </Link>
        </div>
        <div className={styles.mainContent}>
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.surveyTitle}>Available Surveys</p>
          <hr className={styles.horizontalLine} />
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <div key={survey.formId} className={styles.surveyContainer}>
                <button
                  onClick={() => handleSurveyButtonClick(survey.formId)}
                  className={styles.assignedSurveyButton}
                >
                  {survey.info.title}
                  <Image
                    src={openSurvey === survey.formId ? DownArrow : UpArrow}
                    alt={openSurvey === survey.formId ? "DownArrow" : "UpArrow"}
                    className={styles.vector}
                  />
                </button>
                {openSurvey === survey.formId && (
                  <iframe
                    key={survey.formId}
                    src={survey.responderUri}
                    title={survey.info.title}
                    allowFullScreen={true}
                    className={styles.form}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No surveys assigned.</p>
          )}
          <p className={styles.surveyTitle}>Completed Surveys</p>
          <hr className={styles.horizontalLine} />
          {responses.length > 0 ? (
            responses.map((response) => (
              <span key={response} className={styles.completedSurveyButton}>
                {response}
              </span>
            ))
          ) : (
            <p>No completed surveys.</p>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
