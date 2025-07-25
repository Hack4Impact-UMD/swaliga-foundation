// "use client";
// import { useEffect, useState } from "react";
// import styles from "./AdminDashboard.module.css";
// import { Role, User } from "@/types/user-types";
// import { Survey } from "@/types/survey-types";
// import StudentDisplay from "@/components/StudentDisplay";
// import SurveyDisplay from "@/components/SurveyDisplay";
// import RequireAuth from "@/features/auth/RequireAuth";
// import logoutIcon from "@/../public/icons/logout.svg";
// import Image from "next/image";
// import Loading from "@/components/Loading";
// import { getAllUsers } from "@/data/firestore/users";
// import { getAllSurveys } from "@/data/firestore/surveys";
// import { logOut } from "@/features/auth/authN/googleAuthN";
// import { useRouter } from "next/navigation";

// export default function AdminDashboard() {
//   const [showUserList, setShowUserList] = useState<boolean>(true);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [users, setUsers] = useState<User[]>([]);
//   const [surveys, setSurveys] = useState<Survey[]>([]);
//   const [forceUpdate, setForceUpdate] = useState<boolean>(false); // not the best way to rerender page once a survey is deleted, but it works

//   const router = useRouter();

//   useEffect(() => {
//     // get all users & surveys for use in child components
//     // forceUpdate is used to rerender page once a survey is deleted
//     setIsLoading(true);
//     const promises = [];
//     promises.push(getAllUsers());
//     promises.push(getAllSurveys());

//     Promise.all(promises).then((responses) => {
//       setUsers(responses[0] as User[]);
//       setSurveys(responses[1] as Survey[]);
//       setIsLoading(false);
//     });
//   }, [forceUpdate]);

//   const handleDropdownChange = () => setShowUserList(!showUserList);

//   return (
//     <RequireAuth allowedRoles={[Role.ADMIN]}>
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <div className={styles.background}>
//           <div className={styles.container}>
//             <Image
//               src={logoutIcon}
//               alt="Logout Icon"
//               className={styles.logout}
//               onClick={async () => {
//                 await logOut();
//                 router.refresh();
//               }}
//             />
//             <div className={styles.header}>
//               <div className={styles.headerContent}>
//                 <select
//                   className={styles.dropdown}
//                   onChange={handleDropdownChange}
//                 >
//                   <option value="student-info">Student Info</option>
//                   <option value="surveys">Surveys</option>
//                 </select>
//               </div>
//             </div>
//             {showUserList ? (
//               <StudentDisplay users={users} surveys={surveys} />
//             ) : (
//               <SurveyDisplay
//                 surveys={surveys}
//                 handleDeleteSurvey={() => setForceUpdate(!forceUpdate)}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </RequireAuth>
//   );
// }

export default function AdminDashboard() {
  return <div>Admin Dashboard</div>
}