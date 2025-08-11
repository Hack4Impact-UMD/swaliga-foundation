"use client";
import React, {
  useState,
  ChangeEvent,
  cloneElement,
  HTMLAttributes,
} from "react";
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
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoutIcon from "@/../public/icons/logout.svg";
import { logOut } from "@/features/auth/authN/googleAuthN";
import useAuth from "@/features/auth/useAuth";
import {
  FaAddressCard,
  FaBirthdayCake,
  FaCalendar,
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
  const [gpa, setGPA] = useState<string>("");
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
          <label className={styles.sectionHeader}>Student Information</label>
          <div className={styles.row}>
            <CreateAccountTextField
              name="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              icon={<FaAddressCard />}
            />
            <CreateAccountTextField
              name="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              icon={<FaAddressCard />}
            />
            <CreateAccountTextField
              name="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              icon={<FaAddressCard />}
            />
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              type="email"
              name="Email"
              value={auth.user!.email || ""}
              required
              disabled
              icon={<FaEnvelope />}
            />
            <CreateAccountTextField
              type="tel"
              name="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<FaPhone />}
            />
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="Date of Birth"
              placeholder="YYYY/MM/DD"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              icon={<FaBirthdayCake />}
            />
            <CreateAccountTextField
              name="Approximately when did you join the Swaliga Foundation?"
              placeholder="YYYY/MM/DD"
              value={joinedSwaligaDate}
              onChange={(e) => setJoinedSwaligaDate(e.target.value)}
              required
              icon={<FaCalendar />}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>
                Gender <span className={styles.requiredAsterisk}>*</span>
              </label>
              <div className={styles.inputField}>
                <FaVenusMars className={styles.inputIcon} />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                >
                  {genderValues.map((gender) => (
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
          <label>{`What race/ethnicity do you identify as? (Select all that apply)`}</label>
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
            <CreateAccountTextField
              name="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              icon={<FaHouse />}
            />
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="Address Line 2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              icon={<FaHouse />}
            />
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              icon={<FaCity />}
            />
            <CreateAccountTextField
              name="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              icon={<FaLandmark />}
            />
            <CreateAccountTextField
              name="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              icon={<FaFlag />}
            />
            <CreateAccountTextField
              name="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              icon={<FaMapPin />}
            />
          </div>

          <label className={styles.sectionHeader}>School Information</label>
          <div className={styles.row}>
            <CreateAccountTextField
              name="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              icon={<FaSchool />}
            />
            <CreateAccountTextField
              name="Graduation Year"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              required
              icon={<FaGraduationCap />}
            />
            <CreateAccountTextField
              name="GPA"
              value={gpa}
              onChange={(e) => setGPA(e.target.value)}
              required
              icon={<FaGraduationCap />}
            />
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="School Address Line 1"
              value={schoolAddressLine1}
              onChange={(e) => setSchoolAddressLine1(e.target.value)}
              required
              icon={<FaHouse />}
            />{" "}
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="School Address Line 2"
              value={schoolAddressLine2}
              onChange={(e) => setSchoolAddressLine1(e.target.value)}
              icon={<FaHouse />}
            />{" "}
          </div>
          <div className={styles.row}>
            <CreateAccountTextField
              name="School City"
              value={schoolCity}
              onChange={(e) => setSchoolCity(e.target.value)}
              required
              icon={<FaCity />}
            />
            <CreateAccountTextField
              name="School State"
              value={schoolState}
              onChange={(e) => setSchoolState(e.target.value)}
              required
              icon={<FaLandmark />}
            />
            <CreateAccountTextField
              name="School Country"
              value={schoolCountry}
              onChange={(e) => setSchoolCountry(e.target.value)}
              required
              icon={<FaFlag />}
            />
            <CreateAccountTextField
              name="School Zip Code"
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
                <button
                  className={styles.emergencyRemoveButton}
                  type="button"
                  onClick={() => deleteEmergencyContact(index)}
                >
                  Remove Contact
                </button>
              </div>

              <div className={styles.row}>
                <CreateAccountTextField
                  name="First Name"
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
                <CreateAccountTextField
                  name="Middle Name"
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
                <CreateAccountTextField
                  name="Last Name"
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
                <CreateAccountTextField
                  name="Email"
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
                <CreateAccountTextField
                  name="Phone Number"
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
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
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
                    {genderValues.map((gender) => (
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
                <div className={styles.inputGroup}>
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
                    {guardianRelationshipValues.map((relationship) => (
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
            </>
          ))}
          <button
            className={styles.emergencyAddButton}
            type="button"
            onClick={addEmergencyContact}
          >
            Add Emergency Contact
          </button>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
        {formError && <p className={styles.errorText}>{formError}</p>}
      </div>
    </div>
  );
}

interface CreateAccountTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: JSX.Element;
}

function CreateAccountTextField(props: CreateAccountTextFieldProps) {
  const {
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    icon,
  } = props;
  const placeholder = props.placeholder || name;
  return (
    <div className={styles.inputGroup}>
      <label>
        {name}
        {required && (
          <>
            {" "}
            <span className={styles.requiredAsterisk}>*</span>
          </>
        )}
      </label>
      <div className={styles.inputField}>
        {cloneElement(icon, { className: styles.inputIcon })}
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

interface CreateAccountCheckboxProps {
  label: string;
  values: string[];
  checkedValues: string[];
  includeOther?: boolean;
}

function CreateAccountCheckbox(props: CreateAccountCheckboxProps) {}
