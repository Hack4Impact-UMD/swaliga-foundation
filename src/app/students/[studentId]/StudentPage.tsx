"use client";

import useStudents from "@/data/hooks/useStudents";
import useAuth from "@/features/auth/useAuth";
import {
  isPendingAssignmentID,
  PendingAssignmentID,
  SurveyResponseStudentIdID,
} from "@/types/survey-types";
import { getFullAddress, getFullName, Role, Student } from "@/types/user-types";
import moment from "moment";
import { cloneElement, useMemo, useState } from "react";
import styles from "./StudentPage.module.css";
import LoadingPage from "@/app/loading";
import useSurveys from "@/data/hooks/useSurveys";
import useAssignments from "@/data/hooks/useAssignments";
import {
  FaAddressBook,
  FaBirthdayCake,
  FaEnvelope,
  FaIdBadge,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import Table, { Column } from "@/components/ui/Table";
import RespondToSurveyModal from "@/features/surveyManagement/RespondToSurveyModal";
import EditAccountModal from "@/app/create-account/EditAccountModal";
import ReassignResponseModal from "@/features/surveyManagement/ReassignResponseModal";
import AssignSurveysModal from "@/features/surveyManagement/AssignSurveysModal";

interface StudentPageProps {
  studentId: string;
}

export default function StudentPage(props: StudentPageProps) {
  const role = useAuth().token?.claims.role as Role;

  const { studentId } = props;
  const {
    students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
  } = useStudents();
  const student = students.find((student) => student.id === studentId)!;

  const {
    assignments,
    setAssignments,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
  } = useAssignments({
    studentId,
  });
  const { pendingAssignments, surveyResponses } = useMemo(() => {
    let pendingAssignments: PendingAssignmentID[] = [];
    let surveyResponses: SurveyResponseStudentIdID[] = [];
    assignments.forEach((assignment) =>
      isPendingAssignmentID(assignment)
        ? pendingAssignments.push(assignment)
        : surveyResponses.push(assignment as SurveyResponseStudentIdID)
    );
    pendingAssignments = pendingAssignments.sort((a, b) =>
      a.assignedAt.localeCompare(b.assignedAt)
    );
    surveyResponses = surveyResponses.sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt)
    );
    return { pendingAssignments, surveyResponses };
  }, [assignments]);

  const surveyIds = useMemo(() => {
    return role === "STUDENT"
      ? [...new Set(assignments.map((assignment) => assignment.surveyId))]
      : [];
  }, [assignments, role]);
  const {
    surveys,
    isLoading: isSurveysLoading,
    isError: isSurveysError,
  } = useSurveys(surveyIds);

  if (isStudentsLoading) {
    return <LoadingPage />;
  }

  if (isStudentsError) {
    throw new Error("Failed to get student data.");
  }

  const studentInfo = [
    {
      field: "ID Number",
      value: student.id,
      icon: <FaIdBadge />,
    },
    {
      field: "Email",
      value: student.email,
      icon: <FaEnvelope />,
    },
    {
      field: "Date of Birth",
      value: moment(student.dateOfBirth).format("MMMM D, YYYY"),
      icon: <FaBirthdayCake />,
    },
    {
      field: "Gender",
      value: student.gender,
      icon: <FaVenusMars />,
    },
    {
      field: "Ethnicity",
      value: student.ethnicity.join(", "),
      icon: <FaPeopleGroup />,
    },
    {
      field: "Phone",
      value: student.phone,
      icon: <FaPhone />,
    },
    {
      field: "Address",
      value: getFullAddress(student.address),
      icon: <FaAddressBook />,
    },
  ];

  const pendingAssignmentsColumns: Column<PendingAssignmentID>[] = [
    {
      name: "Survey Name",
      getValue: (assignment: PendingAssignmentID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!.name,
    },
    {
      name: "Description",
      getValue: (assignment: PendingAssignmentID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!
          .description,
    },
    {
      name: "Assignment Date",
      getValue: (assignment: PendingAssignmentID) =>
        moment(assignment.assignedAt).format("MMM D, YYYY"),
    },
    ...(role === "STUDENT"
      ? [
          {
            name: "Respond",
            getValue: (assignment: PendingAssignmentID) => (
              <RespondToSurveyModal
                survey={
                  surveys.find((survey) => survey.id === assignment.surveyId)!
                }
              />
            ),
          },
        ]
      : []),
  ];

  const responsesColumns: Column<SurveyResponseStudentIdID>[] = [
    {
      name: "Survey Name",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!.name,
    },
    {
      name: "Description",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!
          .description,
    },
    {
      name: "Submission Date",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        moment(assignment.submittedAt).format("MMM D, YYYY"),
    },
    ...(role === "ADMIN" || role === "STAFF"
      ? [
          {
            name: "Reassign Response",
            getValue: (assignment: SurveyResponseStudentIdID) => (
              <ReassignResponseModal
                response={assignment}
                currStudent={student}
                onReassign={() =>
                  setAssignments((prev) =>
                    prev.filter((a) => a.id !== assignment.id)
                  )
                }
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h1 className={styles.header}>{getFullName(student.name)}</h1>
          <EditAccountModal student={student} />
        </div>
        <div className={styles.infoFieldsContainer}>
          {studentInfo.map((info) => (
            <div className={styles.infoRow} key={info.field}>
              <div className={`${styles.infoRowField} ${styles.infoRowBox}`}>
                {cloneElement(info.icon, { className: styles.icon })}
                {info.field}
              </div>
              <div className={`${styles.infoRowValue} ${styles.infoRowBox}`}>
                {info.value}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.optionsMenu}>
            <h3 className={styles.surveysSectionHeader}>Pending Assignments</h3>
            {(role === "ADMIN" || role === "STAFF") && (
              <AssignSurveysModal
                student={student}
                existingAssignments={pendingAssignments}
              />
            )}
          </div>
          <Table
            items={pendingAssignments}
            columns={pendingAssignmentsColumns}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 20],
              includeAllOption: true,
            }}
            isLoading={isAssignmentsLoading || isSurveysLoading}
            isError={isAssignmentsError || isSurveysError}
          />
        </div>
        <div className={styles.tableContainer}>
          <h3 className={styles.surveysSectionHeader}>Past Responses</h3>
          <Table
            items={surveyResponses}
            columns={responsesColumns}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 20],
              includeAllOption: true,
            }}
            isLoading={isAssignmentsLoading || isSurveysLoading}
            isError={isAssignmentsError || isSurveysError}
          />
        </div>
      </div>
    </div>
  );
}
