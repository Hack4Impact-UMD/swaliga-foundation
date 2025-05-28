"use client";

import { Survey } from "@/types/survey-types";
import { User } from "@/types/user-types";
import styles from "./StudentDisplay.module.css";
import { useState } from "react";
import { FilterCondition } from "./Filter";
import Assign from "./Assign";
import { exportUsersToCSV } from "@/features/dataExporting/exportCSV";
import { Timestamp } from "firebase/firestore";
import Table, { Column } from "./Table";
import moment from "moment";
import { useRouter } from "next/navigation";
import SendEmailModal from "./SendEmailModal";

export default function StudentDisplay(props: {
  users: User[];
  surveys: Survey[];
}) {
  const { users, surveys } = props;
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState<boolean>(false);

  const router = useRouter();

  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) {
      return "N/A";
    }
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US");
  };

  // defines the columns that will be displayed in the User table
  const userColumns: Column<User>[] = [
    {
      id: "name",
      name: "Name",
      getValue: (user: User) => (
        <p
          className={styles.cursorPointer}
          onClick={() => router.push(`/user/${user.id}`)}
        >
          {user.middleName
            ? `${user.firstName} ${user.middleName} ${user.lastName}`
            : `${user.firstName} ${user.lastName}`}
        </p>
      ),
    },
    {
      id: "id",
      name: "ID",
      getValue: (user: User) => <p>{user.swaligaID}</p>,
    },
    {
      id: "birthdate",
      name: "Birthdate",
      getValue: (user: User) => <p>{formatDate(user.birthdate)}</p>,
    },
    {
      id: "hometown",
      name: "Hometown",
      getValue: (user: User) => <p>{user.address.city}</p>,
    },
    {
      id: "email",
      name: "Email",
      getValue: (user: User) => <p>{user.email}</p>,
    },
  ];

  // defines the filter conditions that will be used to filter the User table
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
  ];

  // checks if a user matches the provided filter values
  const includeUser = (user: User, filterValues: { [key: string]: any }) => {
    const { id, firstName, lastName, gradYear, age, gender, ethnicity, city } =
      filterValues;
    if (id && user.swaligaID !== parseInt(id)) return false;
    if (
      firstName &&
      !user.firstName.toLowerCase().includes(firstName.toLowerCase())
    )
      return false;
    if (
      lastName &&
      !user.lastName.toLowerCase().includes(lastName.toLowerCase())
    )
      return false;
    if (gradYear && user.gradYear !== gradYear) return false;
    if (age) {
      const currentMoment = moment();
      const birthDate = user.birthdate.toDate();
      const userAge = currentMoment.diff(birthDate, "years");
      if (userAge !== age) return false;
    }
    if (gender && !user.gender.toLowerCase().startsWith(gender.toLowerCase()))
      return false;
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
    if (city && !user.address.city.toLowerCase().startsWith(city.toLowerCase()))
      return false;
    return true;
  };

  return (
    <>
      <Table<User>
        columns={userColumns}
        items={users.map((user: User) => ({ id: user.id, data: user }))}
        selectedItemIds={selectedStudentIds}
        filterConditions={userFilterConditions}
        filterFunction={includeUser}
        setSelectedItemIds={setSelectedStudentIds}
      />
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => setIsAssignOpen(true)}>
          Assign Surveys
        </button>
        <button
          className={styles.button}
          onClick={() => setIsSendEmailOpen(true)}
        >
          Send Emails
        </button>
        <button
          className={styles.button}
          onClick={() =>
            exportUsersToCSV(
              users.filter((user) => selectedStudentIds.includes(user.id)),
              surveys
            )
          }
        >
          Export Selected Users to CSV
        </button>
      </div>
      {isAssignOpen && (
        <Assign
          studentIds={selectedStudentIds}
          surveys={surveys}
          closeAssign={() => setIsAssignOpen(false)}
        />
      )}
      {isSendEmailOpen && (
        <SendEmailModal
          emails={users
            .filter((user) => selectedStudentIds.includes(user.id))
            .map((user) => user.email)}
          closeModal={() => setIsSendEmailOpen(false)}
        />
      )}
    </>
  );
}
