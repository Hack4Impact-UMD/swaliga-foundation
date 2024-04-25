"use client";

import React, { useState } from 'react';
import styles from './assign.module.css';

export default function Assign() {

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

        const userIds = []; //get from where?

        try {
            const response = await fetch('/api/assignSurveys', {
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
                <span className={styles.text}>End of Year Survey</span>
            </div>
            <div className={styles.centeredOval}>
                <input
                    type="checkbox"
                    id="allStudentsCheckbox"
                    className={styles.inputCheckbox}
                    checked={allStudentsChecked}
                    onChange={(ev) => setAllStudentsChecked(ev.target.checked)}
                />
                All Students Survey
            </div>
            <div className={styles.centeredOval}>
                <input
                    type="checkbox"
                    id="highSchoolersCheckbox"
                    className={styles.inputCheckbox}
                    checked={highSchoolersChecked}
                    onChange={(ev) => setHighSchoolersChecked(ev.target.checked)}
                />
                High Schoolers Survey
            </div>

            <button className={styles.button} onClick={assignSurveys}> Assign </button> 
            <span className={styles.closeIcon}></span>
            <span className={styles.filterIcon}></span>
        </div>
    );
}