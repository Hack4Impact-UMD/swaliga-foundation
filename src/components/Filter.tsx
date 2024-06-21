"use client";

import React, { useState } from 'react';
import styles from './Filter.module.css';
import { User } from '@/types/user-types';

 export default function Filter(props: { users: User[], closeFilter: () => void }) {
    const { users, closeFilter } = props;

    const [id, setId] = useState<number | undefined>(undefined);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [gradYear, setGradYear] = useState<number | undefined>(undefined);
    const [age, setAge] = useState<number | undefined>(undefined);
    const [gender, setGender] = useState<string>("");
    const [ethnicity, setEthnicity] = useState<string>("");
    const [city, setCity] = useState<string>("");
    

    // Return the component
    return (
      <div className={styles.container}>
        <div className={styles.closeIcon} onClick={closeFilter} />
        <input
          name="id"
          className={styles.inputField}
          type="number"
          placeholder="ID"
          value={id}
          onChange={(ev) => setId(parseInt(ev.target.value))}
        />
        <input
          name="firstName"
          className={styles.inputField}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(ev) => setFirstName(ev.target.value)}
        />
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
          onChange={(ev) => setGradYear(parseInt(ev.target.value))}
        />
        <input
          name="age"
          className={styles.inputField}
          type="number"
          placeholder="Age"
          value={age}
          onChange={(ev) => setAge(parseInt(ev.target.value))}
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
        <input
          name="city"
          className={styles.inputField}
          type="text"
          placeholder="City"
          value={city}
          onChange={(ev) => setCity(ev.target.value)}
        />
        <button className={styles.button}> APPLY </button>
      </div>
    );
}