import Modal from "@/components/ui/Modal";
import { FaPlus, FaUndo } from "react-icons/fa";
import styles from "./AssignStudentsModal.module.css";
import { assignSurveys, unassignSurveys } from "./assignments";
import { PendingAssignmentID, SurveyID } from "@/types/survey-types";
import { useState } from "react";
import useStudents from "@/data/hooks/useStudents";
import { getFullName, Student } from "@/types/user-types";
import Select from "react-select";
import { FaX } from "react-icons/fa6";
import useSurveys from "@/data/hooks/useSurveys";

interface AssignSurveysModalProps {
  student: Student;
  existingAssignments: PendingAssignmentID[];
}

export default function AssignSurveysModal(props: AssignSurveysModalProps) {
  const { student, existingAssignments } = props;

  const [addedSurveyIds, setAddedSurveyIds] = useState<string[]>([]);
  const [removedSurveyIds, setRemovedSurveyIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { surveys } = useSurveys();
  const currAssignedSurveys: {
    survey: SurveyID;
    assignment: PendingAssignmentID;
  }[] = [];
  const currUnassignedSurveys: SurveyID[] = [];
  surveys.forEach((survey) => {
    const assignment = existingAssignments.find(
      (assignment) => assignment.surveyId === survey.id
    );
    if (assignment) {
      currAssignedSurveys.push({ survey, assignment });
    } else {
      currUnassignedSurveys.push(survey);
    }
  });

  const handleSaveAssignmentChanges = async () => {
    try {
      setError("");
      await Promise.all([
        assignSurveys([student.id], addedSurveyIds),
        unassignSurveys(
          existingAssignments.filter((assignment) =>
            removedSurveyIds.includes(assignment.surveyId)
          )
        ),
      ]);
      setMessage("Survey assignments successfully updated!");
    } catch (error) {
      setError("Failed to update survey assignments.");
    }
  };

  return (
    <Modal>
      <FaPlus className={styles.icon} size={30} title="Assign Survey" />
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <h1>"{getFullName(student.name)}" Assignments</h1>
          <h2>Assign New Students</h2>
          <Select
            className={styles.select}
            options={currUnassignedSurveys.map((survey) => ({
              value: survey.id,
              label: survey.name,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              setAddedSurveyIds(selectedOptions.map((option) => option.value))
            }
          />
          <h2 className={styles.text}>Current Assignments</h2>
          <ul className={styles.assignedSurveysList}>
            {currAssignedSurveys.map((assignedSurvey) => {
              const { survey, assignment } = assignedSurvey;
              const isRemoved = removedSurveyIds.includes(survey.id);
              return (
                <li
                  className={`${styles.assignedSurvey} ${
                    isRemoved && styles.removedAssignment
                  }`}
                  key={assignment.id}
                >
                  {`${getFullName(student.name)} (${student.email})`}
                  {isRemoved ? (
                    <FaUndo
                      className={styles.assignmentButton}
                      onClick={() =>
                        setRemovedSurveyIds((prev) =>
                          prev.filter((id) => id !== survey.id)
                        )
                      }
                    />
                  ) : (
                    <FaX
                      className={styles.assignmentButton}
                      onClick={() =>
                        setRemovedSurveyIds((prev) => [...prev, survey.id])
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.errorGroup}>
            <button
              className={styles.button}
              onClick={handleSaveAssignmentChanges}
            >
              <b>Save Changes</b>
            </button>
            <p className={styles.error}>{error}</p>
          </div>
        </>
      )}
    </Modal>
  );
}
