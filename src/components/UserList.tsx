"use client";

import { Survey } from "@/types/survey-types";
import { User } from "@/types/user-types";
import styles from "./UserList.module.css";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function UserList(props: { users: User[]; surveys: Survey[] }) {
  const { users, surveys } = props;
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const studentsPerPage = 50;
  const totalPages = Math.ceil(users.length / studentsPerPage);

  const handleStudentCheck = (id: string): void => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((studentId) => studentId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  }

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search" />
          <FaTimes className={styles.closeIcon} />
        </div>
        <div className={styles.filterBox}>
          <FaFilter className={styles.filterIcon} />
          <button>Filter</button>
          <FaTimes className={styles.closeIcon} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => setIsAllSelected(!isAllSelected)}
                  />
                  Select All
                </th>
                <th>Name</th>
                <th>ID</th>
                <th>Birthdate</th>
                <th>Hometown</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(currentPage * studentsPerPage, (currentPage + 1) * studentsPerPage).map((student) => (
                <tr
                  key={student.id}
                  className={student.id in selectedStudentIds ? styles.checkedRow : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleStudentCheck(student.id)}
                    />
                  </td>
                  <td>{student.middleName ? `${student.firstName} ${student.middleName} ${student.lastName}` : `${student.firstName} ${student.lastName}`}</td>
                  <td>{student.id}</td>
                  <td>{student.birthdate?.toUTCString()}</td>
                  <td>{student.address.city}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous 50 Students
          </button>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next 50 Students
          </button>
        </div>
      </div>
    </>
  );
}
