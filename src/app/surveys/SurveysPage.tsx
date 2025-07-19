"use client";

import { useEffect, useState } from "react";
import styles from "./SurveysPage.module.css";
import { SurveyID } from "@/types/survey-types";
import Table, { Column } from "@/components/ui/Table";
import { FaEdit, FaEye } from "react-icons/fa";
import Link from "next/link";
import { FilterCondition } from "@/components/Filter";
import { getAllSurveys } from "@/data/firestore/surveys";
import LoadingPage from "../loading";
import CreateSurveyModal from "@/features/surveyManagement/CreateSurveyModal";
import DeleteSurveyModal from "@/features/surveyManagement/DeleteSurveyModal";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyID[]>([]);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getAllSurveys()
      .then((data) => {
        setSurveys(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const columns: Column<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => survey.name,
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
  ];

  const filterConditions: FilterCondition<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => survey.name,
    },
  ];

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    throw new Error(error);
  }

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
                onSurveysDelete={(surveyIds: string[]) =>
                  setSurveys((prev) =>
                    prev.filter((survey) => !surveyIds.includes(survey.id))
                  )
                }
              />
            )}
            <CreateSurveyModal
              onSurveyCreate={(survey) =>
                setSurveys((prev) => [...prev, survey])
              }
            />
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
