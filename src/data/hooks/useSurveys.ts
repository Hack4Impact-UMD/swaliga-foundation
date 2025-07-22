import { useContext } from "react";
import { SurveysContext } from "./SurveysProvider";

export default function useSurveys() {
  const { surveys } = useContext(SurveysContext);
  return surveys;
}