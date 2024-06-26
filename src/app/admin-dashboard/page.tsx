"use client";
import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { User } from "@/types/user-types";
import { Survey } from "@/types/survey-types";
import UserList from "@/components/UserList";
import SurveyList from "@/components/SurveyList";

export default function AdminDashboard() {
  const [showUserList, setShowUserList] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
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
  }, []);

  const handleDropdownChange = () => setShowUserList(!showUserList);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.background}>
          <div className={styles.container}>
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
              <UserList users={users} surveys={surveys} />
            ) : (
              <SurveyList surveys={surveys} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
