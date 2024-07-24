"use client";
import Link from "next/link";
import styles from "./SurveyTable.module.css";
import { useState } from "react";
import { Survey } from "@/types/survey-types";
import Create from "./create";
import Table, { Column } from "./Table";
import { FilterCondition } from "./Filter";
import "@fortawesome/fontawesome-free/css/all.min.css";
import trashIcon from "@/../public/icons/trashIcon.svg";
import Image from "next/image";
import DeleteSurveyModal from "@/app/admin-dashboard/DeleteSurveyModal";

interface SurveyTableProps {
  surveys: Survey[];
}

export default function SurveyTable(props: SurveyTableProps): JSX.Element {
  const { surveys } = props;
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [deleteSurvey, setDeleteSurvey] = useState<Survey | null>(null);

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
      getValue: (survey: Survey) => <Image src={trashIcon} alt="Trash Icon" className={styles.trashIcon} onClick={() => setDeleteSurvey(survey)}/>,
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
    }
  ];

  const includeSurvey = (survey: Survey, filterValues: { [key: string]: any }): boolean => {
    const { id, title } = filterValues;
    if (id && survey.formId !== id) return false;
    if (title && !survey.info.title.toLowerCase().includes(title.toLowerCase())) return false;
    return true;
  };

  return (
    <>
      <Table<Survey>
        columns={surveyColumns}
        items={surveys.map((survey: Survey) => ({ id: survey.formId, data: survey}))}
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
      {isCreateOpen && <Create closeCreate={() => setIsCreateOpen(false)} />}
      {deleteSurvey && <DeleteSurveyModal survey={deleteSurvey} closeDelete={() => setDeleteSurvey(null)}/>}
    </>
  );
}
