"use client";

import React, { useState, useEffect } from 'react';
import { Survey } from '@/types/survey-types';
import styles from './assign.module.css';

interface AssignProps {
    userIds: string[];
    surveys: Survey[];
    closeAssign: () => void;
}

export default function Assign({ userIds, surveys, closeAssign }: AssignProps) {
    const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);

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
            console.log(userIds)
            console.log(selectedSurveys)
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
            closeAssign();
        } catch (error) {
            console.error('Error occurred while assigning surveys:', error);
        }
    };

    return (
      <div className={styles.container}>
        <span className={styles.closeIcon} onClick={closeAssign} />
        <div className={styles.title}>Assign Surveys</div>
        <div className={styles.surveys}>
          {surveys.map((survey) => (
            <div key={survey.formId} className={styles.centeredOval}>
              <input
                type="checkbox"
                id={`surveyCheckbox_${survey.formId}`}
                className={styles.inputCheckbox}
                checked={selectedSurveys.includes(survey.formId)}
                onChange={() => toggleSurvey(survey.formId)}
              />
              <label
                htmlFor={`surveyCheckbox_${survey.formId}`}
                className={styles.text}
              >
                {survey.info.title}
              </label>
            </div>
          ))}
        </div>
        <button className={styles.button} onClick={assignSurveys}>
          Assign
        </button>
      </div>
    );
}