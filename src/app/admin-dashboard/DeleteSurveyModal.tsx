import Modal from "@/components/Modal";
import styles from './DeleteSurveyModal.module.css';
import { Survey } from "@/types/survey-types";
import { useState } from "react";

interface DeleteSurveyModalProps {
  survey: Survey;
  closeDelete: () => void;
  handleDeleteSurvey: () => void;
}

export default function DeleteSurveyModal(props: DeleteSurveyModalProps) {
  const { survey, closeDelete, handleDeleteSurvey } = props;
  const [error, setError] = useState<string>("")
  
  const confirmDelete = async () => {
    try {
      // delete survey from Firestore
      const response = await fetch(`/api/surveys/${survey.formId}`, {
        method: 'DELETE',
      });
      if (response.status !== 200) {
        setError("Unable to delete survey");
        return;
      }
      handleDeleteSurvey(); // force admin dashboard to refresh to remove survey from list
      closeDelete(); // close modal
    } catch (err) {
      console.error('unable to delete survey', err);
    }
  }

  return (
    <Modal closeModal={closeDelete} width={500} height={500}>
      <>
        <p className={styles.text}>
          Are you sure you want to delete the following survey?
        </p>
        <p className={styles.text}>
          <b>{survey.info.title}</b>
        </p>
        <p className={styles.disclaimer}>
          If you delete this survey, all of its data and responses will be
          permanently deleted from this website. The survey will not be deleted
          from Google Drive. This step must be done manually in your Google
          account.
        </p>
        <div>
          <p className={styles.error}>{error}</p>
          <button className={styles.button} onClick={confirmDelete}>
            <b>Confirm</b>
          </button>
        </div>
      </>
    </Modal>
  );
}