"use client";

import { useEffect, useState } from "react";
import styles from "./SurveysPage.module.css";
import { SurveyID } from "@/types/survey-types";
import Table, { Column } from "@/components/ui/table/Table";
import { FaEdit, FaEye, FaFileExcel } from "react-icons/fa";
import Link from "next/link";
import { FilterCondition } from "@/components/ui/table/Filter";
import CreateSurveyModal from "@/features/surveyManagement/components/CreateSurveyModal";
import DeleteSurveyModal from "@/features/surveyManagement/components/DeleteSurveyModal";
import useSurveys from "@/data/hooks/useSurveys/useSurveys";
import { MAX_TRIGGERS_PER_USER } from "@/constants/constants";
import SurveyActivationSwitch from "@/features/surveyManagement/components/SurveyActivationSwitch";
import BlankBackgroundPage from "@/components/layout/pages/BlankBackgroundPage";

export default function SurveysPage() {
  const { surveys, isLoading, isError } = useSurveys();
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const numActiveSurveys = surveys.filter((survey) => survey.isActive).length;

  useEffect(() => {
    setSelectedSurveyIds((prev) =>
      prev.filter((id) => surveys.some((survey) => survey.id === id))
    );
  }, [surveys]);

  const columns: Column<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => (
        <Link href={`/surveys/${survey.id}`}>
          <p className={styles.linkText}>{survey.name}</p>
        </Link>
      ),
      sortFunc: (a, b) => a.name.localeCompare(b.name),
    },
    {
      name: "Description",
      getValue: (survey: SurveyID) => survey.description,
      sortFunc: (a, b) => a.description.localeCompare(b.description),
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
    {
      name: "Active?",
      getValue: (survey: SurveyID) => (
        <SurveyActivationSwitch survey={survey} />
      ),
      sortFunc: (a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1),
    },
  ];

  const filterConditions: FilterCondition<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => survey.name,
    },
    {
      name: "Active?",
      getValue: (survey: SurveyID) => (survey.isActive ? "Yes" : "No"),
    },
  ];

  return (
    <BlankBackgroundPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Surveys</h1>
          <div className={styles.optionMenu}>
            <span className={styles.span}>
              {numActiveSurveys}/{MAX_TRIGGERS_PER_USER} active
            </span>
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
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </BlankBackgroundPage>
  );
}
