"use client";

import React, { useState } from "react";
import styles from "./CreateSurveyModal.module.css";
import Modal from "../../components/ui/Modal";
import { SurveyID } from "@/types/survey-types";
import { createNewSurvey, addExistingSurvey } from "./surveys";
import useAuth from "../auth/useAuth";
import { getAccessTokenFromAuth } from "../auth/googleAuthZ";
import { FaCirclePlus } from "react-icons/fa6";

interface CreateSurveyModalProps {
  onSurveyCreate: (survey: SurveyID) => void;
}

enum CreateSurveyModalErrorMessages {
  SURVEY_NAME_REQUIRED = "Survey name is required.",
  SURVEY_ID_REQUIRED = "Survey ID is required.",
  CREATE_SURVEY_FAILED = "Failed to create survey. Please try again later.",
  ADD_SURVEY_FAILED = "Failed to add existing survey. Please try again later.",
}

export default function CreateSurveyModal(
  props: CreateSurveyModalProps
): JSX.Element {
  const { onSurveyCreate } = props;

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [addError, setAddError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const auth = useAuth();

  const clearErrors = () => {
    setCreateError("");
    setAddError("");
  };

  const handleCreateNewSurvey = async () => {
    try {
      clearErrors();
      if (!name) {
        throw new Error(CreateSurveyModalErrorMessages.SURVEY_NAME_REQUIRED);
      }
      setMessage("This may take a minute...");
      const survey = await createNewSurvey(
        await getAccessTokenFromAuth(auth),
        name,
        description
      );
      onSurveyCreate(survey);
      setMessage(`Survey "${survey.name}" created successfully!`);
    } catch (error: any) {
      setMessage("");
      setCreateError(
        error.message === CreateSurveyModalErrorMessages.SURVEY_NAME_REQUIRED
          ? CreateSurveyModalErrorMessages.SURVEY_NAME_REQUIRED
          : CreateSurveyModalErrorMessages.CREATE_SURVEY_FAILED
      );
    }
  };

  const handleAddExistingSurvey = async () => {
    try {
      clearErrors();
      if (!id) {
        throw new Error(CreateSurveyModalErrorMessages.SURVEY_ID_REQUIRED);
      }
      setMessage("This may take a minute...");
      const survey = await addExistingSurvey(id);
      onSurveyCreate(survey);
      setMessage(`Survey "${survey.name}" added successfully!`);
    } catch (error: any) {
      setMessage("");
      setAddError(
        error.message === CreateSurveyModalErrorMessages.SURVEY_ID_REQUIRED
          ? CreateSurveyModalErrorMessages.SURVEY_ID_REQUIRED
          : CreateSurveyModalErrorMessages.CREATE_SURVEY_FAILED
      );
    }
  };

  const onClose = () => {
    setName("");
    setDescription("");
    setId("");
    setMessage("");
    clearErrors();
  };

  return (
    <Modal onClose={onClose}>
      <FaCirclePlus className={styles.icon} size={40} />
      {message ? (
        <p>{message}</p>
      ) : (
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Create a New Survey</h2>
          <div className={styles.centeredOval}>
            <input
              name="surveyName"
              placeholder="Survey Name"
              className={styles.inputField}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>
          <div className={styles.centeredOval}>
            <input
              name="surveyDescription"
              placeholder="Survey Description"
              className={styles.inputField}
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>
          <div className={styles.errorGroup}>
            <button className={styles.button} onClick={handleCreateNewSurvey}>
              Create Survey
            </button>
            <p className={styles.error}>{createError}</p>
          </div>
          <div className={styles.divider}>
            <hr className={styles.divider_line} />
            <p className={styles.divider_text}>OR</p>
            <hr className={styles.divider_line} />
          </div>
          <h2 className={styles.title}>Add an Existing Survey</h2>
          <p>
            The id of a survey can be found in the URL of the survey's edit
            link:
          </p>
          <p>
            https://docs.google.com/forms/d/<strong>SURVEY_ID</strong>/edit
          </p>
          <div className={styles.centeredOval}>
            <input
              name="surveyId"
              placeholder="Survey ID"
              className={styles.inputField}
              value={id}
              onChange={(ev) => setId(ev.target.value)}
            />
          </div>
          <div className={styles.errorGroup}>
            <button className={styles.button} onClick={handleAddExistingSurvey}>
              Add Survey
            </button>
            <p className={styles.error}>{addError}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
