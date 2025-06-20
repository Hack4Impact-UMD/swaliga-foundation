"use client";

import { useEffect, useState } from "react";
import styles from "./SurveysPage.module.css";
import { SurveyID } from "@/types/survey-types";
import Table, { Column } from "@/components/ui/Table";
import { FaEdit, FaEye } from "react-icons/fa";
import Link from "next/link";
import { FilterCondition } from "@/components/Filter";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyID[]>([
    {
      id: "1",
      name: "Test Survey",
      responderUri: "https://docs.google.com/forms/d/1/edit",
    },
  ]);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);

  useEffect(() => {}, []);

  const columns: Column<SurveyID>[] = [
    {
      name: "Name",
      getValue: (survey: SurveyID) => survey.name,
    },
    {
      name: "Edit Survey",
      getValue: (survey: SurveyID) => (
        <Link href={`https://docs.google.com/forms/d/${survey.id}/edit`}>
          <FaEdit className={styles.linkIcon} size={20} />
        </Link>
      ),
    },
    {
      name: "View Survey",
      getValue: (survey: SurveyID) => (
        <Link href={survey.responderUri}>
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
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
