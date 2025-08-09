import StudentPage from "./StudentPage";

export default function StudentPageWrapper({ params }: { params: { studentId: string } }) {
  return <StudentPage studentId={params.studentId} />;
}