"use client";

import Image from "next/image";
import styles from "./Modal.module.css";
import closeIcon from "@/../public/icons/close-icon.png";
import { cloneElement, MouseEvent, useState } from "react";

interface ModalProps {
  children: [JSX.Element, React.ReactNode];
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { children, onClose } = props;
  const [trigger, content] = children;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = (e: MouseEvent) => setIsOpen(true);
  const closeModal = (e: MouseEvent) => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {cloneElement(trigger, { onClick: openModal })}
      {isOpen && (
        <div className={styles.modalBackground} onClick={closeModal}>
          <dialog className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeIcon} onClick={closeModal}>
              <Image src={closeIcon} alt="Close Icon" />
            </span>
            {content}
          </dialog>
        </div>
      )}
    </>
  );
}
