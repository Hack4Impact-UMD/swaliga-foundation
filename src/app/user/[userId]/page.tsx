'use client';
import userPfp from "@/../public/images/pfpIcon.svg";
import gradYrIcon from "@/../public/images/gradYrIcon.svg";
import gradeIcon from "@/../public/images/gradeIcon.svg";
import genderIcon from "@/../public/images/genderIcon.svg";
import ethnicityIcon from "@/../public/images/ethnicityIcon.svg";
import mobileIcon from "@/../public/images/mobileIcon.svg";
import emailIcon from "@/../public/images/emailIcon.svg";
import addressIcon from "@/../public/images/addressIcon.svg";
import dropDownArrowButton from "@/../public/images/buttonDownIcon.svg";
import upArrowButton from "@/../public/images/buttonUpIcon.svg";
import colonIcon from "@/../public/images/colonIcon.svg";

import styles from "./StudentInfoPage.module.css";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/users/[userId]/route"
import { User } from "@/types/user-types";
import { getResponseByID } from '@/lib/firebase/database/response';

async function getUserInfo(userid : string) {
    try {
        const url = new URL(`/api/users/${userid}/route`, window.location.origin);
        const req = new NextRequest(url);
        const response = await GET(req, {params : { userId: userid }});
        console.log(response);
        
        const data = await response.json();
        try {
            const user : User = data.result;
            console.log(user);
            return user;
        } catch {
            console.log("Error getting data");
        }
    } catch {
        console.log("getUserInfo: Error retrieving student information using given userId");
    }
}

async function changePageWithInfo(userid : string) {
    try {
        const userInfo = await getUserInfo(userid);
        
        // change all info
        let name = document.querySelector("#name");
        if (name && userInfo) {
            name.innerHTML = userInfo.firstName + " " + userInfo.lastName;
        }

        let id = document.querySelector("#studentId");
        if (id && userInfo) {
            id.innerHTML = userInfo.id;
        }

        let gradYr = document.querySelector("#gradYr");
        if (gradYr && userInfo) {
            gradYr.innerHTML = String(userInfo.gradYear);
        }
        
        let grade = document.querySelector("#grade");
        if (grade && userInfo) {
            grade.innerHTML = "to-fix" //TODO
        }

        let gender = document.querySelector("#gender");
        if (gender && userInfo) {
            gender.innerHTML = userInfo.gender;
        }

        let ethnicity = document.querySelector("#ethnicity");
        if (ethnicity && userInfo) {
            ethnicity.innerHTML = userInfo.ethnicity;
        }

        let mobile = document.querySelector("#mobile");
        if (mobile && userInfo) {
            mobile.innerHTML = String(userInfo.phone);
        }

        let email = document.querySelector("#email");
        if (email && userInfo) {
            email.innerHTML = String(userInfo.email);
        }

        let address = document.querySelector("#address");
        if (address && userInfo) {
            address.innerHTML = String(userInfo.address);
        }
        
        // fix stuff with guardians (only have that entire area if >0 guardian present)
    } catch {
        console.log("changePageWithInfo: Error retrieving student information using given userId");
    }
}

export default function StudentInfoPage({ params }: { params: { userId: string }}) {
    // get information associated with given userId
    try {
        changePageWithInfo(params.userId);

        return(
            <div className={styles.page}> 
                <div className={styles.innerPage}>
                    <div className={styles.profile}>
                        <img src={userPfp.src} alt="Profile Icon"/>
                        <p className={styles.semiBold} id="name">Name</p>
                        <p className={`${styles.studentId} ${styles.regular}`} id="studentId">Student ID: </p>
                    </div>
                    <div className="basicDetails">
                        <table className={styles.table}>
                            <caption>Basic Details</caption>
                            <thead>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={gradYrIcon.src} alt="Grad Year Icon"/>
                                        <p className={styles.regular}>Grad. Yr.</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="gradYr">actual year</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={gradeIcon.src} alt="Grade Icon"/>
                                        <p className={styles.regular}>Grade</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="grade">actual grade</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={genderIcon.src} alt="Gender Icon"/>
                                        <p className={styles.regular}>Gender</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="gender">gender</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={ethnicityIcon.src} alt="Ethnicity Icon"/>
                                        <p className={styles.regular}>Ethnicity</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="ethnicity">ethnicity</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={mobileIcon.src} alt="Mobile Icon"/>
                                        <p className={styles.regular}>Mobile</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="mobile">XXX-XXX-XXXX</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={emailIcon.src} alt="Email Icon"/>
                                        <p className={styles.regular}>Email</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="email">email</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={addressIcon.src} alt="Address Icon"/>
                                        <p className={styles.regular}>Address</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p id="address">address</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={mobileIcon.src} alt="Guardian Mobile Icon"/>
                                        <p className={styles.regular} id="guardianNum">Guardian Mobile</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p>guardian num</p></td>
                                </tr>
                                <tr>
                                    <td className={styles.leftSideTable}>
                                        <img src={emailIcon.src} alt="Guardian Email Icon"/>
                                        <p className={styles.regular}>Guardian Email</p>
                                    </td>
                                    <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                    <td className={`${styles.rightSideTable} ${styles.regular}`}><p>guardian email</p></td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={styles.surveysStatus}>
                        <span>
                            <p>Surveys Status</p>
                            <img src={dropDownArrowButton.src} alt="button" id="dropdown" onClick={() => changeIcon(params.userId)}/>
                        </span>
                        <div className={`${styles.surveysList} ${styles.regular}`} id="list">
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch {
        console.log("Error retrieving student information using given userId");
    }

    async function changeIcon(userId : string) {
        try {
            const userInfo = await getUserInfo(userId);
            let button = document.querySelector('#dropdown');

            if (button?.getAttribute("src") === dropDownArrowButton.src) {
                button?.setAttribute("src", upArrowButton.src);
                let list = document.querySelector("#list");

                if (list && userInfo) {
                    let newInnerHTML = "";
                    
                    // get all surveys (incomplete)
                    for (let incomplete of userInfo.assignedSurveys) {
                        // let currSurvey = getSurveyById(incomplete);
                        // newInnerHTML += returnSurvey(currSurvey., true);
                    }

                    // get all surveys (complete)
                    for (let complete of userInfo.completedResponses) {
                        let currSurvey = await getResponseByID(complete);
                        let surveyId = currSurvey?.formId;
                        // let currSurvey = await getSurveyById(incomplete);
                    }

                    // check if complete + find name + insert into returnSurvey
                    newInnerHTML += returnSurvey("sample", true);
                    newInnerHTML += returnSurvey("sampleSurvey3", false);
                    newInnerHTML += returnSurvey("sampleSurvey2", true);            
                    list.innerHTML = newInnerHTML;
                }
        } else {
            button?.setAttribute("src", dropDownArrowButton.src);
            let list = document.querySelector("#list");
            if (list) {
                list.innerHTML = "";
            }
        }
        } catch {
            console.log("Error retrieving userInfo when retrieving surveys")
        }
    } 
};

function returnSurvey(surveyName: string, completed: boolean) {
    if (completed) {
        return (`<p style="background-color: #4caf5033; border: 5px solid #4caf50;">${surveyName}</p>`);
    } else {
        return (`<p style="background-color: #d9292933; border: 5px solid #d92929;">${surveyName}</p>`);
    }
}