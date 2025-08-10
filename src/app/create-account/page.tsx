"use client";
import React, { useState, ChangeEvent } from "react";
import styles from "./CreateAccountPage.module.css";
import {
  ethnicities,
  Ethnicity,
  Gender,
  genders,
  GuardianRelationship,
  Student,
} from "@/types/user-types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoutIcon from "@/../public/icons/logout.svg";
import { logOut } from "@/features/auth/authN/googleAuthN";
import useAuth from "@/features/auth/useAuth";
import {
  FaAddressCard,
  FaBirthdayCake,
  FaCity,
  FaEnvelope,
  FaFlag,
  FaFlask,
  FaGraduationCap,
  FaLandmark,
  FaMapPin,
  FaPhone,
  FaSchool,
  FaVenusMars,
} from "react-icons/fa";
import { RiParentFill } from "react-icons/ri";
import { FaHouse } from "react-icons/fa6";

export default function CreateAccountPage() {
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // student info fields
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<Gender | undefined>(undefined);
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
  const [guardianFirstNames, setGuardianFirstNames] = useState<string[]>([]);
  const [guardianMiddleNames, setGuardianMiddleNames] = useState<string[]>([]);
  const [guardianLastNames, setGuardianLastNames] = useState<string[]>([]);
  const [guardianGenders, setGuardianGenders] = useState<
    (Gender | undefined)[]
  >([]);
  const [guardianGenderOtherTexts, setGuardianGenderOtherTexts] = useState<
    string[]
  >([]);
  const [guardianEmails, setGuardianEmails] = useState<string[]>([]);
  const [guardianPhones, setGuardianPhones] = useState<string[]>([]);
  const [guardianRelationships, setGuardianRelationships] = useState<
    (GuardianRelationship | undefined)[]
  >([]);
  const [guardianRelationshipOtherTexts, setGuardianRelationshipOtherTexts] =
    useState<string[]>([]);

  // school fields
  const [schoolName, setSchoolName] = useState<string>("");
  const [gradYear, setGradYear] = useState<string>("");
  const [gpa, setGpa] = useState<string>("");
  const [schoolAddressLine1, setSchoolAddressLine1] = useState<string>("");
  const [schoolAddressLine2, setSchoolAddressLine2] = useState<string>("");
  const [schoolCity, setSchoolCity] = useState<string>("");
  const [schoolState, setSchoolState] = useState<string>("");
  const [schoolCountry, setSchoolCountry] = useState<string>("");
  const [schoolZipCode, setSchoolZipCode] = useState<string>("");

  const auth = useAuth();

  const addEmergencyContact = () => {
    setGuardianFirstNames((prev) => [...prev, ""]);
    setGuardianMiddleNames((prev) => [...prev, ""]);
    setGuardianLastNames((prev) => [...prev, ""]);
    setGuardianGenders((prev) => [...prev, undefined]);
    setGuardianGenderOtherTexts((prev) => [...prev, ""]);
    setGuardianEmails((prev) => [...prev, ""]);
    setGuardianPhones((prev) => [...prev, ""]);
    setGuardianRelationships((prev) => [...prev, undefined]);
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

  const handleSubmit = async () => {};

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
                  <FaAddressCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaAddressCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Middle"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaAddressCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={auth.user!.email || ""}
                    disabled
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaVenusMars className={styles.inputIcon} />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {gender === "Other" && (
                    <input
                      type="text"
                      id="genderOtherText"
                      name="genderOtherText"
                      placeholder="Please specify"
                      value={genderOtherText}
                      disabled={gender !== "Other"}
                      onChange={(e) => setGenderOtherText(e.target.value)}
                      className={styles.otherTextInput}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Birthdate */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Birthdate <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputIconGroup}>
                <FaBirthdayCake className={styles.inputIcon} />
                <input
                  type="text"
                  name="bday"
                  placeholder="YYYY/MM/DD"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Fields for Parent/Guardian Info */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Emergency Contact Info{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              {guardianEmails.map((email, index) => (
                <div className={styles.contactContainer} key={index}>
                  <div className={styles.inputRow}>
                    <div className={styles.inputIconGroup}>
                      <FaAddressCard className={styles.inputIcon} />
                      <input
                        type="name"
                        name={`guardianFirstName${index}`}
                        placeholder="Enter first name"
                        value={guardianFirstNames[index]}
                        onChange={(e) =>
                          setGuardianFirstNames((prev) =>
                            prev.map((name, i) =>
                              i === index ? e.target.value : name
                            )
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <FaAddressCard className={styles.inputIcon} />
                      <input
                        type="name"
                        name={`guardianMiddleName${index}`}
                        placeholder="Enter middle name"
                        value={guardianMiddleNames[index]}
                        onChange={(e) =>
                          setGuardianMiddleNames((prev) =>
                            prev.map((name, i) =>
                              i === index ? e.target.value : name
                            )
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <FaAddressCard className={styles.inputIcon} />
                      <input
                        type="name"
                        name={`guardianLastName${index}`}
                        placeholder="Enter last name"
                        value={guardianLastNames[index]}
                        onChange={(e) =>
                          setGuardianLastNames((prev) =>
                            prev.map((name, i) =>
                              i === index ? e.target.value : name
                            )
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <FaEnvelope className={styles.inputIcon} />
                      <input
                        type="email"
                        name={`guardianEmail${index}`}
                        placeholder="Enter email"
                        value={guardianEmails[index]}
                        onChange={(e) =>
                          setGuardianEmails((prev) =>
                            prev.map((email, i) =>
                              i === index ? e.target.value : email
                            )
                          )
                        }
                      />
                    </div>
                    <div className={styles.inputIconGroup}>
                      <FaPhone className={styles.inputIcon} />
                      <input
                        type="tel"
                        name={`guardianPhone${index}`}
                        placeholder="Enter phone number"
                        value={guardianPhones[index]}
                        onChange={(e) =>
                          setGuardianPhones((prev) =>
                            prev.map((phone, i) =>
                              i === index ? e.target.value : phone
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputIconGroup}>
                      <FaVenusMars className={styles.inputIcon} />
                      <select
                        value={guardianGenders[index]}
                        onChange={(e) =>
                          setGuardianGenders((prev) =>
                            prev.map((gender, i) =>
                              i === index ? (e.target.value as Gender) : gender
                            )
                          )
                        }
                      >
                        {genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                      {guardianGenders[index] === "Other" && (
                        <input
                          type="text"
                          id={`guardianGenderOtherText${index}`}
                          name={`guardianGenderOtherText${index}`}
                          placeholder="Please specify"
                          value={guardianGenderOtherTexts[index]}
                          disabled={guardianGenders[index] !== "Other"}
                          onChange={(e) =>
                            setGuardianGenderOtherTexts((prev) =>
                              prev.map((text, i) =>
                                i === index ? e.target.value : text
                              )
                            )
                          }
                          className={styles.otherTextInput}
                        />
                      )}
                    </div>
                    <div className={styles.inputIconGroup}>
                      <RiParentFill className={styles.inputIcon} />
                      <select
                        value={guardianRelationships[index]}
                        onChange={(e) =>
                          setGuardianRelationships((prev) =>
                            prev.map((relationship, i) =>
                              i === index
                                ? (e.target.value as GuardianRelationship)
                                : relationship
                            )
                          )
                        }
                      >
                        {guardianRelationships.map((relationship) => (
                          <option key={relationship} value={relationship}>
                            {relationship}
                          </option>
                        ))}
                      </select>
                      {guardianRelationships[index] === "Other" && (
                        <input
                          type="text"
                          id={`guardianRelationshipOtherText${index}`}
                          name={`guardianRelationshipOtherText${index}`}
                          placeholder="Please specify"
                          value={guardianRelationshipOtherTexts[index]}
                          disabled={guardianRelationships[index] !== "Other"}
                          onChange={(e) =>
                            setGuardianRelationshipOtherTexts((prev) =>
                              prev.map((text, i) =>
                                i === index ? e.target.value : text
                              )
                            )
                          }
                          className={styles.otherTextInput}
                        />
                      )}
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
                  <FaHouse className={styles.inputIcon} />
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaHouse className={styles.inputIcon} />
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Address Line 2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaCity className={styles.inputIcon} />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaLandmark className={styles.inputIcon} />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaFlag className={styles.inputIcon} />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className={styles.inputIconGroup}>
                  <FaMapPin className={styles.inputIcon} />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
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
                <FaSchool className={styles.inputIcon} />
                <input
                  type="text"
                  name="school"
                  placeholder="Enter your school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Year you graduate field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                What year do you plan to graduate?{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputIconGroup}>
                <FaGraduationCap className={styles.inputIcon} />
                <input
                  type="text"
                  name="gradYear"
                  placeholder="YYYY"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Years in Swaliga field */}
          <div className={styles.formGroupRow}>
            <div className={styles.formGroup}>
              <label>
                Approximately when did you first join the Swaliga Foundation?{" "}
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputIconGroup}>
                <FaFlask className={styles.inputIcon} />
                <input
                  type="text"
                  name="joinedSwaligaDate"
                  placeholder="YYYY/MM/DD"
                  value={joinedSwaligaDate}
                  onChange={(e) => setJoinedSwaligaDate(e.target.value)}
                />
              </div>
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
                {ethnicities.map((eth) => (
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
