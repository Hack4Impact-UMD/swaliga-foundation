import Modal from "@/components/ui/Modal";
import styles from "./DeleteSurveyModal.module.css";
import { Survey, SurveyID } from "@/types/survey-types";
import { useState } from "react";
import { deleteSurvey, deleteSurveys } from "./surveys";
import { FaTrash } from "react-icons/fa";
import { getAccessTokenFromAuth } from "../auth/googleAuthZ";
import useAuth from "../auth/useAuth";

interface DeleteSurveyModalProps {
  surveys: Pick<SurveyID, "id" | "name">[];
  onSurveyDelete: (surveyIds: string[]) => void;
}

export default function DeleteSurveyModal(props: DeleteSurveyModalProps) {
  const { surveys, onSurveyDelete } = props;

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const auth = useAuth();

  const handleDeleteSurvey = async () => {
    if (surveys.length === 0) {
      setError("No surveys selected for deletion");
      return;
    }

    try {
      setError("");
      const surveyIds = surveys.map((survey) => survey.id);
      setMessage("This may take a minute...");
      surveys.length === 1
        ? await deleteSurvey(await getAccessTokenFromAuth(auth), surveyIds[0])
        : await deleteSurveys(await getAccessTokenFromAuth(auth), surveyIds);
      onSurveyDelete(surveyIds);
      setMessage(
        `${surveys.length} survey${
          surveys.length > 1 ? "s" : ""
        } deleted successfully!`
      );
    } catch (error) {
      setMessage("");
      setError(
        `Failed to delete survey${
          surveys.length > 1 ? "s" : ""
        }. Please try again later.`
      );
    }
  };

  const onClose = () => {
    setError("");
    setMessage("");
  };

  return (
    <Modal onClose={onClose}>
      <FaTrash className={styles.icon} size={40} />
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <p className={styles.text}>
            Are you sure you want to delete the following survey
            {surveys.length > 1 ? "s" : ""}?
          </p>
          <ul className={styles.surveyList}>
            {surveys.map((survey) => (
              <li key={survey.id}>{survey.name}</li>
            ))}
          </ul>
          <p className={styles.disclaimer}>
            If you delete {surveys.length > 1 ? "these surveys" : "this survey"}
            , all of {surveys.length > 1 ? "their" : "its"} data and responses
            will be deleted from this website. The survey
            {surveys.length > 1 ? "s" : ""} will also be moved to the trash in
            Google Drive.
          </p>
          <div className={styles.errorGroup}>
            <button className={styles.button} onClick={handleDeleteSurvey}>
              <b>Confirm</b>
            </button>
            <p className={styles.error}>{error}</p>
          </div>
        </>
      )}
    </Modal>
  );
}
