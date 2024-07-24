import Modal from "@/components/Modal";
import styles from './DeleteSurveyModal.module.css';
import { Survey } from "@/types/survey-types";

interface DeleteSurveyModalProps {
  survey: Survey;
  closeDelete: () => void;
}

export default function DeleteSurveyModal(props: DeleteSurveyModalProps) {
  const { survey, closeDelete } = props;
  
  const confirmDelete = async () => {
    try {
      await fetch(`/api/surveys/${survey.formId}`, {
        method: 'DELETE',
      })
      closeDelete();
    } catch (err) {
      console.error('unable to delete survey', err);
    }
  }

  return (
    <Modal closeModal={closeDelete} width={500} height={400}>
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
        <button className={styles.button} onClick={confirmDelete}>
          <b>Confirm</b>
        </button>
      </>
    </Modal>
  );
}