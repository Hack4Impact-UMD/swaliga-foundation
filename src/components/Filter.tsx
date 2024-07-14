"use client";

import React, { useState } from 'react';
import styles from './Filter.module.css';
import { User } from '@/types/user-types';
import moment from 'moment';
import { Timestamp } from 'firebase/firestore';

export default function Filter(props: { users: User[], closeFilter: () => void, setSelectedStudentIds: (ids: string[]) => void, setFilteredUsers: (users: User[]) => void }) {
  const { users, closeFilter, setSelectedStudentIds, setFilteredUsers } = props;

  const [id, setId] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gradYear, setGradYear] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [ethnicity, setEthnicity] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const includeUser = (user: User): boolean => {
    if (id && user.id !== id) return false;
    if (firstName && !user.firstName.toLowerCase().includes(firstName.toLowerCase())) return false;
    if (lastName && !user.lastName.toLowerCase().includes(lastName.toLowerCase())) return false;
    if (gradYear && user.gradYear !== gradYear) return false;
    if (age) {
      const currentMoment = moment();
      const birthDate = user.birthdate.toDate();
      const userAge = currentMoment.diff(birthDate, 'years');
      if (userAge !== age) return false;
    }
    if (gender && !user.gender.toLowerCase().startsWith(gender.toLowerCase())) return false;
    if (ethnicity) {
      let include = false;
      const ethnicitySearch = ethnicity.toLowerCase();
      for (const userEthnicity of user.ethnicity) {
        if (userEthnicity.toLowerCase().includes(ethnicitySearch)) {
          include = true;
          break;
        }
      }
      if (!include) return false;
    }
    if (city && !user.address.city.toLowerCase().startsWith(city.toLowerCase())) return false;
    return true;
  };

  const filterUsers = (): void => {
    setFilteredUsers(users.filter((user: User) => includeUser(user)));
    setSelectedStudentIds([]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={closeFilter} />
      <input
        name="id"
        className={styles.inputField}
        type="text"
        placeholder="ID"
        value={id}
        onChange={(ev) => setId(ev.target.value)}
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
      <button className={styles.button} onClick={filterUsers}> APPLY </button>
    </div>
  );
}