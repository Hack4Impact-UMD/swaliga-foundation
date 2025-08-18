import RequireAuth from "@/features/auth/RequireAuth";
import SurveyPage from "./SurveyPage";

export default function SurveyPageWrapper({
  params,
}: {
  params: { surveyId: string };
}) {
  const { surveyId } = params;
  return <RequireAuth allowedRoles={["ADMIN", "STAFF"]}><SurveyPage surveyId={surveyId} /></RequireAuth>;
}
