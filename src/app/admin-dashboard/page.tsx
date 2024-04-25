"use client";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import styles from "./AdminDashboardPage.module.css";
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    type Student = {
        id: number;
        name: string;
        checked: boolean;
    };
    const [isAllSelected, setIsAllSelected] = useState(false);
    // Sample student data
    const [students, setStudents] = useState([
        { name: "John Doe", id: 100101, birthdate: "01-01-2000", hometown: "Ashburn", email: "johndoe@gmail.com", checked: false  },
        { name: "Jane Doe", id: 200102, birthdate: "02-02-2001", hometown: "Fairfax", email: "janedoe@gmail.com", checked: false  },
        { name: "Liz Smith", id: 301103, birthdate: "03-03-2003", hometown: "Sterling", email: "bobsmith@gmail.com", checked: false  },
        { name: "Gwen Smith", id: 411104, birthdate: "04-04-2004", hometown: "Reston", email: "miasmith@gmail.com", checked: false  },
        { name: "John Doe", id: 510115, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510111, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510112, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510113, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510114, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510116, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510117, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101177, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510119, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510110, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101178, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 51011996, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 511134, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101186, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101199, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101167, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101190, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 51011444, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 51011000, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 510118884, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101185885, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 5101199595, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
        { name: "John Doe", id: 51011569669, birthdate: "05-05-2005", hometown: "Richmond", email: "samkim@gmail.com", checked: false  },
    ]);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsAllSelected(checked);
        setStudents(students.map(student => ({ ...student, checked })));
    };

    const handleStudentCheck = (id: number) => {
        setStudents(
            students.map(student =>
                student.id === id ? { ...student, checked: !student.checked } : student
            )
        );
    };

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
                            {students.map((student) => (
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