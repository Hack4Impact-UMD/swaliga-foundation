import styles from './Modal.module.css';

interface ModalProps {
  children: JSX.Element;
  closeModal: () => void;
  width: number;
  height: number;
}

export default function Modal(props: ModalProps) {
  const { children, closeModal, width, height } = props;
  return (
    <div className={styles.modalBackground}>
      <dialog className={styles.modal} open style={{ width, height }}>
        <span className={styles.closeIcon} onClick={closeModal} />
        {children}
      </dialog>
    </div>
  );
}