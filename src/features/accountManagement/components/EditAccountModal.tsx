"use client";

import styles from "./EditAccountModal.module.css";
import Modal from "@/components/ui/Modal";
import { FaEdit } from "react-icons/fa";
import EditAccountForm from "./EditAccountForm";
import useStudents from "@/data/hooks/useStudents/useStudents";
import { Student } from "@/types/user-types";
import MenuIcon from "@/components/ui/MenuIcon";

interface EditAccountModalProps {
  student: Student;
}

export default function EditAccountModal(props: EditAccountModalProps) {
  const { student } = props;

  const students = useStudents();

  return (
    <Modal>
      <MenuIcon icon={FaEdit} title="Edit Account" />
      <div className={styles.modalContainer}>
        <h1 className={styles.header}>Edit Account</h1>
        <EditAccountForm mode={"EDIT"} student={student} />
      </div>
    </Modal>
  );
}
