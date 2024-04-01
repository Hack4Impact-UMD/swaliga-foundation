'use client';

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from "react";
import { Disclosure } from '@headlessui/react'
import { User } from '@/types/user-types';
import { Survey } from '@/types/survey-types';
import { db, auth } from '@/lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';



export default function StudentDashboard() {
    // test data
    const testUser: User = {
        isAdmin: false,
        firstName: 'Jone',
        lastName: 'Doe',
        middleName: 'Test',
        address: '1000 Baltimore Ave',
        school: 'University of Maryland',
        birthdate: new Date('2024-10-20'),
        email: 'test@gmail.com',
        phone: 1234567890,
        guardian: [{ 
            firstName: 'Chris',
            lastName: 'Doe',
            address: '1000 Baltimore Ave',
            email: 'test2@gmail.com',
            phone: 1239876543,
        }],
        password: 'test1234', 
        id: '000-001-111',
        assignedSurveys: ['survey1', 'survey2', 'survey3'],
        completedResponses: ['completed1', 'completed2'],
    };

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // const [surveys, setSurveys] = useState<>()

    const fetchCurrentUserData = async (uid: string) => {
        const userRef = doc(db, 'user', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
        } else {
            console.log('No user exists');
        }
    }

    const fetchSurveyData = async (uid: string) => {
        const surveyRef = doc(db, 'survey', uid);
        const surveyDoc = await getDoc(surveyRef);

        if (surveyDoc.exists()) {
            setCurrentUser(surveyDoc.data() as User);
        } else {
            console.log('No user exists');
        }
    }

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            fetchCurrentUserData(user.uid);
        } else { // for test
            setCurrentUser(testUser);
        }
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
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            Contents
                        </Disclosure.Panel>
                    </Disclosure>
                ))}
                <p className={styles.surveyTitle}>
                    Completed Surveys
                </p>
                <hr className={styles.horizontalLine}/>
                {currentUser?.completedResponses.map((survey) => (
                    <Disclosure key={survey} as="div">
                        <Disclosure.Button className={styles.completedSurveyButton}>
                            <span>{survey}</span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            Contents
                        </Disclosure.Panel>
                    </Disclosure>
                ))}
            </div>
        </div>
    );
}