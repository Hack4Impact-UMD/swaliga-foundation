"use client";

import { Survey } from "@/types/survey-types";
import { User } from "@/types/user-types";
import styles from "./UserTable.module.css";
import { useState } from "react";
import { FilterCondition } from "./Filter";
import Assign from "./Assign";
import { exportUsersToCSV } from "@/lib/exportCSV";
import { Timestamp } from "firebase/firestore";
import Table, { Column } from "./Table";
import moment from "moment";

export default function UserTable(props: { users: User[]; surveys: Survey[] }) {
  const { users, surveys } = props;
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);
  
  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) {
      return "N/A";
    }
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US");
  };

  const userColumns: Column<User>[] = [
    {
      id: "name",
      name: "Name",
      valueSelector: (user: User) =>
        user.middleName
          ? `${user.firstName} ${user.middleName} ${user.lastName}`
          : `${user.firstName} ${user.lastName}`,
    },
    {
      id: "id",
      name: "ID",
      valueSelector: (user: User) => user.id,
    },
    {
      id: "birthdate",
      name: "Birthdate",
      valueSelector: (user: User) => formatDate(user.birthdate),
    },
    {
      id: "hometown",
      name: "Hometown",
      valueSelector: (user: User) => user.address.city,
    },
    {
      id: "email",
      name: "Email",
      valueSelector: (user: User) => user.email,
    },
  ];

  const userFilterConditions: FilterCondition<User>[] = [
    {
      id: "id",
      name: "ID",
      inputType: "number",
    },
    {
      id: "firstName",
      name: "First Name",
      inputType: "text",
    },
    {
      id: "lastName",
      name: "Last Name",
      inputType: "text",
    },
    {
      id: "gradYear",
      name: "Grad Year",
      inputType: "number",
    },
    {
      id: "age",
      name: "Age",
      inputType: "number",
    },
    {
      id: "gender",
      name: "Gender",
      inputType: "text",
    },
    {
      id: "ethnicity",
      name: "Ethnicity",
      inputType: "text",
    },
    {
      id: "city",
      name: "City",
      inputType: "text",
    },
  ]

  const includeUser = (user: User, filterValues: { [key: string]: any }) => {
    const { id, firstName, lastName, gradYear, age, gender, ethnicity, city } = filterValues;
    if (id && user.id !== id) return false;
    if (firstName && !user.firstName.toLowerCase().includes(firstName.toLowerCase())) return false;
    if (lastName && !user.lastName.toLowerCase().includes(lastName.toLowerCase())) return false;
    if (gradYear && user.gradYear !== gradYear) return false;
    if (age) {
      const currentMoment = moment();
      const birthDate = user.birthdate.toDate();
      const userAge = currentMoment.diff(birthDate, 'years');
      if (userAge !== age) return false;
    }
    if (gender && !user.gender.toLowerCase().startsWith(gender.toLowerCase())) return false;
    if (ethnicity) {
      let include = false;
      const ethnicitySearch = ethnicity.toLowerCase();
      for (const userEthnicity of user.ethnicity) {
        if (userEthnicity.toLowerCase().includes(ethnicitySearch)) {
          include = true;
          break;
        }
      }
      if (!include) return false;
    }
    if (city && !user.address.city.toLowerCase().startsWith(city.toLowerCase())) return false;
    return true;
  }

  return (
    <>
      <Table
        columns={userColumns}
        items={users}
        selectedItemIds={selectedStudentIds}
        filterConditions={userFilterConditions}
        filterFunction={includeUser}
        setSelectedItemIds={setSelectedStudentIds}
      />
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => setIsAssignOpen(true)}
        >
          Assign Surveys
        </button>
        <button className={styles.button} onClick={() => exportUsersToCSV(users.filter(user => selectedStudentIds.includes(user.id)))}>Export Selected Users to CSV</button>
      </div>
      {isAssignOpen && <Assign studentIds={selectedStudentIds} surveys={surveys} closeAssign={() => setIsAssignOpen(false)}/>}
    </>
  );
}