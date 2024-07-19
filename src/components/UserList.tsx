"use client";

import { Survey } from "@/types/survey-types";
import { User } from "@/types/user-types";
import styles from "./UserList.module.css";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import Filter from "./Filter";
import Assign from "./Assign";
import { exportUsersToCSV } from "@/lib/exportCSV";
import { Timestamp } from "firebase/firestore";

export default function UserList(props: { users: User[]; surveys: Survey[] }) {
  const { users, surveys } = props;
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);

  const studentsPerPage = 50;
  const totalPages = Math.ceil(users.length / studentsPerPage);

  const handleStudentCheck = (id: string): void => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(
        selectedStudentIds.filter((studentId) => studentId !== id)
      );
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(users.map((user) => user.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) {
      return "N/A"; 
    }
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US');
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
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
              {filteredUsers
                .slice(
                  currentPage * studentsPerPage,
                  (currentPage + 1) * studentsPerPage
                )
                .map((student) => (
                  <tr
                    key={student.id}
                    className={
                      selectedStudentIds.includes(student.id) ? styles.checkedRow : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => handleStudentCheck(student.id)}
                      />
                    </td>
                    <td>
                      {student.middleName
                        ? `${student.firstName} ${student.middleName} ${student.lastName}`
                        : `${student.firstName} ${student.lastName}`}
                    </td>
                    <td>{student.id}</td>
                    <td>{formatDate(student.birthdate)}</td>
                    <td>{student.address?.city}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className={styles.filterContainer}>
          {isFilterOpen ? (
            <Filter
              closeFilter={toggleFilter}
              users={users}
              setSelectedStudentIds={setSelectedStudentIds}
              setFilteredUsers={setFilteredUsers}
            />
          ) : (
            <div className={styles.filterBox} onClick={toggleFilter}>
              <FaFilter className={styles.filterIcon} />
            </div>
          )}
        </div>
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
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Next 50 Students
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.paginationButton}
          onClick={() => setIsAssignOpen(true)}
        >
          Assign Surveys
        </button>
        <button className={styles.paginationButton} onClick={() => exportUsersToCSV(users.filter(user => selectedStudentIds.includes(user.id)))}>Export Selected Users to CSV</button>
      </div>
      {isAssignOpen && <Assign studentIds={selectedStudentIds} surveys={surveys} closeAssign={() => setIsAssignOpen(false)}/>}
    </>
  );
}