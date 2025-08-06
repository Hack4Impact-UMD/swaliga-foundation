"use client";

import { useState } from "react";
import styles from "./StudentsPage.module.css";
import Table, { Column } from "@/components/ui/Table";
import { FilterCondition } from "@/components/Filter";
import { getFullAddress, getFullName, Student } from "@/types/user-types";
import moment from "moment";
import useStudents from "@/data/hooks/useStudents";

export default function StudentsPage() {
  const students = useStudents();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const columns: Column<Student>[] = [
    {
      name: "Name",
      getValue: (student: Student) => getFullName(student.name),
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
      getValue: (student: Student) => getFullName(student.name),
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
