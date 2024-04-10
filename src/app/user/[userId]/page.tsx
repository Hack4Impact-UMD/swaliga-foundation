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

export default function StudentInfoPage() {
    return(
        <div className={styles.page}> 
            <div className={styles.innerPage}>
                <div className={styles.profile}>
                    <img src={userPfp.src} alt="Profile Icon"/>
                    <p className={styles.semiBold}>Name</p>
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
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>actual year</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={gradeIcon.src} alt="Grade Icon"/>
                                    <p className={styles.regular}>Grade</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>actual grade</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={genderIcon.src} alt="Gender Icon"/>
                                    <p className={styles.regular}>Gender</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>gender</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={ethnicityIcon.src} alt="Ethnicity Icon"/>
                                    <p className={styles.regular}>Ethnicity</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>ethnicity</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={mobileIcon.src} alt="Mobile Icon"/>
                                    <p className={styles.regular}>Mobile</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>XXX-XXX-XXXX</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={emailIcon.src} alt="Email Icon"/>
                                    <p className={styles.regular}>Email</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>email</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={addressIcon.src} alt="Address Icon"/>
                                    <p className={styles.regular}>Address</p>
                                </td>
                                <td><img src={colonIcon.src} alt="Colon Icon"/></td>
                                <td className={`${styles.rightSideTable} ${styles.regular}`}><p>address</p></td>
                            </tr>
                            <tr>
                                <td className={styles.leftSideTable}>
                                    <img src={mobileIcon.src} alt="Guardian Mobile Icon"/>
                                    <p className={styles.regular}>Guardian Mobile</p>
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
                        <img src={dropDownArrowButton.src} alt="button" id="dropdown" onClick={() => changeIcon()}/>
                    </span>
                    <div className={`${styles.surveysList} ${styles.regular}`} id="list">
                    </div>
                </div>
            </div>
        </div>
    );
}

function changeIcon() {
    let button = document.querySelector('#dropdown');
    if (button?.getAttribute("src") === dropDownArrowButton.src) {
        button?.setAttribute("src", upArrowButton.src);
        let list = document.querySelector("#list");
        if (list) {
            let newInnerHTML = "";
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
};

function returnSurvey(surveyName: string, completed: boolean) {
    if (completed) {
        return (`<p style="background-color: #4caf5033; border: 5px solid #4caf50;">${surveyName}</p>`);
    } else {
        return (`<p style="background-color: #d9292933; border: 5px solid #d92929;">${surveyName}</p>`);
    }
}