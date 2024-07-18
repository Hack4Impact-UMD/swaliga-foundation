import styles from './Modal.module.css';

interface ModalProps {
  children: JSX.Element;
  closeModal: () => void;
}

export default function Modal(props: ModalProps) {
  const { children, closeModal } = props;
  return (
    <div className={styles.modalBackground}>
      <dialog className={styles.modal} open>
        <span className={styles.closeIcon} onClick={closeModal} />
        {children}
      </dialog>
    </div>
  );
}