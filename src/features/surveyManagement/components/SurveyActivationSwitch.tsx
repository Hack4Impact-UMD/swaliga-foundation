import { useState } from "react";
import styles from "./SurveyActivationSwitch.module.css";
import { SurveyID } from "@/types/survey-types";
import Spinner from "@/components/ui/Spinner";
import { Switch } from "radix-ui";
import { MdError } from "react-icons/md";
import { MAX_TRIGGERS_PER_USER } from "@/constants/constants";
import useSurveys from "@/data/hooks/useSurveys/useSurveys";
import useAuth from "../../auth/authN/components/useAuth";
import { activateSurvey, deactivateSurvey } from "../surveys";

interface SurveyActivationSwitchProps {
  survey: SurveyID;
}

export default function SurveyActivationSwitch(
  props: SurveyActivationSwitchProps
) {
  const { survey } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { surveys, setSurveys } = useSurveys();

  const maxSurveysReached =
    surveys.filter((survey) => survey.isActive).length >= MAX_TRIGGERS_PER_USER;

  const auth = useAuth();

  const handleActivationToggle = async (checked: boolean) => {
    setIsLoading(true);
    setIsError(false);
    (checked ? activateSurvey : deactivateSurvey)(survey.id)
      .then(() =>
        setSurveys((prev) =>
          prev.map((s) =>
            s.id === survey.id ? { ...s, isActive: checked } : s
          )
        )
      )
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div className={styles.activeContainer}>
      <Switch.Root
        className={`${styles.switch} ${
          isLoading || (maxSurveysReached && !survey.isActive)
            ? styles.switchDisabled
            : ""
        }`}
        checked={survey.isActive}
        onCheckedChange={(checked: boolean) => handleActivationToggle(checked)}
        disabled={isLoading || (maxSurveysReached && !survey.isActive)}
      >
        <Switch.Thumb className={styles.switchThumb} />
      </Switch.Root>
      {isError && (
        <MdError
          className={styles.errorIcon}
          size={25}
          title="An unexpected error occurred. Make sure that you have less than 20 active surveys before you attempt to active another one."
        />
      )}
    </div>
  );
}
