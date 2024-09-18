import StudentInfoPage from "./StudentInfoPage";

export default function StudentInfoPageWrapper({ params }: { params: { userId: string }}) {
    return <StudentInfoPage params={params} />
}