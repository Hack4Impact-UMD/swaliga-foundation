import styles from "./ReassignResponseModal.module.css";
import Modal from "@/components/ui/Modal";
import { updateAssignment } from "@/data/firestore/assignments";
import useStudents from "@/data/hooks/useStudents/useStudents";
import {
  isSurveyResponseStudentEmailID,
  SurveyResponseID,
} from "@/types/survey-types";
import { getFullName, Student } from "@/types/user-types";
import { deleteField } from "firebase/firestore";
import { useState } from "react";
import { MdAssignmentInd } from "react-icons/md";
import Select from "react-select";

interface ReassignResponseModalProps {
  response: SurveyResponseID;
  currStudent?: Student;
  onReassign: (studentId: string) => void;
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

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currStudent?.id ?? ""
  );
  const [message, setMessage] = useState<
    ReassignResponseModalMessages | undefined
  >(undefined);

  const { students } = useStudents();

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
        studentId: selectedStudentId ? selectedStudentId : deleteField(),
        ...(isSurveyResponseStudentEmailID(response) && {
          studentEmail: deleteField(),
        }),
      });
      onReassign(selectedStudentId);
      setMessage(ReassignResponseModalMessages.SUCCESS);
    } catch (error) {
      setMessage(ReassignResponseModalMessages.ERROR);
    }
  };

  const options = [{ value: "", label: "Unassigned" }].concat(
    students.map((student) => ({
      value: student.id,
      label: `${getFullName(student.name)} (ID: ${student.id})`,
    }))
  );

  const handleClose = () => {
    setSelectedStudentId(currStudent?.id ?? "");
    setMessage(undefined);
  };

  return (
    <Modal onClose={handleClose}>
      <MdAssignmentInd className={styles.icon} />
      <div className={styles.modalContent}>
        <h1>Reassign Response</h1>
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
          options={options}
          isClearable
          isSearchable
          value={options.find((option) => option.value === selectedStudentId)}
          onChange={(option) => setSelectedStudentId(option?.value ?? "")}
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
