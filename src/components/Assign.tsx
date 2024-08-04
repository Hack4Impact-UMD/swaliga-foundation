"use client";

import React, { useState, useEffect } from 'react';
import { Survey } from '@/types/survey-types';
import styles from './assign.module.css';
import Modal from './Modal';
import Table, { Column } from './Table';
import { FilterCondition } from './Filter';

interface AssignProps {
    studentIds: string[];
    surveys: Survey[];
    closeAssign: () => void;
}

export default function Assign({ studentIds, surveys, closeAssign }: AssignProps) {
    const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
    const [error, setError] = useState<string>("");

    // Function to handle assigning surveys
    const assignSurveys = async () => {
        if (selectedSurveyIds.length === 0) {
            return;
        }

        try {
            console.log(studentIds);
            console.log(selectedSurveyIds)
            const response = await fetch("/api/surveys/assign", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userIds: studentIds,
                surveyIds: selectedSurveyIds,
              }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                setError("Error assigning surveys");
            }
            closeAssign();
        } catch (error) {
            console.error('Error occurred while assigning surveys:', error);
        }
    };

    const surveyColumns: Column<Survey>[] = [
      {
        id: "name",
        name: "Name",
        getValue: (survey: Survey) => <p>{survey.info && survey.info.title}</p>,
      },
    ];

    const surveyFilterConditions: FilterCondition<Survey>[] = [
      {
        id: "id",
        name: "ID",
        inputType: "text",
      },
      {
        id: "title",
        name: "Title",
        inputType: "text",
      },
    ];

    const includeSurvey = (
      survey: Survey,
      filterValues: { [key: string]: any }
    ): boolean => {
      const { id, title } = filterValues;
      if (id && survey.formId !== id) return false;
      if (title && !survey.info.title.toLowerCase().includes(title.toLowerCase()))
        return false;
      return true;
    };

    return (
      <Modal closeModal={closeAssign} width={1000} height={800}>
        <>
          <div className={styles.title}>Assign Surveys</div>
          <div className={styles.surveys}>
            <Table<Survey>
              columns={surveyColumns}
              items={surveys.map((survey: Survey) => ({
                id: survey.formId,
                data: survey,
              }))}
              selectedItemIds={selectedSurveyIds}
              filterConditions={surveyFilterConditions}
              filterFunction={includeSurvey}
              setSelectedItemIds={setSelectedSurveyIds}
            />
          </div>
          <div>
            <p className={styles.error}>{error}</p>
            <button className={styles.button} onClick={assignSurveys}>
              Assign
            </button>
          </div>
        </>
      </Modal>
    );
}