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

interface AssignStudentsModalProps {
  survey: SurveyID;
  existingAssignments: PendingAssignmentID[];
}

export default function AssignStudentsModal(props: AssignStudentsModalProps) {
  const { survey, existingAssignments } = props;

  const [addedStudentIds, setAddedStudentIds] = useState<string[]>([]);
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { students } = useStudents();
  const currAssignedStudents: {
    student: Student;
    assignment: PendingAssignmentID;
  }[] = [];
  const currUnassignedStudents: Student[] = [];
  students.forEach((student) => {
    const assignment = existingAssignments.find(
      (assignment) => assignment.studentId === student.id
    );
    if (assignment) {
      currAssignedStudents.push({
        student,
        assignment,
      });
    } else {
      currUnassignedStudents.push(student);
    }
  });

  const handleSaveAssignmentChanges = async () => {
    try {
      setError("");
      await Promise.all([
        assignSurveys(addedStudentIds, [survey.id]),
        unassignSurveys(
          existingAssignments.filter((assignment) =>
            removedStudentIds.includes(assignment.studentId)
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
          <h1>"{survey.name}" Assignments</h1>
          <h2>Assign New Students</h2>
          <Select
            className={styles.select}
            options={currUnassignedStudents.map((student) => ({
              value: student.id,
              label: `${getFullName(student.name)} (${student.email})`,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              setAddedStudentIds(selectedOptions.map((option) => option.value))
            }
          />
          <h2 className={styles.text}>Current Assignments</h2>
          <ul className={styles.assignedStudentsList}>
            {currAssignedStudents.map((assignedStudent) => {
              const { student, assignment } = assignedStudent;
              const isRemoved = removedStudentIds.includes(student.id);
              return (
                <li
                  className={`${styles.assignedStudent} ${
                    isRemoved && styles.removedAssignment
                  }`}
                  key={assignment.id}
                >
                  {`${getFullName(student.name)} (${student.email})`}
                  {isRemoved ? (
                    <FaUndo
                      className={styles.assignmentButton}
                      onClick={() =>
                        setRemovedStudentIds((prev) =>
                          prev.filter((id) => id !== student.id)
                        )
                      }
                    />
                  ) : (
                    <FaX
                      className={styles.assignmentButton}
                      onClick={() =>
                        setRemovedStudentIds((prev) => [...prev, student.id])
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
