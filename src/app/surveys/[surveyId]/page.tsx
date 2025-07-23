import SurveyPage from "./SurveyPage";

export default function SurveyPageWrapper({
  params,
}: {
  params: { surveyId: string };
}) {
  const { surveyId } = params;
  return <SurveyPage surveyId={surveyId} />;
}
