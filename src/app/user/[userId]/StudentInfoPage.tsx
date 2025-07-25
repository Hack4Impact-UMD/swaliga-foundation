// "use client";
// import userPfp from "@/../public/icons/pfpIcon.svg";
// import gradYrIcon from "@/../public/icons/gradYrIcon.svg";
// import gradeIcon from "@/../public/icons/gradeIcon.svg";
// import genderIcon from "@/../public/icons/genderIcon.svg";
// import ethnicityIcon from "@/../public/icons/ethnicityIcon.svg";
// import mobileIcon from "@/../public/icons/mobileIcon.svg";
// import emailIcon from "@/../public/icons/emailIcon.svg";
// import addressIcon from "@/../public/icons/addressIcon.svg";

// import styles from "./StudentInfoPage.module.css";
// import { Role, User } from "@/types/user-types";
// import { Survey, Response } from "@/types/survey-types";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Loading from "@/components/Loading";
// import { getAccountById } from "@/data/firestore/users";
// import { getSurveyByID } from "@/data/firestore/surveys";
// import { getResponseByID } from "@/data/firestore/assignments";
// import RequireAuth from "@/features/auth/RequireAuth";

// // converts birthdate to grade, so grade does not need to be updated in database
// function getGrade(gradYr: number | undefined) {
//   if (gradYr) {
//     const currDate = new Date();
//     const differenceInYears: number = Math.floor(
//       Math.abs(gradYr - currDate.getFullYear())
//     );
//     return differenceInYears >= 12
//       ? "Kindergarten or below"
//       : String(12 - differenceInYears);
//   }
// }

// function guardianInfo(guardianInfo: any[] | undefined) {
//   if (guardianInfo) {
//     return (
//       <div>
//         <p>Guardian Information:</p>
//         <ol>
//           {guardianInfo.map((guardian, index) => (
//             <li key={index}>
//               {guardian.name}
//               <ul>
//                 <li>Email: {guardian.email}</li>
//                 <li>Phone: {guardian.phone}</li>
//               </ul>
//             </li>
//           ))}
//         </ol>
//       </div>
//     );
//   }
// }

// export default function StudentInfoPage({
//   params,
// }: {
//   params: { userId: string };
// }) {
//   const [user, setUser] = useState<User | null>();
//   const [surveys, setSurveys] = useState<Survey[]>([]);
//   const [responses, setResponses] = useState<Response[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchData = async (userId: string) => {
//     setLoading(true);
//     try {
//       // get user info
//       const user = await getAccountById(userId);
//       setUser(user);

//       // get response info
//       Promise.all(
//         user.completedResponses.map((responseId) => getResponseByID(responseId))
//       ).then((responses) => {
//         setResponses(responses.filter((response) => response) as Response[]);
//       });
//       Promise.all(
//         user.assignedSurveys.map((surveyId) => getSurveyByID(surveyId))
//       ).then((surveys) => {
//         setSurveys(surveys.filter((survey) => survey) as Survey[]);
//       });
//     } catch (err) {
//       console.error("Error retrieving student information");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (!user) {
//       fetchData(params.userId);
//     }
//   }, [params.userId, user]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <RequireAuth allowedRoles={[Role.ADMIN]}>
//       <div className={styles.page}>
//         <div className={styles.leftSide}>
//           <div className={styles.polygon}> </div>
//         </div>
//         <div className={styles.rightSide}>
//           <div className={styles.profile}>
//             <Image src={userPfp} alt="Profile Icon" className={styles.icon} />
//             <p className={styles.header}>{`${user?.firstName ?? "first name"} ${
//               user?.lastName ?? "last name"
//             }`}</p>
//             <p
//               className={styles.studentId}
//             >{`Student ID: ${user?.swaligaID}`}</p>
//           </div>
//           <div>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={gradYrIcon} alt="Grad Year Icon" />
//                     <p className={styles.regular}>Grad. Yr.</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{user?.gradYear ?? "graduation year"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={gradeIcon} alt="Grade Icon" />
//                     <p className={styles.regular}>Grade</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{getGrade(user?.gradYear) ?? "grade"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={genderIcon} alt="Gender Icon" />
//                     <p className={styles.regular}>Gender</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{user?.gender ?? "gender"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={ethnicityIcon} alt="Ethnicity Icon" />
//                     <p className={styles.regular}>Ethnicity</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{user?.ethnicity.join(", ") ?? "ethnicity"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={mobileIcon} alt="Mobile Icon" />
//                     <p className={styles.regular}>Mobile</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{user?.phone ?? "phone"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={emailIcon} alt="Email Icon" />
//                     <p className={styles.regular}>Email</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{user?.email ?? "email"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className={styles.leftSideTable}>
//                     <Image src={addressIcon} alt="Address Icon" />
//                     <p className={styles.regular}>Address</p>
//                   </td>
//                   <td className={`${styles.rightSideTable} ${styles.regular}`}>
//                     <p>{`${user?.address.street ?? "street"}, ${
//                       user?.address.city ?? "city"
//                     }, ${user?.address.state ?? "state"} ${
//                       user?.address.zip ?? "zip code"
//                     }`}</p>
//                   </td>
//                 </tr>
//               </thead>
//             </table>
//             <div className={styles.guardian}>
//               <p id="info">{guardianInfo(user?.guardian)}</p>
//             </div>
//           </div>
//           <div className={styles.surveysStatus}>
//             <p className={styles.surveyTitle}>Surveys</p>
//             <div
//               className={`${styles.surveysList} ${styles.regular}`}
//               id="list"
//             >
//               {responses.length !== 0 &&
//                 responses?.map((response: Response, i: number) => (
//                   <a
//                     href={`https://docs.google.com/forms/d/${response.formId}/edit#response=${response.responseId}`}
//                     className={styles.complete}
//                     key={i}
//                   >
//                     {response.formTitle}
//                   </a>
//                 ))}
//               {surveys.length !== 0 &&
//                 surveys?.map((survey: Survey, i: number) => (
//                   <a
//                     href={`https://docs.google.com/forms/d/${survey.formId}/edit`}
//                     className={styles.incomplete}
//                     key={i}
//                   >
//                     {survey.info.title}
//                   </a>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </RequireAuth>
//   );
// }

export default function StudentInfoPage() {
  return <div>Student Info Page</div>
}