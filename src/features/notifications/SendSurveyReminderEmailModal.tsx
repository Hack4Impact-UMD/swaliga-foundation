import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import styles from "./SendSurveyReminderEmailModal.module.css";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebaseConfig";
import Mail from "nodemailer/lib/mailer";
import {
  AssignmentID,
  isPendingAssignmentID,
  PendingAssignmentID,
  SurveyID,
} from "@/types/survey-types";
import { FaEnvelope } from "react-icons/fa";
import useStudents from "@/data/hooks/useStudents";
import { getFullName } from "@/types/user-types";
import MenuIcon from "@/components/ui/MenuIcon";

interface SendSurveyReminderEmailModalProps {
  survey: SurveyID;
  assignments: PendingAssignmentID[];
}

export default function SendSurveyReminderEmailModal(
  props: SendSurveyReminderEmailModalProps
): JSX.Element {
  const { survey, assignments } = props;

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { students } = useStudents();

  const receivingStudents = students.filter((student) =>
    assignments.some((assignment) => assignment.studentId === student.id)
  );

  const emailTemplate = useMemo(() => {
    return `
      <p>Hello,</p>
      <p>Our records show that you were asked to fill out the survey "${survey.name}", but have not done so yet. Please take a moment to fill it out by going to ${process.env.NEXT_PUBLIC_DOMAIN} and finding the survey under your pending assignments once you log in. If you believe this is a mistake, please contact Swaliga Foundation staff at <a href="mailto:info@swaligafoundation.org">info@swaligafoundation.org</a>.</p>
      <p>Thank you!</p>
      <p>Swaliga Foundation</p>
    `;
  }, [survey]);

  const handleSend = async () => {
    try {
      setError("");
      await httpsCallable(
        functions,
        "sendEmail"
      )({
        bcc: receivingStudents.map((student) => student.email),
        subject: `Reminder to Complete Survey "${survey.name}"`,
        html: emailTemplate,
      } satisfies Mail.Options);
      setMessage("Email sent successfully!");
    } catch (error) {
      setError("Failed to send email. Please try again later.");
    }
  };

  const handleClose = () => {
    setMessage("");
    setError("");
  };

  return (
    <Modal onClose={handleClose}>
      <MenuIcon icon={FaEnvelope} title="Send Reminder Email" />
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <p className={styles.text}>
            Are you sure you want to send a reminder email for survey "
            {survey.name}" to the following {receivingStudents.length} student
            {receivingStudents.length !== 1 ? "s" : ""}?
          </p>
          <ul className={styles.emailList}>
            {receivingStudents.map((student) => (
              <li key={student.id}>{`${getFullName(student.name)} (${
                student.email
              })`}</li>
            ))}
          </ul>
          <div className={styles.errorGroup}>
            <button className={styles.button} onClick={handleSend}>
              <b>Confirm</b>
            </button>
            <p className={styles.error}>{error}</p>
          </div>
        </>
      )}
    </Modal>
  );
}
