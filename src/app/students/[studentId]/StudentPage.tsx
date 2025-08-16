"use client";

import { getAssignmentsByStudentId } from "@/data/firestore/assignments";
import useStudents from "@/data/hooks/useStudents";
import useAuth from "@/features/auth/useAuth";
import {
  AssignmentID,
  isPendingAssignmentID,
  PendingAssignmentID,
  SurveyResponseID,
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
  FaEnvelope,
  FaIdBadge,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

interface StudentPageProps {
  studentId: string;
}

export default function StudentPage(props: StudentPageProps) {
  const { studentId } = props;

  const [openPendingId, setOpenPendingId] = useState<string | null>(null);
  const [openResponseId, setOpenResponseId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const role = useAuth().token?.claims.role as Role;

  const student = useStudents().find((student) => student.id === studentId)!;
  const assignments = useAssignments({ studentId });
  const surveys = useSurveys(
    role === "STUDENT"
      ? [...new Set(assignments.map((assignment) => assignment.surveyId))]
      : []
  );

  const pendingAssignments: PendingAssignmentID[] = [];
  const surveyResponses: SurveyResponseID[] = [];
  assignments.forEach((assignment) =>
    isPendingAssignmentID(assignment)
      ? pendingAssignments.push(assignment)
      : surveyResponses.push(assignment)
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>{getFullName(student.name)}</h1>
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
        <h2>Surveys</h2>
        <h3 className={styles.surveysSectionHeader}>Pending Assignments</h3>
        <Accordion
          className={styles.accordion}
          type="multiple"
          value={openPendingId ? [openPendingId] : []}
        >
          {pendingAssignments.map((assignment) => {
            const survey = surveys.find(
              (survey) => survey.id === assignment.surveyId
            )!;
            return (
              <AccordionItem
                className={styles.pendingRow}
                value={assignment.id}
                key={assignment.id}
              >
                <AccordionHeader className={styles.rowHeader}>
                  <p>{survey.name}</p>
                  <AccordionTrigger className={styles.rowTrigger}>
                    {openPendingId === assignment.id ? (
                      <GoTriangleUp
                        size={30}
                        onClick={() => setOpenPendingId(null)}
                      />
                    ) : (
                      <GoTriangleDown
                        size={30}
                        onClick={() => setOpenPendingId(assignment.id)}
                      />
                    )}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <iframe
                    className={styles.embeddedForm}
                    src={`${survey.responderUri}?entry.${survey.idQuestionEntryNumber}=${student.id}`}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <h3 className={styles.surveysSectionHeader}>Past Responses</h3>
        <Accordion
          className={styles.accordion}
          type="multiple"
          value={openResponseId ? [openResponseId] : []}
        >
          {surveyResponses.map((assignment) => {
            const survey = surveys.find(
              (survey) => survey.id === assignment.surveyId
            )!;
            const isResponseEditable = true;
            return (
              <AccordionItem
                className={styles.responseRow}
                value={assignment.id}
                key={assignment.id}
              >
                <AccordionHeader className={styles.rowHeader}>
                  <p>{survey.name}</p>
                  <p>
                    {moment(assignment.submittedAt).format("M/D/YYYY HH:mm:ss")}
                  </p>
                  {isResponseEditable && (
                    <AccordionTrigger className={styles.rowTrigger}>
                      {openResponseId === assignment.id ? (
                        <GoTriangleUp
                          size={30}
                          onClick={() => setOpenResponseId(null)}
                        />
                      ) : (
                        <GoTriangleDown
                          size={30}
                          onClick={() => setOpenResponseId(assignment.id)}
                        />
                      )}
                    </AccordionTrigger>
                  )}
                </AccordionHeader>
                {isResponseEditable && (
                  <AccordionContent>
                    <iframe
                      className={styles.embeddedForm}
                      src={`${survey.responderUri}?edit2=${assignment.responseId}`}
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
