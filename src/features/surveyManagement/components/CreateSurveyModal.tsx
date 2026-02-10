"use client";

import React, { useState } from "react";
import styles from "./CreateSurveyModal.module.css";
import Modal from "../../../components/ui/Modal";
import { createNewSurvey, addExistingSurvey } from "../surveys";
import { FaCirclePlus } from "react-icons/fa6";
import MenuIcon from "@/components/ui/MenuIcon";
import { DrivePicker } from "@googleworkspace/drive-picker-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebaseConfig";
import useDrivePicker from "react-google-drive-picker";

enum CreateSurveyModalErrorMessages {
  SURVEY_NAME_REQUIRED = "Survey name is required.",
  SURVEY_ID_REQUIRED = "Survey ID is required.",
  CREATE_SURVEY_FAILED = "Failed to create survey. Please try again later.",
  ADD_SURVEY_FAILED = "Failed to add existing survey. Please try again later.",
}

export default function CreateSurveyModal(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [addError, setAddError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openPicker] = useDrivePicker();
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState<boolean>(false);
  const [drivePickerCredentials, setDrivePickerCredentials] = useState<{
    accessToken: string;
    scope: string;
    expiryDate: number;
  } | null>(null);

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
      const survey = await createNewSurvey(name, description);
      setMessage(`Survey "${survey.name}" created successfully!`);
    } catch (error: any) {
      setMessage("");
      setCreateError(
        error.message === CreateSurveyModalErrorMessages.SURVEY_NAME_REQUIRED
          ? CreateSurveyModalErrorMessages.SURVEY_NAME_REQUIRED
          : CreateSurveyModalErrorMessages.CREATE_SURVEY_FAILED,
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

  const openDrivePicker = async () => {
    const credentials = (await httpsCallable(
      functions,
      "getAdminAccessToken",
    )()) as unknown as {
      data: { accessToken: string; scope: string; expiryDate: number };
    };
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      developerKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      callbackFunction: async (data) => {
        if (data.action === "cancel") {
          return;
        } else if (data.action === "loaded") {
          return;
        }
        await Promise.allSettled(data.docs.map(doc => addExistingSurvey(doc.id)));
      },
      token: credentials.data.accessToken,
      viewId: "FORMS",
      customScopes: credentials.data.scope.split(" "),
      multiselect: true
    });
  };

  return (
    <Modal onClose={onClose}>
      <MenuIcon icon={FaCirclePlus} title="Create Survey" />
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
          {isDrivePickerOpen && drivePickerCredentials && (
            <DrivePicker
              client-id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              scope={drivePickerCredentials.scope}
              oauth-token={drivePickerCredentials.accessToken}
              onCanceled={() => setDrivePickerCredentials(null)}
              onPicked={() => setDrivePickerCredentials(null)}
            ></DrivePicker>
          )}
          <div className={styles.errorGroup}>
            <button className={styles.button} onClick={openDrivePicker}>
              Add an Existing Survey
            </button>
            <p className={styles.error}>{addError}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
