import styles from "./ReassignResponseModal.module.css";
import Modal from "@/components/ui/Modal";
import { updateAssignment } from "@/data/firestore/assignments";
import useStudents from "@/data/hooks/useStudents";
import { SurveyResponseID } from "@/types/survey-types";
import { getFullName, Student } from "@/types/user-types";
import { useState } from "react";
import { MdAssignmentInd } from "react-icons/md";
import Select from "react-select";

interface ReassignResponseModalProps {
  response: SurveyResponseID;
  currStudent?: Student;
  onReassign: (responseId: string, studentId?: string) => void;
}

enum ReassignResponseModalMessages {
  ERROR = "Failed to reassign response",
  LOADING = "Reassigning response...",
  SUCCESS = "Response successfully reassigned!",
  SAME_STUDENT = "Response is already assigned to the selected student.",
}

export default function ReassignResponseModal(
  props: ReassignResponseModalProps
) {
  const { response, currStudent, onReassign } = props;

  const [selectedStudentId, setSelectedStudentId] = useState<
    string | undefined
  >(currStudent?.id ?? undefined);
  const [message, setMessage] = useState<
    ReassignResponseModalMessages | undefined
  >(undefined);

  const students = useStudents();

  const handleReassignResponse = async () => {
    try {
      if (
        (!selectedStudentId && !currStudent) ||
        selectedStudentId === currStudent?.id
      ) {
        setMessage(ReassignResponseModalMessages.SAME_STUDENT);
        return;
      }
      setMessage(ReassignResponseModalMessages.LOADING);
      await updateAssignment(response.surveyId, response.id, {
        studentId: selectedStudentId,
      });
      onReassign(response.id, selectedStudentId);
      setMessage(ReassignResponseModalMessages.SUCCESS);
    } catch (error) {
      setMessage(ReassignResponseModalMessages.ERROR);
    }
  };

  const handleClose = () => {
    setSelectedStudentId(currStudent?.id);
    setMessage(undefined);
  }

  return (
    <Modal onClose={handleClose}>
      <MdAssignmentInd />
      <div className={styles.modalContent}>
        <h1>Reassign Assignment</h1>
        {currStudent ? (
          <p className={styles.text}>
            This response was submitted by {getFullName(currStudent.name)} (ID:{" "}
            {currStudent.id}). If this is incorrect, select the correct student
            below.
          </p>
        ) : (
          <p className={styles.text}>
            The student who submitted this response is unidentified. If you know
            the student who submitted this response, select them below.
          </p>
        )}
        <Select
          className={styles.select}
          // @ts-expect-error
          options={students.map((student) => ({
            value: student.id,
            label: `${getFullName(student.name)} (ID: ${student.id})`,
          }))}
          isClearable
          isSearchable
          value={selectedStudentId}
          onChange={(option) => setSelectedStudentId(option || undefined)}
        />
        <button onClick={handleReassignResponse} className={styles.button}>
          Confirm Reassignment
        </button>
        {message && (
          <p
            className={
              message === ReassignResponseModalMessages.ERROR
                ? styles.error
                : message === ReassignResponseModalMessages.SUCCESS
                ? styles.success
                : ""
            }
          >
            {message}
          </p>
        )}
      </div>
    </Modal>
  );
}
