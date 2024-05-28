// src/app/admin-dashboard/page.tsx
"use client";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import styles from "./AdminDashboardPage.module.css";
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Assign from '../../components/Assign'; 
import AdminSurveysList from "@/components/AdminSurveysList";

export default function DashboardPage() {
    type Student = {
        id: string;
        name: string;
        birthdate: string;
        hometown: string;
        email: string;
        checked: boolean;
        surveys?: string[];  // Optional surveys property
    };

    const [showUserList, setShowUserList] = useState<boolean>(true);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const studentsPerPage = 50;
    const totalPages = Math.ceil(students.length / studentsPerPage);
    const [showAssign, setShowAssign] = useState(false);  // State to control the display of the Assign component

    const handleDropdownChange = () => setShowUserList(!showUserList)
    const toggleAssign = () => setShowAssign(!showAssign);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentRefs = collection(db, 'users');
            const querySnapshot = await getDocs(studentRefs);
            const students = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const name = data.middleName ? 
                    `${data.firstName} ${data.middleName} ${data.lastName}` : 
                    `${data.firstName} ${data.lastName}`;
                return {
                    id: doc.id,
                    name,
                    birthdate: data.bday,
                    hometown: data.city,
                    email: data.email,
                    checked: false,
                };
            });
            setStudents(students);
        };
    
        fetchStudents();
    }, []);

    useEffect(() => {
        const indexOfLastStudent = (currentPage + 1) * studentsPerPage;
        const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
        setCurrentStudents(students.slice(indexOfFirstStudent, indexOfLastStudent));
    }, [currentPage, students]);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsAllSelected(checked);
        setStudents(students.map(student => ({ ...student, checked })));
    };

    const handleStudentCheck = (id: string) => {
        setStudents(
            students.map(student =>
                student.id === id ? { ...student, checked: !student.checked } : student
            )
        );
    };

    const handleNextPage = useCallback(() => {
        setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPages - 1));
    }, [totalPages]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 0));
    }, []);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <select className={styles.dropdown} onChange={handleDropdownChange}>
              <option value="student-info">Student Info</option>
              <option value="surveys">Surveys</option>
            </select>
          </div>
        </div>
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
        {showUserList ? (
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
                          onChange={handleSelectAll}
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
                    {currentStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={student.checked ? styles.checkedRow : ""}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={student.checked}
                            onChange={() => handleStudentCheck(student.id)}
                          />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.id}</td>
                        <td>{student.birthdate}</td>
                        <td>{student.hometown}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous 50 Students
                </button>
                <button
                  className={styles.paginationButton}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next 50 Students
                </button>
              </div>
            </div>
          </>
        ) : (
          <AdminSurveysList />
        )}
        <div className={styles.footer}>
          <button className={styles.draftEmailButton}>Draft Email</button>
          <button onClick={toggleAssign} className={styles.assignSurveysButton}>
            Assign Surveys
          </button>
          <button className={styles.exportButton}>Export to Excel</button>
        </div>

        {showAssign && (
          <Assign
            userIds={students
              .filter((student) => student.checked)
              .map((student) => student.id)}
          />
        )}
      </div>
    );
}
