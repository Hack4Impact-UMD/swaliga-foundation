"use client";

import React, { useState } from 'react';
import styles from './Create.module.css';

export default function Create() {
    const [surveyTitle, setSurveyTitle] = useState("");

    const createSurvey = async () => {
        try {
            const response = await fetch('/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentTitle: surveyTitle,
                    title: surveyTitle
                })
            });

            if (response.ok) {
            } else {
                console.error('Failed to create survey:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while creating survey:', error);
        }
    };

    return (
      <div className={styles.container}>
        <div className={styles.title}>Create Survey</div>
        <div className={styles.centeredOval}>
          <input
            name="surveyTitle"
            placeholder="Survey Title"
            className={styles.inputField}
            value={surveyTitle}
            onChange={(ev) => setSurveyTitle(ev.target.value)}
          />
        </div>
        <button className={styles.button} onClick={createSurvey}>
          Create
        </button>
        <span className={styles.closeIcon}/>
      </div>
    );
}
