"use client";

import { useEffect, useState } from "react";
import styles from "./StudentsPage.module.css";
import Table, { Column } from "@/components/ui/Table";
import { FilterCondition } from "@/components/Filter";
import { getAllStudents } from "@/data/firestore/students";
import LoadingPage from "../loading";
import { getFullAddress, getFullName, Student } from "@/types/user-types";
import moment from "moment";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getAllStudents()
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const columns: Column<Student>[] = [
    {
      name: "Name",
      getValue: (student: Student) => getFullName(student),
    },
    {
      name: "ID",
      getValue: (student: Student) => student.id,
    },
    {
      name: "Email",
      getValue: (student: Student) => student.email,
    },
    {
      name: "Address",
      getValue: (student: Student) => getFullAddress(student.address),
    },
    {
      name: "Date of Birth",
      getValue: (student: Student) =>
        moment(student.dateOfBirth).format("MMM D, YYYY"),
    },
    {
      name: "School",
      getValue: (student: Student) => student.school.name,
    },
  ];

  const filterConditions: FilterCondition<Student>[] = [
    {
      name: "Name",
      getValue: (student: Student) => getFullName(student),
    },
    {
      name: "ID",
      getValue: (student: Student) => student.id,
    },
    {
      name: "Email",
      getValue: (student: Student) => student.email,
    },
    {
      name: "Address",
      getValue: (student: Student) => getFullAddress(student.address),
    },
    {
      name: "Date of Birth",
      getValue: (student: Student) =>
        moment(student.dateOfBirth).format("MMM D, YYYY"),
    },
    {
      name: "School",
      getValue: (student: Student) => student.school.name,
    },
  ];

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Students</h1>
          <div className={styles.optionMenu}></div>
        </div>
        <Table<Student>
          items={students}
          columns={columns}
          selectOptions={{
            selectedItemIds: selectedStudentIds,
            setSelectedItemIds: setSelectedStudentIds,
          }}
          paginationOptions={{
            itemsPerPageOptions: [5, 10, 25, 50, 100],
            includeAllOption: true,
          }}
          filterConditions={filterConditions}
        />
      </div>
    </div>
  );
}
