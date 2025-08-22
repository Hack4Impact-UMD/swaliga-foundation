"use client";

import { getAssignmentsByStudentId } from "@/data/firestore/assignments";
import useStudents from "@/data/hooks/useStudents";
import useAuth from "@/features/auth/useAuth";
import {
  AssignmentID,
  isPendingAssignmentID,
  PendingAssignmentID,
  SurveyResponseID,
  SurveyResponseStudentIdID,
} from "@/types/survey-types";
import { getFullAddress, getFullName, Role, Student } from "@/types/user-types";
import moment from "moment";
import { cloneElement, useEffect, useState } from "react";
import styles from "./StudentPage.module.css";
import LoadingPage from "@/app/loading";
import useSurveys from "@/data/hooks/useSurveys";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import useAssignments from "@/data/hooks/useAssignments";
import {
  FaAddressBook,
  FaBirthdayCake,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaIdBadge,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import Table, { Column } from "@/components/ui/Table";
import RespondToSurveyModal from "@/features/surveyManagement/RespondToSurveyModal";
import EditAccountModal from "@/app/create-account/EditAccountModal";

interface StudentPageProps {
  studentId: string;
}

export default function StudentPage(props: StudentPageProps) {
  const { studentId } = props;

  const [error, setError] = useState<string>("");

  const role = useAuth().token?.claims.role as Role;

  const student = useStudents().find((student) => student.id === studentId)!;
  const { assignments } = useAssignments({ studentId });
  const surveys = useSurveys(
    role === "STUDENT"
      ? [...new Set(assignments.map((assignment) => assignment.surveyId))]
      : []
  );

  const pendingAssignments: PendingAssignmentID[] = [];
  const surveyResponses: SurveyResponseStudentIdID[] = [];
  assignments.forEach((assignment) =>
    isPendingAssignmentID(assignment)
      ? pendingAssignments.push(assignment)
      : surveyResponses.push(assignment as SurveyResponseStudentIdID)
  );

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
      name: "Assignment Date",
      getValue: (assignment: PendingAssignmentID) =>
        moment(assignment.assignedAt).format("MMM D, YYYY"),
    },
    {
      name: "Respond",
      getValue: (assignment: PendingAssignmentID) => (
        <RespondToSurveyModal
          survey={surveys.find((survey) => survey.id === assignment.surveyId)!}
        />
      ),
    },
  ];

  const responsesColumns: Column<SurveyResponseStudentIdID>[] = [
    {
      name: "Survey Name",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!.name,
    },
    {
      name: "Submission Date",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        moment(assignment.submittedAt).format("MMM D, YYYY"),
    },
    {
      name: "View Response",
      getValue: (assignment: SurveyResponseStudentIdID) => (
        <FaEye className={styles.icon} size={20} />
      ),
    },
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
        <h3 className={styles.surveysSectionHeader}>Pending Assignments</h3>
        <div className={styles.tableContainer}>
          <Table
            items={pendingAssignments}
            columns={pendingAssignmentsColumns}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 20],
              includeAllOption: true,
            }}
          />
        </div>
        <h3 className={styles.surveysSectionHeader}>Past Responses</h3>
        <div className={styles.tableContainer}>
          <Table
            items={surveyResponses}
            columns={responsesColumns}
            paginationOptions={{
              itemsPerPageOptions: [5, 10, 20],
              includeAllOption: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
