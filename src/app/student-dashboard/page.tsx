'use client';

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import Vector from "@/app/student-dashboard/Vector.png"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react";
import { User } from "@/types/user-types";
import { Survey } from '@/types/survey-types';
import { db } from '@/lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, 
        query, 
        where, 
        doc, 
        getDoc, 
        getDocs, 
        documentId } from 'firebase/firestore';


const fetchSurveyData = async (surveyIds: string[]) => {
    const surveyCollection = collection(db, 'surveys');
    const surveyQuery = query(surveyCollection, where(documentId(), 'in', surveyIds));
    const surveyDocs = await getDocs(surveyQuery);

    const fetchedSurveys = surveyDocs.docs.map((doc) => {
        return doc.data() as Survey;
    });

    return fetchedSurveys;
}

const fetchResponseData = async (responseIds: string[]) => {
    const responseCollection = collection(db, 'responses');
    const responseQuery = query(responseCollection, where(documentId(), 'in', responseIds));
    const responseDocs = await getDocs(responseQuery);

    const fetchedRespondedSurvey = responseDocs.docs.map((doc) => {
        return doc.data().formId;
    });

    const fetchedSurveys = fetchSurveyData(fetchedRespondedSurvey);
    const surveyTitles = (await fetchedSurveys).map((survey) => {
        return survey.info.title;
    });

    return surveyTitles;
}

export default function StudentDashboard() {
    const [user, setCurrentUser] = useState<User | null>(null);
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [openSurvey, setOpenSurvey] = useState('');

    const fetchCurrentUserData = async (uid: string) => {
        const userCollection = collection(db, 'users');
        const userRef = doc(userCollection, uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const surveyIds = userDoc.data().assignedSurveys;
            const responseIds = userDoc.data().completedResponses;
            
            setCurrentUser(userDoc.data() as User);
            setSurveys(await fetchSurveyData(surveyIds));
            setResponses(await fetchResponseData(responseIds));
        } else {
            console.log('No user exists');
        }
    }

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
            fetchCurrentUserData(user.uid);
        } else {
            console.log('no signed-in user');
        }
    }, []);

    const handleSurveyButtonClick = (surveyId: string) => {
        setOpenSurvey(surveyId === openSurvey ? '' : surveyId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Image 
                    src={CompanyLogo} 
                    alt="Company Logo" 
                    className={styles.img}
                />
                <p className={styles.info}>
                    Student ID: {user?.id || 'No user ID found'}
                </p>
                <button className={styles.settingButton}>
                    Settings
                </button>
                <Link href="/" className={styles.logOut}>
                    Log Out
                </Link>
            </div>
            <div className={styles.mainContent}>
                <p className={styles.surveyTitle}>
                    Available Surveys
                </p>
                <hr className={styles.horizontalLine}/>
                {surveys.map((survey) => (
                    <div key={survey.formId}>
                        <button
                            onClick={() => handleSurveyButtonClick(survey.formId)}
                            className={styles.assignedSurveyButton}
                        >
                            {survey.info.title}
                            <Image 
                                src={Vector} 
                                alt="vector" 
                                className={styles.vector}
                            />
                        </button>
                        { openSurvey === survey.formId && (
                            <iframe 
                                key={survey.formId}
                                src={survey.responderUri}
                                title={survey.info.title}
                                allowFullScreen={true}
                                className={styles.form}
                            />
                        )}
                    </div>
                ))}
                <p className={styles.surveyTitle}>
                    Completed Surveys
                </p>
                <hr className={styles.horizontalLine}/>
                {responses.map((response) => (
                    <span key={response} className={styles.completedSurveyButton}>
                        {response}
                    </span>
                ))}
            </div>
        </div>
    );
}