"use client";

import React, { useState } from 'react';
import styles from './create.module.css';

export default function Create() {


    const [documentTitle, setDocumentTitle] = useState("");
    const [surveyTitle, setSurveyTitle] = useState("");

    const createSurvey = async () => {
        try {
            const response = await fetch('/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentTitle,
                    surveyTitle
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

    const openEditForm = () => {
        window.open('https://docs.google.com/forms/', '_blank');
    };
    return (
        <div className={styles.container}>
            <div className={styles.title}>Create Survey</div>
            <div className={`${styles.centeredOval}`}>
                <input
                    name="documentTitle"
                    placeholder="Document Title"
                    className={styles.inputField}
                    value={documentTitle}
                    onChange={(ev) => setDocumentTitle(ev.target.value)}
                />
            </div>
            <div className={`${styles.centeredOval}`}>
                <input
                    name="surveyTitle"
                    placeholder="Survey Title"
                    className={styles.inputField}
                    value={surveyTitle}
                    onChange={(ev) => setSurveyTitle(ev.target.value)}
                />
            </div>
            <button className={styles.button} onClick={createSurvey}>Create Survey</button>
            <button className={styles.button} onClick={openEditForm}>Edit Survey</button>
        </div>
    );
}