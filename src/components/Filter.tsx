"use client";

import React, { useState } from 'react';
import styles from './Filter.module.css';
import { FaTimes } from 'react-icons/fa';

 export default function Filter(props: { onClose: () => void }) {
    const { onClose } = props;

    // Checkbox states
    const [lastNameChecked, setLastNameChecked] = useState(false);
    const [gradYearChecked, setGradYearChecked] = useState(false);
    const [genderChecked, setGenderChecked] = useState(false);
    const [ethnicityChecked, setEthnicityChecked] = useState(false);

    // Textbox states
    const [lastName, setLastName] = useState("");
    const [gradYear, setGradYear] = useState("");
    const [gender, setGender] = useState("");
    const [ethnicity, setEthnicity] = useState("");

    // Return the component
    return (
      <div className={styles.container}>
        <div className={styles.closeIcon} onClick={onClose} />
        <div className={styles.inputGroup}>
          <input
            type="checkbox"
            id="lastNameCheckbox"
            className={styles.inputCheckbox}
            checked={lastNameChecked}
            onChange={(ev) => setLastNameChecked(ev.target.checked)}
          />
          <input
            name="lastName"
            className={styles.inputField}
            placeholder="Last Name"
            value={lastName}
            onChange={(ev) => setLastName(ev.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="checkbox"
            id="gradYearCheckbox"
            className={styles.inputCheckbox}
            checked={gradYearChecked}
            onChange={(ev) => setGradYearChecked(ev.target.checked)}
          />
          <input
            name="gradYear"
            className={styles.inputField}
            placeholder="Grad Year"
            value={gradYear}
            onChange={(ev) => setGradYear(ev.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="checkbox"
            id="genderCheckbox"
            className={styles.inputCheckbox}
            checked={genderChecked}
            onChange={(ev) => setGenderChecked(ev.target.checked)}
          />
          <input
            name="gender"
            className={styles.inputField}
            placeholder="Gender"
            value={gender}
            onChange={(ev) => setGender(ev.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="checkbox"
            id="ethnicityCheckbox"
            className={styles.inputCheckbox}
            checked={ethnicityChecked}
            onChange={(ev) => setEthnicityChecked(ev.target.checked)}
          />
          <input
            name="ethnicity"
            className={styles.inputField}
            placeholder="Ethnicity"
            value={ethnicity}
            onChange={(ev) => setEthnicity(ev.target.value)}
          />
        </div>
        <button className={styles.button}> APPLY </button>
      </div>
    );
}