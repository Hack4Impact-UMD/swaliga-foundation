"use client";

import {
  AssignmentID,
  isPendingAssignmentID,
  isSurveyResponseStudentEmailID,
  isSurveyResponseStudentIdID,
  isSurveyResponseUnidentifiedID,
  PendingAssignmentID,
  SurveyResponseID,
} from "@/types/survey-types";
import { useEffect, useState } from "react";
import styles from "./SurveyPage.module.css";
import { getAssignmentsBySurveyId } from "@/data/firestore/assignments";
import LoadingPage from "@/app/loading";
import Link from "next/link";
import { FaEdit, FaEye, FaFileExcel, FaPlus } from "react-icons/fa";
import useSurveys from "@/data/hooks/useSurveys";
import Table, { Column } from "@/components/ui/Table";
import useStudents from "@/data/hooks/useStudents";
import { getFullName } from "@/types/user-types";
import moment from "moment";
import { FilterCondition } from "@/components/Filter";
import SendSurveyReminderEmailModal from "@/features/notifications/SendSurveyReminderEmailModal";
import AssignStudentsModal from "@/features/surveyManagement/AssignStudentsModal";
import useAssignments from "@/data/hooks/useAssignments";

interface SurveyPageProps {
  surveyId: string;
}

export default function SurveyPage(props: SurveyPageProps) {
  const { surveyId } = props;

  const survey = useSurveys().find((survey) => survey.id === surveyId)!;
  const [selectedPendingAssignmentIds, setSelectedPendingAssignmentIds] =
    useState<string[]>([]);

  const students = useStudents();
  const { assignments } = useAssignments({ surveyId });

  const { pendingAssignments, surveyResponses } = useMemo(() => {
    const pendingAssignments: PendingAssignmentID[] = [];
    const surveyResponses: SurveyResponseID[] = [];
    assignments.forEach((assignment) =>
      isPendingAssignmentID(assignment)
        ? pendingAssignments.push(assignment)
        : surveyResponses.push(assignment)
    );
    return { pendingAssignments, surveyResponses };
  }, [assignments]);

  const pendingAssignmentColumns: Column<PendingAssignmentID>[] = [
    {
      name: "Student Name",
      getValue: (assignment: PendingAssignmentID) =>
        getFullName(
          students.find((student) => student.id === assignment.studentId)!.name
        ),
    },
    {
      name: "Student ID",
      getValue: (assignment: PendingAssignmentID) => assignment.studentId,
    },
    {
      name: "Assignment Date",
      getValue: (assignment: PendingAssignmentID) =>
        moment(assignment.assignedAt).format("MMM D, YYYY"),
    },
  ];

  const surveyResponsesColumns: Column<SurveyResponseID>[] = [
    {
      name: "Student Name",
      getValue: (assignment: SurveyResponseID) =>
        isSurveyResponseStudentIdID(assignment)
          ? getFullName(
              students.find((student) => student.id === assignment.studentId)!
                .name
            )
          : "N/A",
    },
    {
      name: "Student ID",
      getValue: (assignment: SurveyResponseID) =>
        isSurveyResponseStudentIdID(assignment) ? assignment.studentId : "N/A",
    },
    {
      name: "Student Email",
      getValue: (assignment: SurveyResponseID) => {
        if (isSurveyResponseStudentEmailID(assignment)) {
          return assignment.studentEmail;
        } else if (isSurveyResponseStudentIdID(assignment)) {
          return students.find(
            (student) => student.id === assignment.studentId
          )!.email;
        }
        return "N/A";
      },
    },
    {
      name: "Submission Timestamp",
      getValue: (assignment: SurveyResponseID) =>
        moment(assignment.submittedAt).format("M/D/YYYY HH:mm:ss"),
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
                .name
            ),
    },
    {
      name: "Student ID",
      getValue: (assignment: AssignmentID) =>
        isPendingAssignmentID(assignment) ||
        isSurveyResponseStudentIdID(assignment)
          ? assignment.studentId
          : "N/A",
    },
    {
      name: "Student Email",
      getValue: (assignment: AssignmentID) =>
        isSurveyResponseStudentEmailID(assignment)
          ? assignment.studentEmail
          : "N/A",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.surveyTitle}>{survey.name}</h1>
          <h2 className={styles.surveyDescription}>{survey.description}</h2>
          <div className={styles.surveyOptionMenu}>
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
          </div>
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Pending Assignments</h2>
            <div className={styles.tableOptionMenu}>
              {selectedPendingAssignmentIds.length > 0 && (
                <SendSurveyReminderEmailModal
                  survey={survey}
                  assignments={pendingAssignments.filter((assignment) =>
                    selectedPendingAssignmentIds.includes(assignment.id)
                  )}
                />
              )}
              <AssignStudentsModal
                survey={survey}
                assignments={pendingAssignments}
              />
            </div>
          </div>
          <Table<PendingAssignmentID>
            items={pendingAssignments}
            columns={pendingAssignmentColumns}
            selectOptions={{
              selectedItemIds: selectedPendingAssignmentIds,
              setSelectedItemIds: setSelectedPendingAssignmentIds,
            }}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 25, 50, 100],
              includeAllOption: true,
            }}
            filterConditions={filterConditions.slice(0, 2)}
          />
        </div>
        <div className={styles.tableContainer}>
          <h2 className={styles.tableTitle}>Responses</h2>
          <Table<SurveyResponseID>
            items={surveyResponses}
            columns={surveyResponsesColumns}
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
