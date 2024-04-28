'use client';

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import Vector from "@/app/student-dashboard/Vector.png"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react"
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
    const [openDisclosure, setOpenDisclosure] = useState('');

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
                    <Disclosure key={survey.formId} as="div">
                        <Disclosure.Button className={styles.assignedSurveyButton}>
                            <span>{survey.info.title}</span>
                            <Image 
                                src={Vector} 
                                alt="vector" 
                                className={styles.vector}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className={styles.assignedSurveyPanel}>
                            <iframe 
                                src={survey.responderUri}
                                title="googleForm"
                                allowFullScreen={true}
                                className={styles.form}
                            />
                        </Disclosure.Panel>
                    </Disclosure>
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