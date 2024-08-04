"use client";
import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { User } from "@/types/user-types";
import { Survey } from "@/types/survey-types";
import StudentDisplay from "@/components/StudentDisplay";
import SurveyDisplay from "@/components/SurveyDisplay";
import RequireAdminAuth from "@/components/auth/RequireAdminAuth";
import logoutIcon from "@/../public/icons/logout.svg";
import Image from "next/image";
import { auth } from "@/lib/firebase/firebaseConfig";
import Loading from "@/components/Loading";

export default function AdminDashboard() {
  const [showUserList, setShowUserList] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false); // not the best way to rerender page once a survey is deleted, but it works
  
  useEffect(() => {
    // get all users & surveys for use in child components
    setIsLoading(true);
    const promises = [];
    promises.push(fetch("/api/users"));
    promises.push(fetch("/api/surveys"));

    Promise.all(promises).then((responses) => {
      Promise.all(responses.map((res) => res.json())).then((data) => {
        setUsers(data[0]);
        setSurveys(data[1]);
        setIsLoading(false);
      });
    });
  }, [forceUpdate]);

  const handleDropdownChange = () => setShowUserList(!showUserList);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.background}>
          <div className={styles.container}>
            <Image
              src={logoutIcon}
              alt="Logout Icon"
              className={styles.logout}
              onClick={() => auth.signOut()}
            />
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <select
                  className={styles.dropdown}
                  onChange={handleDropdownChange}
                >
                  <option value="student-info">Student Info</option>
                  <option value="surveys">Surveys</option>
                </select>
              </div>
            </div>
            {showUserList ? (
              <StudentDisplay users={users} surveys={surveys} />
            ) : (
              <SurveyDisplay
                surveys={surveys}
                handleDeleteSurvey={() => setForceUpdate(!forceUpdate)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
