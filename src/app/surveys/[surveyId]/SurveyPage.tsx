"use client";

import {
  AssignmentID,
  isPendingAssignmentID,
  isSurveyResponseStudentEmailID,
  isSurveyResponseStudentIdID,
  isSurveyResponseUnidentifiedID,
  SurveyID,
} from "@/types/survey-types";
import { useEffect, useState } from "react";
import styles from "./SurveyPage.module.css";
import { getSurveyById } from "@/data/firestore/surveys";
import { getAssignmentsBySurveyId } from "@/data/firestore/assignments";
import LoadingPage from "@/app/loading";
import Link from "next/link";
import { FaEdit, FaEnvelope, FaExpand, FaExpandAlt, FaExpandArrowsAlt, FaEye, FaFileExcel, FaPlus } from "react-icons/fa";
import useSurveys from "@/data/hooks/useSurveys";
import Table, { Column } from "@/components/ui/Table";
import useStudents from "@/data/hooks/useStudents";
import { getFullName } from "@/types/user-types";
import moment from "moment";
import { FilterCondition } from "@/components/Filter";

interface StudentPageProps {
  surveyId: string;
}

export default function StudentPage(props: StudentPageProps) {
  const { surveyId } = props;

  const survey = useSurveys().find((survey) => survey.id === surveyId)!;
  const [assignments, setAssignments] = useState<AssignmentID[]>([
    {
      id: "1",
      studentId: "1",
      assignedAt: moment().subtract(2, "days").toISOString(),
      surveyId,
      responseId: "1",
      submittedAt: moment().subtract(1, "days").toISOString(),
    },
  ]);
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const students = useStudents();

  useEffect(() => {
    setIsLoading(true);
    getAssignmentsBySurveyId(surveyId)
      .then((assignments) => setAssignments(assignments))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [surveyId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const columns: Column<AssignmentID>[] = [
    {
      name: "Student Name",
      getValue: (assignment: AssignmentID) =>
        isSurveyResponseUnidentifiedID(assignment)
          ? "N/A"
          : getFullName(
              students.find((student) => student.id === assignment.studentId)!
            ),
    },
    {
      name: "Student ID",
      getValue: (assignment: AssignmentID) => isPendingAssignmentID(assignment) || isSurveyResponseStudentIdID(assignment) ? assignment.studentId : "N/A",
    },
    {
      name: "Student Email",
      getValue: (assignment: AssignmentID) => isSurveyResponseStudentEmailID(assignment) ? assignment.studentEmail : "N/A",
    },
    {
      name: "Status",
      getValue: (assignment: AssignmentID) =>
        isPendingAssignmentID(assignment) ? "Pending" : "Completed",
    },
    {
      name: "Assignment Date",
      getValue: (assignment: AssignmentID) =>
        "assignedAt" in assignment
          ? moment(assignment.assignedAt).format("MMM D, YYYY")
          : "N/A",
    },
    {
      name: "Submission Date",
      getValue: (assignment: AssignmentID) =>
        isPendingAssignmentID(assignment)
          ? "N/A"
          : moment(assignment.submittedAt).format("MMM D, YYYY"),
    },
  ];

  const filterConditions: FilterCondition<AssignmentID>[] = [
    {
      name: "Student Name",
      getValue: (assignment: AssignmentID) =>
        isSurveyResponseUnidentifiedID(assignment)
          ? "N/A"
          : getFullName(
              students.find((student) => student.id === assignment.studentId)!
            ),
    },
    {
      name: "Student ID",
      getValue: (assignment: AssignmentID) => isPendingAssignmentID(assignment) || isSurveyResponseStudentIdID(assignment) ? assignment.studentId : "N/A",
    },
    {
      name: "Student Email",
      getValue: (assignment: AssignmentID) => isSurveyResponseStudentEmailID(assignment) ? assignment.studentEmail : "N/A",
    },
    {
      name: "Status",
      getValue: (assignment: AssignmentID) =>
        isPendingAssignmentID(assignment) ? "Pending" : "Completed",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.surveyTitle}>{survey.name}</h1>
          <h2 className={styles.surveyDescription}>{survey.description}</h2>
          <div className={styles.optionMenu}>
            <Link
              href={`https://docs.google.com/forms/d/${survey.id}/edit`}
              target="_blank"
            >
              <FaEdit className={styles.icon} size={30} title="Edit Survey" />
            </Link>
            <Link href={survey.responderUri} target="_blank">
              <FaEye className={styles.icon} size={30} title="View Survey" />
            </Link>
            <Link
              href={`https://docs.google.com/spreadsheets/d/${survey.linkedSheetId}/edit`}
              target="_blank"
            >
              <FaFileExcel
                className={styles.icon}
                size={30}
                title="View Responses Spreadsheet"
              />
            </Link>
            <FaEnvelope
              className={styles.icon}
              onClick={() => console.log("Email Survey")}
              size={30}
              title="Email Survey"
            />
            <FaPlus
              className={styles.icon}
              onClick={() => console.log("Assign Survey")}
              size={30}
              title="Assign Survey"
            />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <Table<AssignmentID>
            items={assignments}
            columns={columns}
            selectOptions={{
              selectedItemIds: selectedAssignmentIds,
              setSelectedItemIds: setSelectedAssignmentIds,
            }}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 25, 50, 100],
              includeAllOption: true,
            }}
            filterConditions={filterConditions}
          />
        </div>
      </div>
    </div>
  );
}
