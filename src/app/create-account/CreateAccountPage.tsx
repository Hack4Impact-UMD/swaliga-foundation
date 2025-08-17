"use client";
import React, { useState } from "react";
import styles from "./CreateAccountPage.module.css";
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
import { createStudent } from "@/data/firestore/students";
import { httpsCallable } from "firebase/functions";
import {
  FIRST_STUDENT_ID,
  MAX_NUM_PARENTS_GUARDIANS,
  MIN_NUM_PARENTS_GUARDIANS,
} from "@/constants/constants";

export default function CreateAccountPage() {
  // student info fields
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<Gender>(genderValues[0]);
  const [genderOtherText, setGenderOtherText] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [joinedSwaligaDate, setJoinedSwaligaDate] = useState<string>("");
  const [ethnicity, setEthnicity] = useState<Ethnicity[]>([]);
  const [ethnicityOtherText, setEthnicityOtherText] = useState<string>("");

  // student address fields
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  // guardian fields
  const [guardianFirstNames, setGuardianFirstNames] = useState<string[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianMiddleNames, setGuardianMiddleNames] = useState<string[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianLastNames, setGuardianLastNames] = useState<string[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianGenders, setGuardianGenders] = useState<Gender[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill(genderValues[0])
  );
  const [guardianGenderOtherTexts, setGuardianGenderOtherTexts] = useState<
    string[]
  >(Array(MIN_NUM_PARENTS_GUARDIANS).fill(""));
  const [guardianEmails, setGuardianEmails] = useState<string[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianPhones, setGuardianPhones] = useState<string[]>(
    Array(MIN_NUM_PARENTS_GUARDIANS).fill("")
  );
  const [guardianRelationships, setGuardianRelationships] = useState<
    GuardianRelationship[]
  >(Array(MIN_NUM_PARENTS_GUARDIANS).fill(guardianRelationshipValues[0]));
  const [guardianRelationshipOtherTexts, setGuardianRelationshipOtherTexts] =
    useState<string[]>(Array(MIN_NUM_PARENTS_GUARDIANS).fill(""));

  // school fields
  const [schoolName, setSchoolName] = useState<string>("");
  const [gradYear, setGradYear] = useState<string>("");
  const [gpa, setGPA] = useState<string>("");
  const [schoolAddressLine1, setSchoolAddressLine1] = useState<string>("");
  const [schoolAddressLine2, setSchoolAddressLine2] = useState<string>("");
  const [schoolCity, setSchoolCity] = useState<string>("");
  const [schoolState, setSchoolState] = useState<string>("");
  const [schoolCountry, setSchoolCountry] = useState<string>("");
  const [schoolZipCode, setSchoolZipCode] = useState<string>("");

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const auth = useAuth();

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
        const studentIdRef = doc(
          db,
          Collection.METADATA,
          Document.NEXT_STUDENT_ID
        );
        const { nextStudentId } = ((
          await transaction.get(studentIdRef)
        ).data() as { nextStudentId: number }) || {
          nextStudentId: FIRST_STUDENT_ID,
        };
        await transaction.set(studentIdRef, {
          nextStudentId: nextStudentId + 1,
        });

        const student: Student = {
          id: nextStudentId.toString(),
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
        await createStudent(student, transaction);
        return student.id;
      });
      await httpsCallable(functions, "setStudentId")(studentId);
      await auth.user!.getIdToken(true);
    } catch (error) {
      setError("Failed to create account. Please try again later.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form className={styles.accountForm}>
          <label className={styles.sectionHeader}>Student Information</label>
          <div className={styles.row}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              icon={<FaAddressCard />}
            />
            <TextField
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              icon={<FaAddressCard />}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              icon={<FaAddressCard />}
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
              placeholder="(XXX)-XXX-XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<FaPhone />}
            />
          </div>
          <div className={styles.row}>
            <TextField
              label="Date of Birth"
              placeholder="YYYY/MM/DD"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              icon={<FaBirthdayCake />}
            />
            <TextField
              label="Approximately when did you join the Swaliga Foundation?"
              placeholder="YYYY/MM/DD"
              value={joinedSwaligaDate}
              onChange={(e) => setJoinedSwaligaDate(e.target.value)}
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
            />
          </div>
          <div className={styles.row}>
            <TextField
              label="Address Line 2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              icon={<FaHouse />}
            />
          </div>
          <div className={styles.row}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              icon={<FaCity />}
            />
            <TextField
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              icon={<FaLandmark />}
            />
            <TextField
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              icon={<FaFlag />}
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
            />
            <TextField
              label="Graduation Year"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              required
              icon={<FaGraduationCap />}
            />
            <TextField
              label="GPA"
              value={gpa}
              onChange={(e) => setGPA(e.target.value)}
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
            />{" "}
          </div>
          <div className={styles.row}>
            <TextField
              label="School Address Line 2"
              value={schoolAddressLine2}
              onChange={(e) => setSchoolAddressLine2(e.target.value)}
              icon={<FaHouse />}
            />{" "}
          </div>
          <div className={styles.row}>
            <TextField
              label="School City"
              value={schoolCity}
              onChange={(e) => setSchoolCity(e.target.value)}
              required
              icon={<FaCity />}
            />
            <TextField
              label="School State"
              value={schoolState}
              onChange={(e) => setSchoolState(e.target.value)}
              required
              icon={<FaLandmark />}
            />
            <TextField
              label="School Country"
              value={schoolCountry}
              onChange={(e) => setSchoolCountry(e.target.value)}
              required
              icon={<FaFlag />}
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
                      prev.map((name, i) =>
                        i === index ? e.target.value : name
                      )
                    )
                  }
                  required
                  icon={<FaAddressCard />}
                />
                <TextField
                  label="Middle Name"
                  value={guardianMiddleNames[index]}
                  onChange={(e) =>
                    setGuardianMiddleNames((prev) =>
                      prev.map((name, i) =>
                        i === index ? e.target.value : name
                      )
                    )
                  }
                  icon={<FaAddressCard />}
                />
                <TextField
                  label="Last Name"
                  value={guardianLastNames[index]}
                  onChange={(e) =>
                    setGuardianLastNames((prev) =>
                      prev.map((name, i) =>
                        i === index ? e.target.value : name
                      )
                    )
                  }
                  required
                  icon={<FaAddressCard />}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  label="Email"
                  value={guardianEmails[index]}
                  onChange={(e) =>
                    setGuardianEmails((prev) =>
                      prev.map((email, i) =>
                        i === index ? e.target.value : email
                      )
                    )
                  }
                  required
                  icon={<FaEnvelope />}
                />
                <TextField
                  label="Phone Number"
                  placeholder="(XXX)-XXX-XXXX"
                  value={guardianPhones[index]}
                  onChange={(e) =>
                    setGuardianPhones((prev) =>
                      prev.map((phone, i) =>
                        i === index ? e.target.value : phone
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
                      prev.map((text, i) =>
                        i === index ? e.target.value : text
                      )
                    )
                  }
                  icon={<FaVenusMars />}
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
                      prev.map((text, i) =>
                        i === index ? e.target.value : text
                      )
                    )
                  }
                  icon={<RiParentFill />}
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
        </form>
      </div>
    </div>
  );
}
