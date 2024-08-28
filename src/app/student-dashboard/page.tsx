'use client';

import styles from "./StudentDashboard.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import UpArrow from '@/../public/icons/up-arrow-icon.png';
import DownArrow from '@/../public/icons/down-arrow-icon.png';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { User } from "@/types/user-types";
import { Survey, Response } from '@/types/survey-types';
import { auth } from '@/lib/firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import Loading from "@/components/Loading";

export default function StudentDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [openSurvey, setOpenSurvey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentUserData = async (userId: string) => {
        setLoading(true);
        setError(null); // Reset any previous errors
        try {
            // Fetch user data
            const res = await fetch(`/api/users/${userId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }
            const user: User = await res.json();
            setUser(user);

            // Fetch assigned surveys
            const surveyPromises = user.assignedSurveys.map(surveyId => fetch(`/api/surveys/${surveyId}`).then(res => res.json()));
            const surveys: Survey[] = await Promise.all(surveyPromises);
            setSurveys(surveys);

            // Fetch completed responses
            const responsePromises = user.completedResponses.map(responseId => fetch(`/api/responses/${responseId}`).then(res => res.json()));
            const responses: Response[] = await Promise.all(responsePromises);
            setResponses(responses.map(response => response.formTitle));
        } catch (error) {
            console.error(error);
            setError('Unable to fetch data for student dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchCurrentUserData(currentUser.uid);
            console.log(currentUser.uid);
        } else {
            console.log('No signed-in user');
        }
    }, []);

    const handleSurveyButtonClick = (surveyId: string) => {
        setOpenSurvey(surveyId === openSurvey ? '' : surveyId);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Image
                    src={CompanyLogo}
                    alt="Company Logo"
                    className={styles.img}
                />
                <p className={styles.info}>
                    Student ID: {user?.swaligaID || "No user ID found"}
                </p>
                <Link href="/settings">
                    <button className={styles.settingButton}>Settings</button>
                </Link>
                <Link
                    href="/"
                    className={styles.logOut}
                    onClick={() => signOut(auth)}
                >
                    Log Out
                </Link>
            </div>
            <div className={styles.mainContent}>
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.surveyTitle}>Available Surveys</p>
                <hr className={styles.horizontalLine} />
                {surveys.length > 0 ? (
                    surveys.map((survey) => (
                        <div key={survey.formId} className={styles.surveyContainer}>
                            <button
                                onClick={() => handleSurveyButtonClick(survey.formId)}
                                className={styles.assignedSurveyButton}
                            >
                                {survey.info.title}
                                <Image
                                    src={openSurvey === survey.formId ? DownArrow : UpArrow}
                                    alt={openSurvey === survey.formId ? "DownArrow" : "UpArrow"}
                                    className={styles.vector}
                                />
                            </button>
                            {openSurvey === survey.formId && (
                                <iframe
                                    key={survey.formId}
                                    src={survey.responderUri}
                                    title={survey.info.title}
                                    allowFullScreen={true}
                                    className={styles.form}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p>No surveys assigned.</p>
                )}
                <p className={styles.surveyTitle}>Completed Surveys</p>
                <hr className={styles.horizontalLine} />
                {responses.length > 0 ? (
                    responses.map((response) => (
                        <span key={response} className={styles.completedSurveyButton}>
                            {response}
                        </span>
                    ))
                ) : (
                    <p>No completed surveys.</p>
                )}
            </div>
        </div>
    );
}
