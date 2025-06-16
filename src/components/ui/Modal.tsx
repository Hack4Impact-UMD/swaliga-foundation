import Image from 'next/image';
import styles from './Modal.module.css';
import closeIcon from '@/../public/icons/close-icon.png';

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
        <span className={styles.closeIcon} onClick={closeModal} >
          <Image src={closeIcon} alt="Close Icon" />
        </span>
        {children}
      </dialog>
    </div>
  );
}