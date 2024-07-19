"use client";

import React, { useState } from 'react';
import styles from './create.module.css';
import Modal from './Modal';

interface CreateProps {
  closeCreate: () => void;
}

export default function Create({ closeCreate }: CreateProps) {
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
            closeCreate();
        } catch (error) {
            console.error('Error occurred while creating survey:', error);
        }
    };

    return (
      <Modal closeModal={closeCreate} width={500} height={200}>
        <>
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
        </>
      </Modal>
    );
}
