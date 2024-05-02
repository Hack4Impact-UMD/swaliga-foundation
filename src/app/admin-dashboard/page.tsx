"use client";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import styles from "./AdminDashboardPage.module.css";
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
    type Student = {
        id: string;
        name: string;
        birthdate: string;
        hometown: string;
        email: string;
        checked: boolean;
    };

    const [isAllSelected, setIsAllSelected] = useState(false);
    // Sample student data
    /*const [students, setStudents] = useState([
        { name: "Jake", id: 1, birthdate: "01-01-2000", hometown: "Ashburn", email: "johndoe@gmail.com", checked: false  },
        { name: "Jane Doe", id: 2, birthdate: "02-02-2001", hometown: "Fairfax", email: "janedoe@gmail.com", checked: false  },
        { name: "Liz Smith", id: 3, birthdate: "03-03-2003", hometown: "Sterling", email: "bobsmith@gmail.com", checked: false  },
        { name: "Gwen Smith", id: 4, birthdate: "04-04-2004", hometown: "Reston", email: "miasmith@gmail.com", checked: false  },
        { name: "John Doe", id: 5, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 6, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 7, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 8, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 9, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 10, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 11, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 12, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 13, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 14, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 15, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 16, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 17, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 18, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 19, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 20, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 21, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 22, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 23, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 24, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 25, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 26, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 27, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 28, birthdate: "01-01-2000", hometown: "Ashburn", email: "johndoe@gmail.com", checked: false  },
        { name: "Jane Doe", id: 29, birthdate: "02-02-2001", hometown: "Fairfax", email: "janedoe@gmail.com", checked: false  },
        { name: "Liz Smith", id: 30, birthdate: "03-03-2003", hometown: "Sterling", email: "bobsmith@gmail.com", checked: false  },
        { name: "Gwen Smith", id: 31, birthdate: "04-04-2004", hometown: "Reston", email: "miasmith@gmail.com", checked: false  },
        { name: "John Doe", id: 32, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 33, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 34, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 35, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 36, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 37, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 38, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 39, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 40, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 41, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 42, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 43, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 44, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 45, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 46, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 47, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 48, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 49, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 50, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 51, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 52, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 53, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 54, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 55, birthdate: "01-01-2000", hometown: "Ashburn", email: "johndoe@gmail.com", checked: false  },
        { name: "Jane Doe", id: 56, birthdate: "02-02-2001", hometown: "Fairfax", email: "janedoe@gmail.com", checked: false  },
        { name: "Liz Smith", id: 57, birthdate: "03-03-2003", hometown: "Sterling", email: "bobsmith@gmail.com", checked: false  },
        { name: "Gwen Smith", id: 58, birthdate: "04-04-2004", hometown: "Reston", email: "miasmith@gmail.com", checked: false  },
        { name: "John Doe", id: 59, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 60, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 61, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 62, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 63, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 64, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 65, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 66, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 67, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 68, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 69, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 70, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 71, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 72, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 73, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 74, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 75, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 76, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 77, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 78, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 79, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 80, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 81, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 82, birthdate: "01-01-2000", hometown: "Ashburn", email: "johndoe@gmail.com", checked: false  },
        { name: "Jane Doe", id: 83, birthdate: "02-02-2001", hometown: "Fairfax", email: "janedoe@gmail.com", checked: false  },
        { name: "Liz Smith", id: 84, birthdate: "03-03-2003", hometown: "Sterling", email: "bobsmith@gmail.com", checked: false  },
        { name: "Gwen Smith", id: 85, birthdate: "04-04-2004", hometown: "Reston", email: "miasmith@gmail.com", checked: false  },
        { name: "John Doe", id: 86, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 87, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 88, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 89, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 90, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 91, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 92, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 93, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 94, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 95, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 96, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 97, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 98, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 99, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 100, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 101, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 102, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
    ]);
    */

    const [students, setStudents] = useState<Student[]>([]);
    const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const studentsPerPage = 50;
    const totalPages = Math.ceil(students.length / studentsPerPage);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentRefs = collection(db, 'users');
            const querySnapshot = await getDocs(studentRefs);
            const students: Student[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const name = data.middleName ? 
                    `${data.firstName} ${data.middleName} ${data.lastName}` : 
                    `${data.firstName} ${data.lastName}`;
                const student: Student = {
                    id: doc.id,
                    name,
                    birthdate: data.bday,
                    hometown: data.city,
                    email: data.email,
                    checked: false,
                };
                return student;
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

    const router = useRouter();

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const page = event.target.value;
        if (page === 'surveys') {
            router.push('/create-account'); // Navigate to the Surveys page, for testing purposes it links to creat-account page
        } else {
            router.push('/admin-dashboard');
        }
    };

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
                                <tr key={student.id}
                                className={student.checked ? styles.checkedRow : ''}
                                >
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={student.checked} 
                                            onChange={() => handleStudentCheck(student.id)}
                                        />
                                    </td>
                                    <td><i className="fas fa-user"></i>{student.name}</td>
                                    <td><i className="fas fa-address-card"></i>{student.id}</td>
                                    <td><i className="fas fa-birthday-cake"></i>{student.birthdate}</td>
                                    <td><i className="fas fa-city"></i>{student.hometown}</td>
                                    <td><i className="fas fa-envelope"></i>{student.email}</td>
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
            <div className={styles.footer}>
                <button className={styles.draftEmailButton}>Draft Email</button>
                <div className={styles.assignSurveysDropdown}>
                    <button className={styles.assignSurveysButton}>Assign Surveys</button>
                    <div className={styles.dropdownContent}>
                        {/* Populate this with actual survey options */}
                        <a href="#survey1">Survey 1</a>
                        <a href="#survey2">Survey 2</a>
                        <a href="#survey3">Survey 3</a>
                    </div>
                </div>
                <button className={styles.exportButton}>Export to Excel</button>
            </div>
        </div>
    );
}
