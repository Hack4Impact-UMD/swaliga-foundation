"use client";
import Link from "next/link";
import styles from "./SurveyDisplay.module.css";
import { useState } from "react";
import { Survey } from "@/types/survey-types";
import CreateSurveyModal from "../features/surveyManagement/CreateSurveyModal";
import Table, { Column } from "./ui/Table";
import { FilterCondition } from "./Filter";
import "@fortawesome/fontawesome-free/css/all.min.css";
import trashIcon from "@/../public/icons/trashIcon.svg";
import Image from "next/image";
import DeleteSurveyModal from "@/features/surveyManagement/DeleteSurveyModal";

interface SurveyDisplayProps {
  surveys: Survey[];
  handleDeleteSurvey: () => void;
}

export default function SurveyDisplay(props: SurveyDisplayProps): JSX.Element {
  const { surveys, handleDeleteSurvey } = props;
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [deleteSurvey, setDeleteSurvey] = useState<Survey | null>(null);

  // defines the columns for the Survey table
  const surveyColumns: Column<Survey>[] = [
    {
      id: "view",
      name: "View",
      getValue: (survey: Survey) => (
        <Link href={survey.responderUri} target="_blank">
          <div className={styles.viewIcon + " fas fa-eye"} />
        </Link>
      ),
    },
    {
      id: "name",
      name: "Name",
      getValue: (survey: Survey) => <p>{survey.info && survey.info.title}</p>,
    },
    {
      id: "responses",
      name: "Responses",
      getValue: (survey: Survey) =>
        survey.linkedSheetId ? (
          <Link href={survey.linkedSheetId} target="_blank">
            View Responses
          </Link>
        ) : (
          <p>
            Create responses spreadsheet{" "}
            <Link
              href={`https://docs.google.com/forms/d/${survey.formId}/edit`}
              target="_blank"
              className={styles.responseLink}
            >
              here
            </Link>
          </p>
        ),
    },
    {
      id: "delete",
      name: "Delete",
      getValue: (survey: Survey) => (
        <Image
          src={trashIcon}
          alt="Trash Icon"
          className={styles.trashIcon}
          onClick={() => setDeleteSurvey(survey)}
        />
      ),
    },
  ];

  // defines the conditions that will be used to filter the Survey table
  const surveyFilterConditions: FilterCondition<Survey>[] = [
    {
      id: "name",
      name: "Name",
      inputType: "text",
    },
  ];

  // determines if a survey should be included in the table based on the provided filter values
  const includeSurvey = (
    survey: Survey,
    filterValues: { [key: string]: any }
  ): boolean => {
    const { id, name } = filterValues;
    if (id && survey.formId !== id) return false;
    if (name && !survey.info.title.toLowerCase().includes(name.toLowerCase()))
      return false;
    return true;
  };

  return (
    <>
      <Table<Survey>
        columns={surveyColumns}
        items={surveys.map((survey: Survey) => ({
          id: survey.formId,
          data: survey,
        }))}
        filterConditions={surveyFilterConditions}
        filterFunction={includeSurvey}
      />
      <div className={styles.btnContainer}>
        <button
          className={styles.createSurvey}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Survey +
        </button>
      </div>
      {isCreateOpen && (
        <CreateSurveyModal closeCreate={() => setIsCreateOpen(false)} />
      )}
      {deleteSurvey && (
        <DeleteSurveyModal
          survey={deleteSurvey}
          closeDelete={() => setDeleteSurvey(null)}
          handleDeleteSurvey={handleDeleteSurvey}
        />
      )}
    </>
  );
}
