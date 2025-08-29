"use client";

import React, { useEffect, useState } from "react";
import styles from "./EditAccountForm.module.css";
import {
  ethnicityValues,
  Ethnicity,
  Gender,
  genderValues,
  GuardianRelationship,
  guardianRelationshipValues,
  Student,
} from "@/types/user-types";
import useAuth from "@/features/auth/useAuth";
import {
  FaAddressCard,
  FaBirthdayCake,
  FaCalendar,
  FaCity,
  FaEnvelope,
  FaFlag,
  FaGraduationCap,
  FaLandmark,
  FaMapPin,
  FaPhone,
  FaSchool,
  FaVenusMars,
} from "react-icons/fa";
import { RiParentFill } from "react-icons/ri";
import { FaHouse } from "react-icons/fa6";
import TextField from "./TextField";
import Select from "./Select";
import moment from "moment";
import { doc, runTransaction } from "firebase/firestore";
import { db, functions } from "@/config/firebaseConfig";
import { Collection, Document } from "@/data/firestore/utils";
import { createStudent, updateStudent } from "@/data/firestore/students";
import { httpsCallable } from "firebase/functions";
import {
  FIRST_STUDENT_ID,
  MAX_NUM_PARENTS_GUARDIANS,
  MIN_NUM_PARENTS_GUARDIANS,
} from "@/constants/constants";
type EditAccountFormProps =
  | {
      mode: "CREATE";
    }
  | {
      mode: "EDIT";
      student: Student;
    };

export default function EditAccountForm(props: EditAccountFormProps) {
  // @ts-expect-error
  const { mode, student } = props;

  // student info fields
  const [firstName, setFirstName] = useState<string>(
    mode === "EDIT" ? student.name.firstName : ""
  );
  const [middleName, setMiddleName] = useState<string>(
    mode === "EDIT" ? student.name.middleName || "" : ""
  );
  const [lastName, setLastName] = useState<string>(
    mode === "EDIT" ? student.name.lastName : ""
  );
  const [gender, setGender] = useState<Gender>(
    mode === "EDIT"
      ? genderValues.includes(student.gender)
        ? student.gender
        : "Other"
      : genderValues[0]
  );
  const [genderOtherText, setGenderOtherText] = useState<string>(() => {
    if (mode === "CREATE") {
      return "";
    }

    const isOtherGender = !genderValues.includes(student.gender);
    if (isOtherGender || gender === "Other") {
      return student.gender;
    }
    return "";
  });
  const [phone, setPhone] = useState<string>(
    mode === "EDIT" ? student.phone || "" : ""
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    mode === "EDIT" ? moment(student.dateOfBirth).format("YYYY/MM/DD") : ""
  );
  const [joinedSwaligaDate, setJoinedSwaligaDate] = useState<string>(
    mode === "EDIT"
      ? moment(student.joinedSwaligaDate).format("YYYY/MM/DD")
      : ""
  );
  const [ethnicity, setEthnicity] = useState<Ethnicity[]>(
    mode === "EDIT"
      ? student.ethnicity.map((ethnicity) =>
          ethnicityValues.includes(ethnicity) ? ethnicity : "Other"
        )
      : []
  );
  const [ethnicityOtherText, setEthnicityOtherText] = useState<string>(
    mode === "EDIT"
      ? student.ethnicity.filter(
          (ethnicity) => !ethnicityValues.includes(ethnicity)
        )[0] || ""
      : ""
  );

  // student address fields
  const [addressLine1, setAddressLine1] = useState<string>(
    mode === "EDIT" ? student.address.addressLine1 : ""
  );
  const [addressLine2, setAddressLine2] = useState<string>(
    mode === "EDIT" ? student.address.addressLine2 || "" : ""
  );
  const [city, setCity] = useState<string>(
    mode === "EDIT" ? student.address.city : ""
  );
  const [state, setState] = useState<string>(
    mode === "EDIT" ? student.address.state : ""
  );
  const [country, setCountry] = useState<string>(
    mode === "EDIT" ? student.address.country : ""
  );
  const [zipCode, setZipCode] = useState<string>(
    mode === "EDIT" ? String(student.address.zipCode) : ""
  );

  // guardian fields
  const [guardianFirstNames, setGuardianFirstNames] = useState<string[]>(
    mode === "EDIT"
      ? student.guardians.map((g) => g.name.firstName)
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianMiddleNames, setGuardianMiddleNames] = useState<string[]>(
    mode === "EDIT"
      ? student.guardians.map((g) => g.name.middleName || "")
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianLastNames, setGuardianLastNames] = useState<string[]>(
    mode === "EDIT"
      ? student.guardians.map((g) => g.name.lastName)
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianGenders, setGuardianGenders] = useState<Gender[]>(
    mode === "EDIT"
      ? student.guardians.map((g) =>
          genderValues.includes(g.gender) ? g.gender : "Other"
        )
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill(genderValues[0])
  );
  const [guardianGenderOtherTexts, setGuardianGenderOtherTexts] = useState<
    string[]
  >(
    mode === "EDIT"
      ? student.guardians.map((g) =>
          genderValues.includes(g.gender) && g.gender !== "Other"
            ? ""
            : g.gender
        )
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianEmails, setGuardianEmails] = useState<string[]>(
    mode === "EDIT"
      ? student.guardians.map((g) => g.email)
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianPhones, setGuardianPhones] = useState<string[]>(
    mode === "EDIT"
      ? student.guardians.map((g) => g.phone || "")
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianRelationships, setGuardianRelationships] = useState<
    GuardianRelationship[]
  >(
    mode === "EDIT"
      ? student.guardians.map((g) =>
          guardianRelationshipValues.includes(g.relationship)
            ? g.relationship
            : "Other"
        )
      : Array(MIN_NUM_PARENTS_GUARDIANS).fill(guardianRelationshipValues[0])
  );
  const [guardianRelationshipOtherTexts, setGuardianRelationshipOtherTexts] =
    useState<string[]>(
      mode === "EDIT"
        ? student.guardians.map((g) =>
            guardianRelationshipValues.includes(g.relationship) &&
            g.relationship !== "Other"
              ? ""
              : g.relationship
          )
        : Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
    );

  // school fields
  const [schoolName, setSchoolName] = useState<string>(
    mode === "EDIT" ? student.school.name : ""
  );
  const [gradYear, setGradYear] = useState<string>(
    mode === "EDIT" ? String(student.school.gradYear) : ""
  );
  const [gpa, setGPA] = useState<string>(
    mode === "EDIT" ? String(student.school.gpa) : ""
  );
  const [schoolAddressLine1, setSchoolAddressLine1] = useState<string>(
    mode === "EDIT" ? student.school.address.addressLine1 : ""
  );
  const [schoolAddressLine2, setSchoolAddressLine2] = useState<string>(
    mode === "EDIT" ? student.school.address.addressLine2 || "" : ""
  );
  const [schoolCity, setSchoolCity] = useState<string>(
    mode === "EDIT" ? student.school.address.city : ""
  );
  const [schoolState, setSchoolState] = useState<string>(
    mode === "EDIT" ? student.school.address.state : ""
  );
  const [schoolCountry, setSchoolCountry] = useState<string>(
    mode === "EDIT" ? student.school.address.country : ""
  );
  const [schoolZipCode, setSchoolZipCode] = useState<string>(
    mode === "EDIT" ? String(student.school.address.zipCode) : ""
  );

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const auth = useAuth();

  useEffect(() => {
    if (error) {
      setError("");
    }
    if (success) {
      setSuccess("");
    }
  }, [
    firstName,
    middleName,
    lastName,
    gender,
    genderOtherText,
    phone,
    dateOfBirth,
    joinedSwaligaDate,
    ethnicity,
    ethnicityOtherText,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    zipCode,
    guardianFirstNames,
    guardianMiddleNames,
    guardianLastNames,
    guardianGenders,
    guardianGenderOtherTexts,
    guardianEmails,
    guardianPhones,
    guardianRelationships,
    guardianRelationshipOtherTexts,
    schoolName,
    gradYear,
    gpa,
    schoolAddressLine1,
    schoolAddressLine2,
    schoolCity,
    schoolState,
    schoolCountry,
    schoolZipCode,
  ]);

  const addEmergencyContact = () => {
    setGuardianFirstNames((prev) => [...prev, ""]);
    setGuardianMiddleNames((prev) => [...prev, ""]);
    setGuardianLastNames((prev) => [...prev, ""]);
    setGuardianGenders((prev) => [...prev, genderValues[0]]);
    setGuardianGenderOtherTexts((prev) => [...prev, ""]);
    setGuardianEmails((prev) => [...prev, ""]);
    setGuardianPhones((prev) => [...prev, ""]);
    setGuardianRelationships((prev) => [
      ...prev,
      guardianRelationshipValues[0],
    ]);
    setGuardianRelationshipOtherTexts((prev) => [...prev, ""]);
  };

  const deleteEmergencyContact = (index: number) => {
    setGuardianFirstNames((prev) => prev.filter((_, i) => i !== index));
    setGuardianMiddleNames((prev) => prev.filter((_, i) => i !== index));
    setGuardianLastNames((prev) => prev.filter((_, i) => i !== index));
    setGuardianGenders((prev) => prev.filter((_, i) => i !== index));
    setGuardianGenderOtherTexts((prev) => prev.filter((_, i) => i !== index));
    setGuardianEmails((prev) => prev.filter((_, i) => i !== index));
    setGuardianPhones((prev) => prev.filter((_, i) => i !== index));
    setGuardianRelationships((prev) => prev.filter((_, i) => i !== index));
    setGuardianRelationshipOtherTexts((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const isFormValid = (): boolean => {
    let errors: string[] = [];
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !joinedSwaligaDate ||
      (gender === "Other" && !genderOtherText) ||
      ethnicity.length === 0 ||
      (ethnicity.includes("Other") && !ethnicityOtherText) ||
      !addressLine1 ||
      !city ||
      !state ||
      !country ||
      !zipCode ||
      !schoolName ||
      !gradYear ||
      !gpa ||
      !schoolAddressLine1 ||
      !schoolCity ||
      !schoolState ||
      !schoolCountry ||
      !schoolZipCode ||
      !guardianFirstNames.every(
        (_, i) =>
          guardianFirstNames[i] &&
          guardianLastNames[i] &&
          guardianEmails[i] &&
          (guardianGenders[i] !== "Other" || guardianGenderOtherTexts[i]) &&
          (guardianRelationships[i] !== "Other" ||
            guardianRelationshipOtherTexts[i])
      )
    ) {
      errors.push("At least 1 required field is empty.");
    }

    const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.push(
        "The Phone field should either be empty or contain a valid phone number in the format (XXX)-XXX-XXXX."
      );
    }

    const dateOfBirthMoment = moment(dateOfBirth, "YYYY/MM/DD");
    if (!dateOfBirthMoment.isValid()) {
      errors.push("Valid date of birth must be in the format YYYY/MM/DD.");
    }

    const joinedSwaligaDateMoment = moment(joinedSwaligaDate, "YYYY/MM/DD");
    if (!joinedSwaligaDateMoment.isValid()) {
      errors.push(
        "Valid date for when you joined the Swaliga Foundation must be in the format YYYY/MM/DD."
      );
    }

    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(zipCode)) {
      errors.push("Zip Code must be a 5 digit number.");
    }

    const numGradYear = Number(gradYear);
    if (Number.isNaN(numGradYear) || numGradYear < 1900) {
      errors.push("Graduation Year must be a valid year after 1900.");
    }

    const numGPA = parseFloat(gpa);
    if (Number.isNaN(numGPA) || numGPA < 0.0 || numGPA > 5.0) {
      errors.push("GPA must be a number between 0.0 and 5.0.");
    }

    if (!zipCodeRegex.test(schoolZipCode)) {
      errors.push("School Zip Code must be a 5 digit number.");
    }

    const emailRegex = /^.+@.+\..{2,}$/;
    if (!guardianEmails.every((email) => emailRegex.test(email))) {
      errors.push("At least 1 parent/guardian email address is invalid.");
    }

    if (
      !guardianPhones.every((phone) => phone === "" || phoneRegex.test(phone))
    ) {
      errors.push(
        "At least 1 parent/guardian phone number is invalid. Either omit the phone number of provide a valid phone number in the format (XXX)-XXX-XXXX."
      );
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!isFormValid()) {
      return;
    }
    try {
      const studentId = await runTransaction(db, async (transaction) => {
        if (mode === "CREATE") {
          const studentIdRef = doc(
            db,
            Collection.METADATA,
            Document.NEXT_STUDENT_ID
          );
          var studentId = `${
            (await transaction.get(studentIdRef)).data()?.nextStudentId ||
            FIRST_STUDENT_ID
          }`;
          await transaction.set(studentIdRef, {
            nextStudentId: studentId + 1,
          });
        } else {
          var studentId = student.id;
        }

        const studentData: Student = {
          id: studentId,
          name: {
            firstName,
            ...(middleName.trim() ? { middleName: middleName.trim() } : {}),
            lastName,
          },
          gender: gender === "Other" ? genderOtherText : gender,
          email: auth.user!.email!,
          ...(phone ? { phone } : {}),
          uid: auth.user!.uid,
          role: "STUDENT",
          dateOfBirth,
          joinedSwaligaDate,
          ethnicity: ethnicity.map((eth) =>
            eth === "Other" ? ethnicityOtherText : eth
          ),
          guardians: guardianFirstNames.map((_, index) => ({
            name: {
              firstName: guardianFirstNames[index],
              ...(guardianMiddleNames[index].trim()
                ? { middleName: guardianMiddleNames[index].trim() }
                : {}),
              lastName: guardianLastNames[index],
            },
            gender:
              guardianGenders[index] === "Other"
                ? guardianGenderOtherTexts[index]
                : guardianGenders[index],
            email: guardianEmails[index].toLowerCase(),
            ...(guardianPhones[index] ? { phone: guardianPhones[index] } : {}),
            relationship:
              guardianRelationships[index] === "Other"
                ? guardianRelationshipOtherTexts[index]
                : guardianRelationships[index],
          })),
          address: {
            addressLine1,
            ...(addressLine2.trim()
              ? { addressLine2: addressLine2.trim() }
              : {}),
            city,
            state,
            country,
            zipCode: Number(zipCode),
          },
          school: {
            name: schoolName,
            address: {
              addressLine1: schoolAddressLine1,
              ...(schoolAddressLine2.trim()
                ? { addressLine2: schoolAddressLine2.trim() }
                : {}),
              city: schoolCity,
              state: schoolState,
              country: schoolCountry,
              zipCode: Number(schoolZipCode),
            },
            gradYear: Number(gradYear),
            gpa: parseFloat(gpa),
          },
        };
        mode === "EDIT"
          ? await updateStudent(student.id, studentData, transaction)
          : await createStudent(studentData, transaction);
        return studentData.id;
      });
      if (mode === "CREATE") {
        await httpsCallable(functions, "onStudentAccountCreated")(studentId);
        await auth.user!.getIdToken(true);
      }
      setSuccess(
        `Account ${mode === "CREATE" ? "created" : "updated"} successfully!`
      );
    } catch (error) {
      setError("Failed to create account. Please try again later.");
    }
  };

  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length === 0) {
      return "";
    } else if (value.length <= 3) {
      return `(${value}`;
    } else if (value.length <= 6) {
      return `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  };

  const formatDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 4)}/${digits.slice(4)}`;
    }
    return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
  };

  const formatYear = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 4);
  };

  return (
    <form className={styles.accountForm}>
      <label className={styles.sectionHeader}>Student Information</label>
      <div className={styles.row}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          icon={<FaAddressCard />}
          maxLength={50}
        />
        <TextField
          label="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          icon={<FaAddressCard />}
          maxLength={50}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          icon={<FaAddressCard />}
          maxLength={50}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="Email"
          value={auth.user!.email || ""}
          required
          disabled
          icon={<FaEnvelope />}
        />
        <TextField
          label="Phone Number"
          placeholder="(XXX) XXX-XXXX"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          icon={<FaPhone />}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="Date of Birth"
          placeholder="YYYY/MM/DD"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(formatDate(e.target.value))}
          required
          icon={<FaBirthdayCake />}
        />
        <TextField
          label="Approximately when did you join the Swaliga Foundation?"
          placeholder="YYYY/MM/DD"
          value={joinedSwaligaDate}
          onChange={(e) => setJoinedSwaligaDate(formatDate(e.target.value))}
          required
          icon={<FaCalendar />}
        />
      </div>
      <div className={styles.row}>
        <Select
          label="Gender"
          values={genderValues}
          selectedValue={gender}
          onChange={(e) => setGender(e.target.value)}
          otherText={genderOtherText}
          onOtherTextChange={(e) => setGenderOtherText(e.target.value)}
          icon={<FaVenusMars />}
          maxOtherLength={50}
        />
      </div>
      <label>
        {`What race/ethnicity do you identify as? (Select all that apply) `}
        <span className={styles.requiredAsterisk}>*</span>
      </label>
      <div className={styles.row}>
        <div className={styles.checkboxContainer}>
          {ethnicityValues.map((eth) => (
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id={eth}
                name={eth}
                checked={ethnicity.includes(eth)}
                onChange={(e) =>
                  setEthnicity((prev) => {
                    if (e.target.checked) {
                      return [...prev, eth];
                    } else {
                      return prev.filter((item) => item !== eth);
                    }
                  })
                }
              />
              <label htmlFor={eth}>{eth}</label>
              {eth === "Other" && (
                <input
                  type="text"
                  id="ethnicityOtherText"
                  name="ethnicityOtherText"
                  placeholder="Please specify"
                  value={ethnicityOtherText}
                  disabled={!ethnicity.includes("Other")}
                  onChange={(e) => setEthnicityOtherText(e.target.value)}
                  className={styles.otherTextInput}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <label className={styles.sectionHeader}>Home Address</label>
      <div className={styles.row}>
        <TextField
          label="Address Line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
          icon={<FaHouse />}
          maxLength={100}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="Address Line 2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          icon={<FaHouse />}
          maxLength={100}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          icon={<FaCity />}
          maxLength={50}
        />
        <TextField
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          icon={<FaLandmark />}
          maxLength={50}
        />
        <TextField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          icon={<FaFlag />}
          maxLength={50}
        />
        <TextField
          label="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          icon={<FaMapPin />}
        />
      </div>

      <label className={styles.sectionHeader}>School Information</label>
      <div className={styles.row}>
        <TextField
          label="School Name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
          icon={<FaSchool />}
          maxLength={100}
        />
        <TextField
          label="Graduation Year"
          value={gradYear}
          onChange={(e) => setGradYear(formatYear(e.target.value))}
          required
          icon={<FaGraduationCap />}
        />
        <TextField
          label="GPA"
          value={gpa}
          onChange={(e) => {
            if (
              e.target.value === "" ||
              e.target.value.match(/^\d(\.(\d{1,2})?)?$/)
            ) {
              setGPA(e.target.value);
            }
          }}
          required
          icon={<FaGraduationCap />}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="School Address Line 1"
          value={schoolAddressLine1}
          onChange={(e) => setSchoolAddressLine1(e.target.value)}
          required
          icon={<FaHouse />}
          maxLength={100}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="School Address Line 2"
          value={schoolAddressLine2}
          onChange={(e) => setSchoolAddressLine2(e.target.value)}
          icon={<FaHouse />}
          maxLength={100}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="School City"
          value={schoolCity}
          onChange={(e) => setSchoolCity(e.target.value)}
          required
          icon={<FaCity />}
          maxLength={50}
        />
        <TextField
          label="School State"
          value={schoolState}
          onChange={(e) => setSchoolState(e.target.value)}
          required
          icon={<FaLandmark />}
          maxLength={50}
        />
        <TextField
          label="School Country"
          value={schoolCountry}
          onChange={(e) => setSchoolCountry(e.target.value)}
          required
          icon={<FaFlag />}
          maxLength={50}
        />
        <TextField
          label="School Zip Code"
          value={schoolZipCode}
          onChange={(e) => setSchoolZipCode(e.target.value)}
          required
          icon={<FaMapPin />}
        />
      </div>

      <label className={styles.sectionHeader}>
        Parent/Guardian Information
      </label>
      {guardianEmails.map((_, index) => (
        <>
          <div className={styles.row}>
            <label>Parent/Guardian {index + 1}</label>
            {guardianFirstNames.length >= MIN_NUM_PARENTS_GUARDIANS + 1 && (
              <button
                className={styles.emergencyRemoveButton}
                type="button"
                onClick={() => deleteEmergencyContact(index)}
              >
                Remove Parent/Guardian {index + 1}
              </button>
            )}
          </div>

          <div className={styles.row}>
            <TextField
              label="First Name"
              value={guardianFirstNames[index]}
              onChange={(e) =>
                setGuardianFirstNames((prev) =>
                  prev.map((name, i) => (i === index ? e.target.value : name))
                )
              }
              required
              icon={<FaAddressCard />}
              maxLength={50}
            />
            <TextField
              label="Middle Name"
              value={guardianMiddleNames[index]}
              onChange={(e) =>
                setGuardianMiddleNames((prev) =>
                  prev.map((name, i) => (i === index ? e.target.value : name))
                )
              }
              icon={<FaAddressCard />}
              maxLength={50}
            />
            <TextField
              label="Last Name"
              value={guardianLastNames[index]}
              onChange={(e) =>
                setGuardianLastNames((prev) =>
                  prev.map((name, i) => (i === index ? e.target.value : name))
                )
              }
              required
              icon={<FaAddressCard />}
              maxLength={50}
            />
          </div>
          <div className={styles.row}>
            <TextField
              label="Email"
              value={guardianEmails[index]}
              onChange={(e) =>
                setGuardianEmails((prev) =>
                  prev.map((email, i) => (i === index ? e.target.value : email))
                )
              }
              required
              icon={<FaEnvelope />}
              maxLength={320}
            />
            <TextField
              label="Phone Number"
              placeholder="(XXX) XXX-XXXX"
              value={guardianPhones[index]}
              onChange={(e) =>
                setGuardianPhones((prev) =>
                  prev.map((phone, i) =>
                    i === index ? formatPhone(e.target.value) : phone
                  )
                )
              }
              icon={<FaPhone />}
            />
          </div>
          <div className={styles.row}>
            <Select
              label="Gender"
              values={genderValues}
              selectedValue={guardianGenders[index]}
              onChange={(e) =>
                setGuardianGenders((prev) =>
                  prev.map((gender, i) =>
                    i === index ? (e.target.value as Gender) : gender
                  )
                )
              }
              otherText={guardianGenderOtherTexts[index]}
              onOtherTextChange={(e) =>
                setGuardianGenderOtherTexts((prev) =>
                  prev.map((text, i) => (i === index ? e.target.value : text))
                )
              }
              icon={<FaVenusMars />}
              maxOtherLength={50}
            />
            <Select
              label="Guardian Relationship"
              values={guardianRelationshipValues}
              selectedValue={guardianRelationships[index]}
              onChange={(e) =>
                setGuardianRelationships((prev) =>
                  prev.map((relationship, i) =>
                    i === index
                      ? (e.target.value as GuardianRelationship)
                      : relationship
                  )
                )
              }
              otherText={guardianRelationshipOtherTexts[index]}
              onOtherTextChange={(e) =>
                setGuardianRelationshipOtherTexts((prev) =>
                  prev.map((text, i) => (i === index ? e.target.value : text))
                )
              }
              icon={<RiParentFill />}
              maxOtherLength={50}
            />
          </div>
        </>
      ))}
      {guardianFirstNames.length <= MAX_NUM_PARENTS_GUARDIANS - 1 && (
        <button
          className={styles.emergencyAddButton}
          type="button"
          onClick={addEmergencyContact}
        >
          Add Parent/Guardian
        </button>
      )}
      {formErrors.length > 0 && (
        <div className={styles.formErrors}>
          <h3>Please fix the following:</h3>
          <ul>
            {formErrors.map((error) => (
              <li>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
}
