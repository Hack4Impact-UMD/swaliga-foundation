// "use client";

// import React, { useState, useEffect } from "react";
// import { Survey } from "@/types/survey-types";
// import styles from "./AssignSurveysModal.module.css";
// import Modal from "../../components/ui/Modal";
// import Table, { Column } from "../../components/ui/Table";
// import { FilterCondition } from "../../components/Filter";
// import { assignSurveys } from "@/data/firestore/users";

// interface AssignProps {
//   studentIds: string[];
//   surveys: Survey[];
//   closeAssign: () => void;
// }

// export default function AssignSurveysModal({
//   studentIds,
//   surveys,
//   closeAssign,
// }: AssignProps) {
//   const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
//   const [error, setError] = useState<string>("");

//   // Function to handle assigning surveys
//   const handleAssignSurveys = async () => {
//     if (selectedSurveyIds.length === 0) {
//       return;
//     }

//     try {
//       await assignSurveys(studentIds, selectedSurveyIds);
//       closeAssign();
//     } catch (error) {
//       console.error("unable to assign surveys");
//       setError("unable to assign surveys");
//     }
//   };

//   const surveyColumns: Column<Survey>[] = [
//     {
//       id: "name",
//       name: "Name",
//       getValue: (survey: Survey) => <p>{survey.info && survey.info.title}</p>,
//     },
//   ];

//   const surveyFilterConditions: FilterCondition<Survey>[] = [
//     {
//       id: "id",
//       name: "ID",
//       inputType: "text",
//     },
//     {
//       id: "title",
//       name: "Title",
//       inputType: "text",
//     },
//   ];

//   const includeSurvey = (
//     survey: Survey,
//     filterValues: { [key: string]: any }
//   ): boolean => {
//     const { id, title } = filterValues;
//     if (id && survey.formId !== id) return false;
//     if (title && !survey.info.title.toLowerCase().includes(title.toLowerCase()))
//       return false;
//     return true;
//   };

//   return (
//     <Modal closeModal={closeAssign} width={1000} height={800}>
//       <>
//         <div className={styles.title}>Assign Surveys</div>
//         <div className={styles.surveys}>
//           <Table<Survey>
//             columns={surveyColumns}
//             items={surveys.map((survey: Survey) => ({
//               id: survey.formId,
//               data: survey,
//             }))}
//             selectedItemIds={selectedSurveyIds}
//             filterConditions={surveyFilterConditions}
//             filterFunction={includeSurvey}
//             setSelectedItemIds={setSelectedSurveyIds}
//           />
//         </div>
//         <div>
//           <p className={styles.error}>{error}</p>
//           <button className={styles.button} onClick={handleAssignSurveys}>
//             Assign
//           </button>
//         </div>
//       </>
//     </Modal>
//   );
// }

export default function AssignSurveysModal() {
  return <div>Assign Surveys Modal</div>
}