"use client";

import Image from "next/image";
import styles from "./Modal.module.css";
import closeIcon from "@/../public/icons/close-icon.png";
import { cloneElement, useState } from "react";

interface ModalProps {
  children: [JSX.Element, React.ReactNode];
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { children, onClose } = props;
  const [trigger, content] = children;

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    if (isOpen && onClose) {
      onClose();
    }
  };

  return (
    <>
      {cloneElement(trigger, { onClick: toggleModal })}
      {isOpen && (
        <div className={styles.modalBackground} onClick={toggleModal}>
          <dialog className={styles.modal}>
            <span className={styles.closeIcon} onClick={toggleModal}>
              <Image src={closeIcon} alt="Close Icon" />
            </span>
            {content}
          </dialog>
        </div>
      )}
    </>
  );
}
