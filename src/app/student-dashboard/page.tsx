'use client';

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import UpArrow from '@/../public/icons/up-arrow-icon.png'
import DownArrow from '@/../public/icons/down-arrow-icon.png'
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react";
import { User } from "@/types/user-types";
import { Survey, Response } from '@/types/survey-types';
import { auth } from '@/lib/firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import RequireStudentAuth from "@/components/auth/RequireStudentAuth";

export default function StudentDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [openSurvey, setOpenSurvey] = useState('');

    const fetchCurrentUserData = async (userId: string) => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const user: User = await res.json();
        setUser(user);

        Promise.all(user.assignedSurveys.map(surveyId => fetch(`/api/surveys/${surveyId}`))).then(responses => {
          Promise.all(responses.map(res => res.json())).then((surveys: Survey[]) => {
            setSurveys(surveys);
          })
        })

        Promise.all(user.completedResponses.map(responseId => fetch(`/api/responses/${responseId}`))).then(responses => {
          Promise.all(responses.map(res => res.json())).then((responses: Response[]) => {
            setResponses(responses.map(response => response.formTitle))
          })
        })
      } catch (error) {
        console.error(error);
        throw new Error('unable to fetch data for student dashboard');
      }
    }

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            fetchCurrentUserData(user.uid);
        } else {
            console.log('no signed-in user');
        }
    }, []);

    const handleSurveyButtonClick = (surveyId: string) => {
        setOpenSurvey(surveyId === openSurvey ? '' : surveyId);
    };

    return (
      <RequireStudentAuth>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Image
              src={CompanyLogo}
              alt="Company Logo"
              className={styles.img}
            />
            <p className={styles.info}>
              Student ID: {user?.id || "No user ID found"}
            </p>
            <button className={styles.settingButton}>Settings</button>
            <Link
              href="/"
              className={styles.logOut}
              onClick={() => signOut(auth)}
            >
              Log Out
            </Link>
          </div>
          <div className={styles.mainContent}>
            <p className={styles.surveyTitle}>Available Surveys</p>
            <hr className={styles.horizontalLine} />
            {surveys.map((survey) => (
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
            ))}
            <p className={styles.surveyTitle}>Completed Surveys</p>
            <hr className={styles.horizontalLine} />
            {responses.map((response) => (
              <span key={response} className={styles.completedSurveyButton}>
                {response}
              </span>
            ))}
          </div>
        </div>
      </RequireStudentAuth>
    );
}