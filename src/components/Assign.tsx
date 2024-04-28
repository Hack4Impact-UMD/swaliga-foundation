"use client";

import React, { useState, useEffect } from 'react';
import styles from './assign.module.css';

interface Survey {
    id: string;
    name: string;
}

interface AssignProps {
    userIds: string[]; 
}

export default function Assign({ userIds }: AssignProps) {
    const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);
    const [surveys, setSurveys] = useState<Survey[]>([]);

    useEffect(() => {
        // Fetch the list of surveys from the server when the component mounts
        async function fetchSurveys() {
            try {
                const response = await fetch('/api/surveys/[surveyId]');
                if (response.ok) {
                    const surveysData: Survey[] = await response.json();
                    setSurveys(surveysData);
                } else {
                    console.error('Failed to fetch surveys:', response.statusText);
                }
            } catch (error) {
                console.error('Error occurred while fetching surveys:', error);
            }
        }

        fetchSurveys();
    }, []);

    // Function to toggle the selection of a survey
    const toggleSurvey = (surveyId: string) => {
        const isSelected = selectedSurveys.includes(surveyId);
        setSelectedSurveys(prevSelected => {
            if (isSelected) {
                return prevSelected.filter(id => id !== surveyId);
            } else {
                return [...prevSelected, surveyId];
            }
        });
    };

    // Function to handle assigning surveys
    const assignSurveys = async () => {
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
                const responseData = await response.json();
                console.log(responseData.message);
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
            {surveys.map(survey => (
                <div key={survey.id} className={styles.centeredOval}>
                    <input
                        type="checkbox"
                        id={`surveyCheckbox_${survey.id}`}
                        className={styles.inputCheckbox}
                        checked={selectedSurveys.includes(survey.id)}
                        onChange={() => toggleSurvey(survey.id)}
                    />
                    <label htmlFor={`surveyCheckbox_${survey.id}`} className={styles.text}>{survey.name}</label>
                </div>
            ))}
            <button className={styles.button} onClick={assignSurveys}>Assign</button>
            <span className={styles.closeIcon}></span>
            <span className={styles.filterIcon}></span>
        </div>
    );
}
