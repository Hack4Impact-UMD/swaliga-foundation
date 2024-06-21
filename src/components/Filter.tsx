"use client";

import React, { useState } from 'react';
import styles from './Filter.module.css';
import { User } from '@/types/user-types';

 export default function Filter(props: { users: User[], closeFilter: () => void }) {
    const { users, closeFilter } = props;

    const [lastName, setLastName] = useState<string>("");
    const [gradYear, setGradYear] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [ethnicity, setEthnicity] = useState<string>("");

    // Return the component
    return (
      <div className={styles.container}>
        <div className={styles.closeIcon} onClick={closeFilter} />
        <input
          name="lastName"
          className={styles.inputField}
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(ev) => setLastName(ev.target.value)}
        />
        <input
          name="gradYear"
          className={styles.inputField}
          type="number"
          placeholder="Grad Year"
          value={gradYear}
          onChange={(ev) => setGradYear(ev.target.value)}
        />
        <input
          name="gender"
          className={styles.inputField}
          placeholder="Gender"
          value={gender}
          onChange={(ev) => setGender(ev.target.value)}
        />
        <input
          name="ethnicity"
          className={styles.inputField}
          placeholder="Ethnicity"
          value={ethnicity}
          onChange={(ev) => setEthnicity(ev.target.value)}
        />
        <button className={styles.button}> APPLY </button>
      </div>
    );
}