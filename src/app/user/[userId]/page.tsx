import { User } from "@/types/user-types";
import StudentInfoPage from "./StudentInfoPage";
import { getAllUsers } from "@/lib/firebase/database/users";

export async function generateStaticParams() {
    const users = await getAllUsers();
    return users.map((user: User) => ({ userId: user.id || 'bruh' }));
}

export default function StudentInfoPageWrapper({ params }: { params: { userId: string }}) {
    return <StudentInfoPage params={params} />
}