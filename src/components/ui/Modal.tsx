"use client";

import Image from "next/image";
import styles from "./Modal.module.css";
import closeIcon from "@/../public/icons/close-icon.png";
import React, { cloneElement, useState } from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: [JSX.Element, React.ReactNode];
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { children, onClose, ...rest } = props;
  const [trigger, content] = children;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <div onClick={openModal} {...rest}>{trigger}</div>
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
