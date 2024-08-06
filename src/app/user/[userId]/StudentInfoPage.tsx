"use client";
import userPfp from "@/../public/icons/pfpIcon.svg";
import gradYrIcon from "@/../public/icons/gradYrIcon.svg";
import gradeIcon from "@/../public/icons/gradeIcon.svg";
import genderIcon from "@/../public/icons/genderIcon.svg";
import ethnicityIcon from "@/../public/icons/ethnicityIcon.svg";
import mobileIcon from "@/../public/icons/mobileIcon.svg";
import emailIcon from "@/../public/icons/emailIcon.svg";
import addressIcon from "@/../public/icons/addressIcon.svg";

import styles from "./StudentInfoPage.module.css";
import { User } from "@/types/user-types";
import { Survey } from "@/types/survey-types";
import { Response } from "@/types/survey-types";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "@/components/Loading";

// converts birthdate to grade, so grade does not need to be updated in database
function getGrade(gradYr: number | undefined) {
  if (gradYr) {
    const currDate = new Date();
    const differenceInYears: number = Math.floor(
      Math.abs(gradYr - currDate.getFullYear())
    );
    return differenceInYears >= 12
      ? "Kindergarten or below"
      : String(12 - differenceInYears);
  }
}

function guardianInfo(guardianInfo: any[] | undefined) {
  if (guardianInfo) {
    return (
      <div>
        <p>Guardian Information:</p>
        <ol>
          {guardianInfo.map((guardian, index) => (
            <li key={index}>
              {guardian.firstName} {guardian.lastName}
              <ul>
                <li>Email: {guardian.email}</li>
                <li>Phone: {guardian.phone}</li>
              </ul>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default function StudentInfoPage({
  params,
}: {
  params: { userId: string };
}) {
  const [user, setUser] = useState<User>();
  const [surveys, setSurveys] = useState<Survey[]>();
  const [responses, setResponses] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      // get user info
      const res = await fetch(`/api/users/${userId}`);
      const user: User = await res.json();
      setUser(user);

      // get response info
      Promise.all(
        user.completedResponses.map((responseId) =>
          fetch(`/api/responses/${responseId}`)
        )
      ).then((responses) => {
        Promise.all(responses.map((res) => res.json())).then(
          (responses: Response[]) =>
            setResponses(responses.map((response) => response.formTitle))
        );
      });

      // get survey info
      Promise.all(
        user.assignedSurveys.map((surveyId) =>
          fetch(`/api/surveys/${surveyId}`)
        )
      ).then((responses) => {
        Promise.all(responses.map((res) => res.json())).then(
          (surveys: Survey[]) => setSurveys(surveys)
        );
      });
    } catch {
      console.log("Error retrieving student information using given userId");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      fetchData(params.userId);
    }
  }, [params.userId, user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftSide}>
        <div className={styles.polygon}> </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.profile}>
          <Image src={userPfp} alt="Profile Icon" className={styles.icon} />
          <p className={styles.header}>{`${user?.firstName ?? "first name"} ${
            user?.lastName ?? "last name"
          }`}</p>
          <p className={styles.studentId}>{user?.id ?? "student id"}</p>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={gradYrIcon} alt="Grad Year Icon" />
                  <p className={styles.regular}>Grad. Yr.</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{user?.gradYear ?? "graduation year"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={gradeIcon} alt="Grade Icon" />
                  <p className={styles.regular}>Grade</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{getGrade(user?.gradYear) ?? "grade"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={genderIcon} alt="Gender Icon" />
                  <p className={styles.regular}>Gender</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{user?.gender ?? "gender"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={ethnicityIcon} alt="Ethnicity Icon" />
                  <p className={styles.regular}>Ethnicity</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{user?.ethnicity ?? "ethnicity"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={mobileIcon} alt="Mobile Icon" />
                  <p className={styles.regular}>Mobile</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{user?.phone ?? "phone"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={emailIcon} alt="Email Icon" />
                  <p className={styles.regular}>Email</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{user?.email ?? "email"}</p>
                </td>
              </tr>
              <tr>
                <td className={styles.leftSideTable}>
                  <Image src={addressIcon} alt="Address Icon" />
                  <p className={styles.regular}>Address</p>
                </td>
                <td className={`${styles.rightSideTable} ${styles.regular}`}>
                  <p>{`${user?.address.street ?? "street"}, ${
                    user?.address.city ?? "city"
                  }, ${user?.address.state ?? "state"} ${
                    user?.address.zip ?? "zip code"
                  }`}</p>
                </td>
              </tr>
            </thead>
          </table>
          <div className={styles.guardian}>
            <p id="info">{guardianInfo(user?.guardian)}</p>
          </div>
        </div>
        <div className={styles.surveysStatus}>
          <p className={styles.surveyTitle}>Surveys</p>
          <div className={`${styles.surveysList} ${styles.regular}`} id="list">
            {responses?.map((completedSurveyName: string, i: number) => (
              <a className={styles.complete} key={i}>
                {completedSurveyName}
              </a>
            ))}
            {surveys?.map((survey: Survey, i: number) => (
              <a className={styles.incomplete} key={i}>
                {survey.info.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
