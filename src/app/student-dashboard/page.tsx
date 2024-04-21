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
import { db, auth } from '@/lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, 
        query, 
        where, 
        doc, 
        getDoc, 
        getDocs, 
        documentId } from 'firebase/firestore';


export default function StudentDashboard() {
    // const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [surveys, setAssignedSurveys] = useState([]);

    const fetchCurrentUserData = async (uid: string) => {
        // const userRef = doc(db, 'users', uid);
        const userRef = doc(db, 'minji-test-users', uid);
        const userDoc = await getDoc(userRef);

        console.log(userDoc.exists())

        if (userDoc.exists()) {
            // setCurrentUser(userDoc.data() as User);
            console.log(userDoc.data());
            // setCurrentUser(userDoc.data());
        } else {
            console.log('No user exists');
        }
    }

    const fetchSurveyData = async (surveyIds: string[]) => {
        // const surveysRef = collection(db, 'surveys');
        const surveysRef = collection(db, 'minji-test-surveys');
        const surveysQuery = query(surveysRef, where(documentId(), 'in', surveyIds));
        const surveyDocs = await getDocs(surveysQuery);

        const fetchedSurveys = surveyDocs.docs.map((doc) => {
            console.log(doc.data)
        });
    }

    useEffect(() => { 
        const auth = getAuth();
        const user = auth.currentUser;
        const testUser = "user01";

        if (user) {
            // fetchCurrentUserData(user.uid);
            fetchCurrentUserData(testUser);
        }
        // } else { // for test
        //     setCurrentUser(testUser);
        // }
    }, [currentUser]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Image 
                    src={CompanyLogo} 
                    alt="Company Logo" 
                    className={styles.img}
                />
                <Link href="/" className={styles.info}>
                    Home
                </Link>
                <p className={styles.info}>
                    Student ID: {currentUser?.id || 'No user ID found'}
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
                {currentUser?.assignedSurveys.map((survey) => (
                    <Disclosure key={survey} as="div">
                        <Disclosure.Button className={styles.assignedSurveyButton}>
                            <span>{survey}</span>
                            <Image 
                                src={Vector} 
                                alt="vector" 
                                className={styles.vector}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className={styles.assignedSurveyPanel}>
                            <iframe 
                                src="https://forms.gle/APv6vdA532nZnp6k7"
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
                {currentUser?.completedResponses.map((survey) => (
                    <span key={survey} className={styles.completedSurveyButton}>
                        {survey}
                    </span>
                ))}
            </div>
        </div>
    );
}