"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import styles from "./CreateAccountPage.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Timestamp } from "firebase/firestore";
import { User, Gender, Ethnicity, Student } from "@/types/user-types";
import { useRouter } from "next/navigation";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import Image from "next/image";
import logoutIcon from "@/../public/icons/logout.svg";
import { logOut } from "@/features/auth/authN/googleAuthN";
import moment from "moment";

export default function CreateAccountPage() {
  const [formError, setFormError] = useState("");
  const router = useRouter();

  interface RaceEthnicity {
    blackOrAfricanAmerican: boolean;
    indigenous: boolean;
    asian: boolean;
    white: boolean;
    multiracial: boolean;
    latin: boolean;
    other: boolean;
    otherText: string;
  }

  interface AccountInfo {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    bday: string;
    phoneNumber: string;
    gender: Gender;
    streetName: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    school: string;
    grad: string;
    yearsInSwaliga: string;
    swaligaID: number;
    raceEthnicity: RaceEthnicity;
    emergencyContacts: {
      name: string;
      email: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }[];
  }

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    bday: "",
    phoneNumber: "",
    gender: "Other",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    school: "",
    grad: "",
    yearsInSwaliga: "",
    swaligaID: 0,
    raceEthnicity: {
      blackOrAfricanAmerican: false,
      indigenous: false,
      asian: false,
      white: false,
      multiracial: false,
      latin: false,
      other: false,
      otherText: "",
    },
    emergencyContacts: [
      {
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    ],
  });

  const handleRaceEthnicityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    const isOtherCheckbox = name === "other";

    setAccountInfo((prev) => ({
      ...prev,
      raceEthnicity: {
        ...prev.raceEthnicity,
        [name]: checked,
        ...(isOtherCheckbox && {
          otherText: checked ? prev.raceEthnicity.otherText : "",
        }),
      },
    }));
  };

  const handleOtherTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    setAccountInfo((prev) => ({
      ...prev,
      raceEthnicity: {
        ...prev.raceEthnicity,
        otherText: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (auth.currentUser?.uid === undefined) {
        throw Error("Failed to create account");
      }

      let userUid: string = auth.currentUser?.uid;

      // Gets current SwaligaID from metadata
      const swaligaIDDoc = await getDoc(doc(db, "metadata", "nextUserId"));
      let currentSwaligaID = swaligaIDDoc.exists()
        ? swaligaIDDoc.data().nextUserId
        : 0;

      // Increment SwaligaID for the new user
      const newSwaligaID = currentSwaligaID + 1;

      // Create the user object to save in Firestore
      const user: Student = {
        role: "STUDENT",
        name: {
          firstName: accountInfo.firstName,
          middleName: accountInfo.middleName,
          lastName: accountInfo.lastName,
        },
        email: accountInfo.email,
        phone: accountInfo.phoneNumber,
        gender: accountInfo.gender,
        dateOfBirth: moment(accountInfo.bday).toISOString(),
        guardians: accountInfo.emergencyContacts.map((contact) => ({
          name: {
            firstName: contact.name.split(" ")[0],
            middleName: contact.name.split(" ")[1] || "",
            lastName: contact.name.split(" ").slice(2).join(" ") || "",
          },
          email: contact.email,
          phone: contact.phone,
          gender: "Other",
          relationship: "Other",
          address: {
            addressLine1: contact.street,
            city: contact.city,
            state: contact.state,
            zip: parseInt(contact.zip),
            country: contact.country,
          },
        })),
        uid: userUid, // Use the UID from Firebase Authentication
        address: {
          addressLine1: accountInfo.streetName,
          city: accountInfo.city,
          state: accountInfo.state,
          zipCode: parseInt(accountInfo.zipCode),
          country: accountInfo.country,
        },
        school: {
          name: accountInfo.school,
          address: {
            addressLine1: accountInfo.streetName,
            city: accountInfo.city,
            state: accountInfo.state,
            zipCode: parseInt(accountInfo.zipCode),
            country: accountInfo.country,
          },
          gpa: 4.5,
          gradYear: 2026,
        },
        joinedSwaligaDate: moment()
          .subtract(accountInfo.yearsInSwaliga, "years")
          .toISOString(),
        id: newSwaligaID,
        ethnicity: Object.keys(accountInfo.raceEthnicity).filter(
          (key) => accountInfo.raceEthnicity[key as keyof RaceEthnicity]
        ),
      };

      // Save user document in Firestore
      await setDoc(doc(db, "users", userUid), user);

      // Update metadata with new SwaligaID
      await setDoc(doc(db, "metadata", "nextUserId"), {
        nextUserId: newSwaligaID,
      });

      // Set role to STUDENT via API
      await fetch("/api/auth/claims/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userUid }), // Send user UID to set STUDENT role
      });

      // Refresh token after role update
      await auth.currentUser?.getIdToken(true);

      // Redirect to student dashboard after successful account creation
      router.push("/student-dashboard");
    } catch (error) {
      console.error("Error during account creation");
      setFormError("Unexpected error occurred");
    }
  };

  const [bdayError, setBdayError] = useState("");
  const [gradError, setGradError] = useState("");
  const [yearsInSwaligaError, setYearsInSwaligaError] = useState("");

  const addEmergencyContact = () => {
    setAccountInfo((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        {
          name: "",
          email: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      ],
    }));
  };

  const deleteEmergencyContact = (index: number) => {
    setAccountInfo((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleEmergencyContactChange = (
    index: number,
    field: keyof AccountInfo["emergencyContacts"][0],
    value: string
  ) => {
    const updatedContacts = [...accountInfo.emergencyContacts];

    // Only allow letters and spaces
    if (
      (field === "name" || field === "city" || field === "state") &&
      value !== "" &&
      !/^[A-Za-z\s]*$/.test(value)
    ) {
      return; // Invalid input, do not update state
    }

    // Only allow digits
    if (
      (field === "phone" || field === "zip") &&
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      return; // Invalid input, do not update state
    }

    // Update the specified contact field with the new value
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };

    // Update the state with the new contacts array
    setAccountInfo((prev) => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      (name === "phoneNumber" || name === "zipCode") &&
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      // If input is not numeric, prevent the update
      return;
    }

    if (name === "yearsInSwaliga" && value !== "" && !/^\d+$/.test(value)) {
      return; // Only allow numeric input
    }

    if (
      (name === "city" ||
        name === "state" ||
        name === "firstName" ||
        name === "middleName" ||
        name === "lastName") &&
      value !== "" &&
      !/^[A-Za-z ]*$/.test(value)
    ) {
      // If input is not text, prevent the update
      return;
    }

    if (name === "bday") {
      const regex = /^\d{4}\/\d{2}\/\d{2}$/; // Matches YYYY/MM/DD format
      if (!regex.test(value)) {
        setBdayError("Birthday must be in YYYY/MM/DD format");
      } else {
        setBdayError(""); // Clear error if format is correct
      }
    }

    if (name === "grad") {
      const regex = /^\d{4}$/; // Matches YYYY format
      if (!regex.test(value)) {
        setGradError("Graduation year must be in YYYY format");
      } else {
        setGradError(""); // Clear error if format is correct
      }
    }

    setAccountInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <form className={styles.accountForm} onSubmit={handleSubmit}>
          {/* Fields for Name on School Record */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Name on School Record{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputRow}>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-address-card"></i>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First"
                    value={accountInfo.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-address-card"></i>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Middle"
                    value={accountInfo.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-address-card"></i>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last"
                    value={accountInfo.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fields for Personal Info */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Personal Info <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputRow}>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={accountInfo.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={accountInfo.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-venus-mars"></i>
                  <input
                    type="text"
                    name="gender"
                    placeholder="Enter gender"
                    value={accountInfo.gender}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Birthdate */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label style={{ color: bdayError ? "red" : "inherit" }}>
                Birthdate <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div
                className={`${styles.inputIconGroup} ${
                  bdayError ? styles.inputError : ""
                }`}
              >
                <i
                  className={`${styles.inputIconGroup} ${
                    bdayError ? styles.inputError : ""
                  }`}
                ></i>
                <input
                  type="text"
                  name="bday"
                  placeholder="YYYY/MM/DD"
                  value={accountInfo.bday}
                  onChange={handleChange}
                />
                <i className="fas fa-birthday-cake"></i>
              </div>
              {bdayError && (
                <div className={styles.passwordError}>{bdayError}</div>
              )}
            </div>
          </div>

          {/* Fields for Emergency Contact Info */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Emergency Contact Info{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              {accountInfo.emergencyContacts.map((contact, index) => (
                <div className={styles.contactContainer} key={index}>
                  <div className={styles.inputRow}>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-user"></i>
                      <input
                        type="name"
                        name={`emergencyName${index}`}
                        placeholder="Enter name"
                        value={contact.name}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        name={`emergencyEmail${index}`}
                        placeholder="Enter email"
                        value={contact.email}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "email",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-phone"></i>
                      <input
                        type="tel"
                        name={`emergencyPhone${index}`}
                        placeholder="Enter phone number"
                        value={contact.phone}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-road"></i>
                      <input
                        type="text"
                        name={`emergencyStreet${index}`}
                        placeholder="Enter street name"
                        value={contact.street}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "street",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-city"></i>
                      <input
                        type="text"
                        name={`emergencyCity${index}`}
                        placeholder="Enter city"
                        value={contact.city}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "city",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-landmark"></i>
                      <input
                        type="text"
                        name={`emergencyState${index}`}
                        placeholder="Enter state"
                        value={contact.state}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "state",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-flag"></i>{" "}
                      <input
                        type="text"
                        name={`emergencyCountry${index}`}
                        placeholder="Enter country"
                        value={contact.country}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "country",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <i className="fas fa-map-pin"></i>
                      <input
                        type="text"
                        name={`emergencyZip${index}`}
                        placeholder="Enter zip code"
                        value={contact.zip}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "zip",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    className={styles.emergencyRemoveButton}
                    type="button"
                    onClick={() => deleteEmergencyContact(index)}
                  >
                    Remove Contact
                  </button>
                </div>
              ))}
              <button
                className={styles.emergencyAddButton}
                type="button"
                onClick={addEmergencyContact}
              >
                Add Emergency Contact
              </button>
            </div>
          </div>

          {/* Address Fields */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Home Address <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputRow}>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-road"></i>
                  <input
                    type="text"
                    name="streetName"
                    placeholder="Street Name"
                    value={accountInfo.streetName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-city"></i>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={accountInfo.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-landmark"></i>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={accountInfo.state}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-flag"></i>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={accountInfo.country}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <i className="fas fa-map-pin"></i>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={accountInfo.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* School field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                What school do you go to?{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputIconGroup}>
                <i className="fas fa-school"></i>
                <input
                  type="text"
                  name="school"
                  placeholder="Enter your school"
                  value={accountInfo.school}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Year you graduate field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label style={{ color: gradError ? "red" : "inherit" }}>
                What year do you plan to graduate?{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div
                className={`${styles.inputIconGroup} ${
                  gradError ? styles.inputError : ""
                }`}
              >
                <i
                  className={`${styles.inputIconGroup} ${
                    gradError ? styles.inputError : ""
                  }`}
                ></i>
                <input
                  type="text"
                  name="grad"
                  placeholder="YYYY"
                  value={accountInfo.grad}
                  onChange={handleChange}
                />
                <i className="fas fa-graduation-cap"></i>
              </div>
              {gradError && (
                <div className={styles.passwordError}>{gradError}</div>
              )}
            </div>
          </div>

          {/* Years in Swaliga field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label style={{ color: yearsInSwaligaError ? "red" : "inherit" }}>
                How many years have you been in the Swaliga STEM club at HSRA{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div
                className={`${styles.inputIconGroup} ${
                  yearsInSwaligaError ? styles.inputError : ""
                }`}
              >
                <i
                  className={`${styles.inputIconGroup} ${
                    yearsInSwaligaError ? styles.inputError : ""
                  }`}
                ></i>
                <input
                  type="text"
                  name="yearsInSwaliga"
                  placeholder="Number of years"
                  value={accountInfo.yearsInSwaliga}
                  onChange={handleChange}
                />
                <i className="fas fa-flask"></i>
              </div>
              {yearsInSwaligaError && (
                <div className={styles.passwordError}>
                  {yearsInSwaligaError}
                </div>
              )}
            </div>
          </div>

          {/* Ethnicity field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                What race/ethnicity do you identify as? (Select all that apply){" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.checkboxContainer}>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="blackOrAfricanAmerican"
                    name="blackOrAfricanAmerican"
                    checked={accountInfo.raceEthnicity.blackOrAfricanAmerican}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="blackOrAfricanAmerican">
                    Black or African American
                  </label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="indigenous"
                    name="indigenous"
                    checked={accountInfo.raceEthnicity.indigenous}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="indigenous">Indigenous</label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="asian"
                    name="asian"
                    checked={accountInfo.raceEthnicity.asian}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="asian">Asian</label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="white"
                    name="white"
                    checked={accountInfo.raceEthnicity.white}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="white">White</label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="multiracial"
                    name="multiracial"
                    checked={accountInfo.raceEthnicity.multiracial}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="multiracial">Multiracial</label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="latin"
                    name="latin"
                    checked={accountInfo.raceEthnicity.latin}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="latin">LatinX/Latina/Latino</label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="other"
                    name="other"
                    checked={accountInfo.raceEthnicity.other}
                    onChange={handleRaceEthnicityChange}
                  />
                  <label htmlFor="other">Other</label>
                  <input
                    type="text"
                    id="otherText"
                    name="otherText"
                    placeholder="Please specify"
                    value={accountInfo.raceEthnicity.otherText}
                    disabled={!accountInfo.raceEthnicity.other}
                    onChange={handleOtherTextChange}
                    className={styles.otherTextInput}
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
        {formError && <p className={styles.errorText}>{formError}</p>}
        <button
          className={styles.backToLoginButton}
          onClick={() => router.push("/")}
        >
          <Image
            src={logoutIcon}
            alt="Logout Icon"
            className={styles.logout}
            onClick={async () => {
              await logOut();
              router.refresh();
            }}
          />
        </button>
      </div>
    </div>
  );
}
