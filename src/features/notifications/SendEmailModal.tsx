import { useState } from "react";
import Modal from "../../components/ui/Modal";
import styles from "./SendEmailModal.module.css";
import { auth } from "@/config/firebaseConfig";

interface SendEmailModalProps {
  emails: string[];
  closeModal: () => void;
}

export default function SendEmailModal(props: SendEmailModalProps) {
  const { emails, closeModal } = props;
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const sendEmails = async () => {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: emails,
        subject: subject,
        text: content,
        idToken: await auth.currentUser?.getIdToken(),
      }),
    });
    closeModal();
  };

  return (
    <Modal closeModal={closeModal} width={750} height={750}>
      <div className={styles.container}>
        <div className={styles.title}>Send Emails</div>
        <div className={styles.subjectContainer}>
          <h5 className={styles.text}>Subject</h5>
          <input
            className={styles.subjectInput}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className={styles.contentContainer}>
          <h5 className={styles.text}>Content</h5>
          <textarea
            className={styles.contentInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={sendEmails}>
          Send Emails
        </button>
      </div>
    </Modal>
  );
}
