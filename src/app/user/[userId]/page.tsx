'use client';
import userPfp from "@/../public/images/pfpIcon.svg";
import gradYrIcon from "@/../public/images/gradYrIcon.svg";
import gradeIcon from "@/../public/images/gradeIcon.svg";
import genderIcon from "@/../public/images/genderIcon.svg";
import ethnicityIcon from "@/../public/images/ethnicityIcon.svg";
import mobileIcon from "@/../public/images/mobileIcon.svg";
import emailIcon from "@/../public/images/emailIcon.svg";
import addressIcon from "@/../public/images/addressIcon.svg";

import styles from "./StudentInfoPage.module.css";
import { User } from "@/types/user-types";
import { Survey } from "@/types/survey-types";
import { Response } from "@/types/survey-types";

async function getUserInfo(userid : string) {
    try {
        const url = new URL(`/api/users/${userid}`, window.location.origin);
        const response = await fetch(url, {method: "get"});
        
        const data = await response.json();
        try {
            const user : User = data.result;
            return user;
        } catch {
            console.log("Error getting data");
        }
    } catch {
        console.log("Error retrieving student information using given userId");
    }
}

async function changePageWithInfo(userInfo: User) {
    if (userInfo) {
        // change all info
        let name = document.querySelector("#name");
        if (name) {
            name.innerHTML = userInfo.firstName + " " + userInfo.lastName;
        }

        let id = document.querySelector("#studentId");
        if (id) {
            id.innerHTML = userInfo.id;
        }

        let gradYr = document.querySelector("#gradYr");
        if (gradYr) {
            gradYr.innerHTML = String(userInfo.gradYear);
        }
        
        let grade = document.querySelector("#grade");
        if (grade) {
            const currDate = new Date();
            const differenceInYears: number = Math.floor(Math.abs(userInfo.gradYear - currDate.getFullYear()));
            const gradeNum = (differenceInYears >= 12) ? "Kindergarten or below" : String(12 - differenceInYears);
            grade.innerHTML = gradeNum;
        }

        let gender = document.querySelector("#gender");
        if (gender) {
            gender.innerHTML = userInfo.gender;
        }

        let ethnicity = document.querySelector("#ethnicity");
        if (ethnicity) {
            ethnicity.innerHTML = userInfo.ethnicity;
        }

        let mobile = document.querySelector("#mobile");
        if (mobile) {
            mobile.innerHTML = String(userInfo.phone);
        }

        let email = document.querySelector("#email");
        if (email) {
            email.innerHTML = String(userInfo.email);
        }

        let address = document.querySelector("#address");
        if (address) {
            address.innerHTML = String(userInfo.address);
        }
        
        if (userInfo.guardian) { // bc guardian is possibly undefined
            let guardianInfoHTML = "Guardian Information:<br><ol>";
            for (let currGuardian of userInfo.guardian) {
                guardianInfoHTML += `<li>${currGuardian.firstName} ${currGuardian.lastName}  <ul><li>Email: ${currGuardian.email}</li> <li>Phone: ${currGuardian.phone}</li></ul>`;
            }
            guardianInfoHTML += "</ol>"

            let guardian = document.querySelector("#info");
            if (guardian) {
                guardian.innerHTML = guardianInfoHTML;
            }
        }

        let surveyArray = userInfo.assignedSurveys;
        let responseArray = userInfo.completedResponses;
        try {
            let list = document.querySelector("#list");
    
            if (list) {
                let newInnerHTML = "";
                
                // get all surveys (incomplete)
                for (let incomplete of surveyArray) {
                    let currSurvey = await getSurveyInfo(incomplete);
                    if (currSurvey) {
                        newInnerHTML += returnSurvey(currSurvey.info.title, false, currSurvey.responderUri);
                    }
                }
    
                // get all surveys (complete)
                for (let complete of responseArray) {
                    let currSurvey = await getSurveyFromResponse(complete);
                    if (currSurvey) {
                        newInnerHTML += returnSurvey(currSurvey.info.title, true);
                    }
                }
    
                list.innerHTML = newInnerHTML;
            }
        } catch {
            console.log("Error retrieving surveys");
        }
    }
}

async function getSurveyInfo(surveyId : string) {
    try {
        const url = new URL(`/api/surveys/${surveyId}`, window.location.origin);
        const response = await fetch(url, {method: "get"});
        
        const data = await response.json();
        try {
            const survey : Survey = data.data;
            return survey;
        } catch {
            console.log("Error getting data");
        }
    } catch {
        console.log("Error retrieving student information using given survey");
    }
}

async function getSurveyFromResponse(responseId : string) {
    try {
        const url = new URL(`/api/responses/${responseId}`, window.location.origin);
        const response = await fetch(url, {method: "get"});
        
        const data : Response = await response.json();
        try {
            if (data) {
                let surveyId = data.formId;
                let currSurvey = await getSurveyInfo(surveyId);
                return currSurvey;
            }
        } catch {
            console.log("Error getting data");
        }
    } catch {
        console.log("Error retrieving student information using given response");
    }
}

function returnSurvey(surveyName: string, completed: boolean, formLink?: string) {
    if (completed) {
        return (`<p style="background-color: rgba(76, 175, 80, 0.8); border-radius: 10px; color: black;>${surveyName}</p>`);
    } else {
        return (`<a style="text-decoration: none; color: black; background-color: rgba(217, 41, 41, 0.8); border-radius: 10px;" href=${formLink}>${surveyName}</a>`);
    }
}

export default function StudentInfoPage({ params }: { params: { userId: string }}) {
    // get information associated with given userId
    try {
        getUserInfo(params.userId).then((userInfo) => 
            {
                if (userInfo) { 
                    changePageWithInfo(userInfo); 
                }
            }
        );

        return(
            <div className={styles.page}> 
                <div className={styles.leftSide}>  
                    <div className={styles.polygon}> </div>                 
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.profile}>
                        <img src={userPfp.src} alt="Profile Icon"/>
                        <p className={styles.header} id="name">User Information</p>
                        <p className={styles.studentId} id="studentId">Student ID: </p>
                    </div>
                    <div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={gradYrIcon.src} alt="Grad Year Icon"/>
                                        <p className={styles.regular}>Grad. Yr.</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="gradYr">actual year</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={gradeIcon.src} alt="Grade Icon"/>
                                        <p className={styles.regular}>Grade</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="grade">actual grade</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={genderIcon.src} alt="Gender Icon"/>
                                        <p className={styles.regular}>Gender</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="gender">gender</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={ethnicityIcon.src} alt="Ethnicity Icon"/>
                                        <p className={styles.regular}>Ethnicity</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="ethnicity">ethnicity</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={mobileIcon.src} alt="Mobile Icon"/>
                                        <p className={styles.regular}>Mobile</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="mobile">XXX-XXX-XXXX</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={emailIcon.src} alt="Email Icon"/>
                                        <p className={styles.regular}>Email</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="email">email</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={addressIcon.src} alt="Address Icon"/>
                                        <p className={styles.regular}>Address</p>
                                    </td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="address">address</p></td>
                                </tr>
                            </thead>
                        </table>
                        <div className={styles.guardian}>
                            <p id="info"></p>
                        </div>
                    </div>
                    <div className={styles.surveysStatus}>
                        <p className={styles.surveyTitle}>Surveys</p>
                        <div className={`${styles.surveysList} ${styles.regular}`} id="list"></div>
                    </div>
                </div>                
            </div>
        );
    } catch {
        console.log("Error retrieving student information using given userId");
    }
};