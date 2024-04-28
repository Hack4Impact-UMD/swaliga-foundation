"use client";

import React, { useState } from 'react';
import styles from './assign.module.css';

interface AssignProps {
    userIds: string[]; 
}

export default function Assign({ userIds }: AssignProps) {
    const [endOfYearChecked, setEndOfYearChecked] = useState(false);
    const [allStudentsChecked, setAllStudentsChecked] = useState(false);
    const [highSchoolersChecked, setHighSchoolersChecked] = useState(false);

    const assignSurveys = async () => {
        const selectedSurveys = [];
        if (endOfYearChecked) selectedSurveys.push('endOfYear');
        if (allStudentsChecked) selectedSurveys.push('allStudents');
        if (highSchoolersChecked) selectedSurveys.push('highSchoolers');

        if (selectedSurveys.length === 0) {
            return;
        }

        try {
            const response = await fetch('/api/surveys/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userIds: userIds,
                    surveyIds: selectedSurveys
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); 
            } else {
                const errorData = await response.json();
                console.error(errorData.error); 
            }
        } catch (error) {
            console.error('Error occurred while assigning surveys:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Assign Surveys</div>
            <div className={`${styles.centeredOval}`}>
                <input
                    type="checkbox"
                    id="endOfYearCheckbox"
                    className={styles.inputCheckbox}
                    checked={endOfYearChecked}
                    onChange={(ev) => setEndOfYearChecked(ev.target.checked)}
                />
                <label htmlFor="endOfYearCheckbox" className={styles.text}>End of Year Survey</label>
            </div>
            <div className={styles.centeredOval}>
                <input
                    type="checkbox"
                    id="allStudentsCheckbox"
                    className={styles.inputCheckbox}
                    checked={allStudentsChecked}
                    onChange={(ev) => setAllStudentsChecked(ev.target.checked)}
                />
                <label htmlFor="allStudentsCheckbox" className={styles.text}>All Students Survey</label>
            </div>
            <div className={styles.centeredOval}>
                <input
                    type="checkbox"
                    id="highSchoolersCheckbox"
                    className={styles.inputCheckbox}
                    checked={highSchoolersChecked}
                    onChange={(ev) => setHighSchoolersChecked(ev.target.checked)}
                />
                <label htmlFor="highSchoolersCheckbox" className={styles.text}>High Schoolers Survey</label>
            </div>
            <button className={styles.button} onClick={assignSurveys}>Assign</button> 
            <span className={styles.closeIcon}></span>
            <span className={styles.filterIcon}></span>
        </div>
    );
}
