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
import { Switch } from "radix-ui";
import {
  activateSurvey,
  deactivateSurvey,
} from "@/features/surveyManagement/surveys";
import useAuth from "@/features/auth/useAuth";
import { getAccessTokenFromAuth } from "@/features/auth/googleAuthZ";
import { MAX_TRIGGERS_PER_USER } from "@/constants/constants";

export default function SurveysPage() {
  const { surveys, setSurveys, isLoading, isError } = useSurveys();
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const numActiveSurveys = surveys.filter((survey) => survey.isActive).length;
  const [isUpdatingActivation, setIsUpdatingActivation] =
    useState<boolean>(false);

  const auth = useAuth();

  const handleToggleActive = async (surveyId: string, activate: boolean) => {
    try {
      setIsUpdatingActivation(true);
      if (activate) {
        await activateSurvey(await getAccessTokenFromAuth(auth), surveyId);
      } else {
        await deactivateSurvey(await getAccessTokenFromAuth(auth), surveyId);
      }
      setSurveys((prev) =>
        prev.map((survey) =>
          survey.id === surveyId ? { ...survey, isActive: activate } : survey
        )
      );
      setIsUpdatingActivation(false);
    } catch (error) {
      setIsUpdatingActivation(false);
    }
  };

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
    {
      name: "Active?",
      getValue: (survey: SurveyID) => (
        <Switch.Root
          className={`${styles.switch} ${isUpdatingActivation ? styles.switchDisabled : ""}`}
          defaultChecked={survey.isActive}
          onCheckedChange={(checked: boolean) =>
            handleToggleActive(survey.id, checked)
          }
          disabled={isUpdatingActivation || (!survey.isActive && numActiveSurveys >= MAX_TRIGGERS_PER_USER)}
        >
          <Switch.Thumb className={styles.switchThumb} />
        </Switch.Root>
      ),
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
    <div className={styles.page}>
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
    </div>
  );
}
