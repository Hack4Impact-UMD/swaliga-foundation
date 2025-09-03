"use client";

import useStudents from "@/data/hooks/useStudents/useStudents";
import useAuth from "@/features/auth/authN/components/useAuth";
import {
  isPendingAssignmentID,
  PendingAssignmentID,
  SurveyResponseStudentIdID,
} from "@/types/survey-types";
import { getFullAddress, getFullName, Role } from "@/types/user-types";
import moment from "moment";
import { cloneElement, useMemo } from "react";
import styles from "./StudentPage.module.css";
import LoadingPage from "@/app/loading";
import useSurveys from "@/data/hooks/useSurveys/useSurveys";
import useAssignments from "@/data/hooks/useAssignments/useAssignments";
import {
  FaAddressBook,
  FaBirthdayCake,
  FaEnvelope,
  FaFileExport,
  FaIdBadge,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import Table, { Column } from "@/components/ui/table/Table";
import RespondToSurveyModal from "@/features/surveyManagement/components/RespondToSurveyModal";
import EditAccountModal from "@/features/accountManagement/components/EditAccountModal";
import ReassignResponseModal from "@/features/surveyManagement/components/ReassignResponseModal";
import AssignSurveysModal from "@/features/surveyManagement/components/AssignSurveysModal";
import ErrorPage from "@/app/error";
import MenuIcon from "@/components/ui/MenuIcon";
import { exportFullStudentDataToCSV } from "@/features/dataExporting/exportCSV";

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
  const student =
    role === "STUDENT"
      ? students[0]
      : students.find((student) => student.id === studentId);

  const {
    assignments,
    setAssignments,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
    refetch: refetchAssignments,
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
  } else if (isStudentsError) {
    return <ErrorPage error="Failed to get student data." />;
  } else if (!student) {
    return <ErrorPage error="Student not found." />;
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
      sortFunc: (a, b) =>
        surveys
          .find((survey) => survey.id === a.surveyId)!
          .name.localeCompare(
            surveys.find((survey) => survey.id === b.surveyId)!.name
          ),
    },
    {
      name: "Description",
      getValue: (assignment: PendingAssignmentID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!
          .description,
      sortFunc: (a, b) =>
        surveys
          .find((survey) => survey.id === a.surveyId)!
          .description.localeCompare(
            surveys.find((survey) => survey.id === b.surveyId)!.description
          ),
    },
    {
      name: "Assignment Date",
      getValue: (assignment: PendingAssignmentID) =>
        moment(assignment.assignedAt).format("MMM D, YYYY"),
      sortFunc: (a, b) =>
        moment(a.assignedAt).isBefore(moment(b.assignedAt)) ? -1 : 1,
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
      sortFunc: (a, b) =>
        surveys
          .find((survey) => survey.id === a.surveyId)!
          .name.localeCompare(
            surveys.find((survey) => survey.id === b.surveyId)!.name
          ),
    },
    {
      name: "Description",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        surveys.find((survey) => survey.id === assignment.surveyId)!
          .description,
      sortFunc: (a, b) =>
        surveys
          .find((survey) => survey.id === a.surveyId)!
          .description.localeCompare(
            surveys.find((survey) => survey.id === b.surveyId)!.description
          ),
    },
    {
      name: "Submission Date",
      getValue: (assignment: SurveyResponseStudentIdID) =>
        moment(assignment.submittedAt).format("MMM D, YYYY"),
      sortFunc: (a, b) =>
        moment(a.submittedAt).isBefore(moment(b.submittedAt)) ? -1 : 1,
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
          {!isAssignmentsLoading && !isSurveysLoading && (
            <MenuIcon
              icon={FaFileExport}
              title="Export Student Data"
              onClick={() =>
                exportFullStudentDataToCSV(
                  student,
                  surveyResponses.map((response) => ({
                    ...response,
                    surveyName:
                      surveys.find((survey) => survey.id === response.surveyId)
                        ?.name || "Unknown Survey",
                  }))
                )
              }
            />
          )}
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
                onAssignmentsChanged={refetchAssignments}
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
