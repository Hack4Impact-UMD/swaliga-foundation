"use client";
import Link from "next/link";
import styles from "./surveyInfo.module.css"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Survey } from "@/types/survey-types";

export default function SurveyInfoPage(): JSX.Element {
    const [surveyList, setSurveyList] = useState<Survey[]>([]);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const surveyRef = collection(db, 'surveys');
                const querySnapshot = await getDocs(surveyRef);
                const surveysData = querySnapshot.docs.map((doc) => doc.data() as Survey);
                setSurveyList(surveysData);
            } catch (error) {
                console.error("Could not fetch surveys: ", error);
            }
        };

        fetchSurveys();
    }, []);

    function handleCreateSurvey() {
        /* Implement */
    }

    return (
        <div className={styles.mainContainer}>
        <div className={styles.container}>
        
            {surveyList.map((singleSurvey, i) => (
                <div key={i} className={styles.box}>
                    <Link href="/" className={styles.view}>View</Link>
                    <p className={styles.survey}>{singleSurvey.info && singleSurvey.info.title}</p>
                    <button className={styles.export}>Export</button>
                </div>
            ))}
      
            <div className={styles.btnContainer}>
                <button className={styles.createSurvey} onClick={handleCreateSurvey}>Create Survey +</button>
            </div>
            </div>
        </div>
    );
}