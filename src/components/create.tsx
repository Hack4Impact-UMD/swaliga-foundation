"use client";

import React, { useState } from 'react';
import styles from './create.module.css';

export default function Create() {


    const [documentTitle, setDocumentTitle] = useState("");
    const [surveyTitle, setSurveyTitle] = useState("");

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
            <button className={styles.button}> Edit Survey </button> 
        </div>
    );
}