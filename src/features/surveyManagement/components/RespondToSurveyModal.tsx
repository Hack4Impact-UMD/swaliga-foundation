import Modal from "@/components/ui/Modal";
import { SurveyID } from "@/types/survey-types";
import styles from "./RespondToSurveyModal.module.css";
import useStudents from "@/data/hooks/useStudents/useStudents";
import { RiSurveyFill } from "react-icons/ri";

interface ResponseSurveyModalProps {
  survey: SurveyID;
}

export default function RespondSurveyModal(props: ResponseSurveyModalProps) {
  const { survey } = props;

  const studentId = useStudents().students[0].id;

  return (
    <Modal>
      <RiSurveyFill className={styles.icon} size={20} />
      <iframe
        className={styles.surveyWindow}
        src={`${survey.responderUri}?entry.${survey.idQuestionEntryNumber}=${studentId}`}
      />
    </Modal>
  );
}
