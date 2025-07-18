"use client";

import Image from "next/image";
import styles from "./Modal.module.css";
import closeIcon from "@/../public/icons/close-icon.png";
import { cloneElement, useState } from "react";

interface ModalProps {
  children: [JSX.Element, React.ReactNode];
}

export default function Modal(props: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { children } = props;
  const [trigger, content] = children;

  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <>
      {cloneElement(trigger, { onClick: toggleModal })}
      {isOpen && (
        <div className={styles.modalBackground}>
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
