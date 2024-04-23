'use client';

import styles from "./AdminDashboardPage.module.css";
import DownArrow from "../../../public/images/buttonDownNoBorder.svg"
import UpArrow from "../../../public/images/buttonUpNoBorder.svg"

function changeIcon() {
    let arrow = document.querySelector("#arrowButton");
    let dropDown = document.querySelector("#dropdown");
    if (arrow && dropDown) {
        let currSrc = arrow.getAttribute("src");
        arrow.setAttribute("src", currSrc === DownArrow.src ? UpArrow.src : DownArrow.src);
        //TODO fix below
        dropDown.setAttribute("style", currSrc === DownArrow.src ? "width: 100%; display: flex; justify-content: right;" : "display: none;");
    }
}

function changeDisplay() {
    let headerText = document.querySelector("#headerText");
    let dropdownElem = document.querySelector("#dropdownChild");
    let underHeader = document.querySelector("#underHeader");

    if (headerText && dropdownElem && underHeader) {
        if (headerText.innerHTML === "Student Information") {
            headerText.innerHTML = "Surveys Information";
            dropdownElem.innerHTML = "Student Info.";
            underHeader.innerHTML = "<div>surveys list component</div>";
            underHeader.setAttribute("className", `${styles.underHeaderSurveys}`);
        } else {
            headerText.innerHTML = "Student Information";
            dropdownElem.innerHTML = "Surveys Info.";

            /* TODO: will need to adjust this styling after merging in components*/
            let html = "<div className={styles.searchAndFilter}>search and filter bars (filter component)</div>" + 
                "<div className={styles.allUsers}>view all users (users list component)</div>" + 
                "<div className={styles.next50}>view next 50 button</div>" +
                "<div className={styles.footer}>draft email (code to send an email programmatically (?)) | assign surveys (surveys list component ?) | export to csv buttons</div>";

            underHeader.innerHTML = html;
            underHeader.setAttribute("className", `${styles.underHeaderStudents}`);
        }
    }
}

export default function AdminDashboardPage() {

    return (
        <div className={styles.body}>
            <div className={styles.innerBody}>
                {/* student information header- is this a button ??? :*/}
                <div className={styles.header}>
                    <div className={styles.header2}>
                        <span><p id="headerText">Student Information</p> <img id="arrowButton" src={DownArrow.src} onClick={() => changeIcon()}/></span>
                        <div id="dropdown" className={styles.dropdown}><button id="dropdownChild" className={styles.dropdownChild} onClick={() => changeDisplay()}>Surveys Info.</button></div>
                    </div>
                </div>
                <div id="underHeader" className={styles.underHeaderStudents}>
                    <div className={styles.searchAndFilter}>search and filter bars (filter component)</div>
                    <div className={styles.allUsers}>view all users (users list component)</div>
                    <div className={styles.next50}>view next 50 button -- see if this just gives the next 50 or just displays next 50 w the option to scroll down and see the rest</div>
                    <div className={styles.footer}>draft email (code to send an email programmatically (?)) | assign surveys (surveys list component ?) | export to csv buttons</div>
                </div>
            </div>
        </div>
    );
}