"use client";

import { useState } from "react";
import styles from "./SurveysPage.module.css";
import { SurveyID } from "@/types/survey-types";
import Table, { Column } from "@/components/ui/Table";
import { FaEdit, FaEye, FaFileExcel } from "react-icons/fa";
import Link from "next/link";
import { FilterCondition } from "@/components/Filter";
import CreateSurveyModal from "@/features/surveyManagement/CreateSurveyModal";
import DeleteSurveyModal from "@/features/surveyManagement/DeleteSurveyModal";
import useSurveys from "@/data/hooks/useSurveys";

export default function SurveysPage() {
  const surveys = useSurveys();
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);

  const columns: Column<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => (
        <Link href={`/surveys/${survey.id}`}>
          <p className={styles.linkText}>{survey.name}</p>
        </Link>
      ),
    },
    {
      name: "Edit Survey",
      getValue: (survey: SurveyID) => (
        <Link
          href={`https://docs.google.com/forms/d/${survey.id}/edit`}
          target="_blank"
        >
          <FaEdit className={styles.linkIcon} size={20} />
        </Link>
      ),
    },
    {
      name: "View Survey",
      getValue: (survey: SurveyID) => (
        <Link href={survey.responderUri} target="_blank">
          <FaEye className={styles.linkIcon} size={20} />
        </Link>
      ),
    },
    {
      name: "Responses Spreadsheet",
      getValue: (survey: SurveyID) => (
        <Link
          href={`https://docs.google.com/spreadsheets/d/${survey.linkedSheetId}/edit`}
          target="_blank"
        >
          <FaFileExcel className={styles.linkIcon} size={20} />
        </Link>
      ),
    },
  ];

  const filterConditions: FilterCondition<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => survey.name,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Surveys</h1>
          <div className={styles.optionMenu}>
            {selectedSurveyIds.length > 0 && (
              <DeleteSurveyModal
                surveys={surveys
                  .filter((survey) => selectedSurveyIds.includes(survey.id))
                  .map((survey) => ({
                    id: survey.id,
                    name: survey.name,
                  }))}
              />
            )}
            <CreateSurveyModal />
          </div>
        </div>
        <Table
          items={surveys}
          columns={columns}
          selectOptions={{
            selectedItemIds: selectedSurveyIds,
            setSelectedItemIds: setSelectedSurveyIds,
          }}
          paginationOptions={{
            itemsPerPageOptions: [5, 10, 25, 50, 100],
            includeAllOption: true,
          }}
          filterConditions={filterConditions}
        />
      </div>
    </div>
  );
}
