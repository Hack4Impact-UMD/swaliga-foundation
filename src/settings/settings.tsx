"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { User } from "@/types/user-types";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/lib/firebase/authentication/googleAuthentication";
import { getAccountById, updateAccount } from "@/lib/firebase/database/users";

export default function Settings() {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [userState, setUserState] = useState<User>({
    isAdmin: false,
    firstName: "",
    lastName: "",
    middleName: "",
    address: { street: "", city: "", state: "", zip: 0, country: "" },
    school: "",
    birthdate: new Date(),
    gradYear: 0,
    email: "",
    phone: 0,
    yearsWithSwaliga: 0,
    ethnicity: "Black or African American",
    gender: "Male",
    guardian: [
      {
        firstName: "",
        lastName: "",
        address: { street: "", city: "", state: "", zip: 0, country: "" },
        email: "",
        phone: 0,
      },
      {
        firstName: "",
        lastName: "",
        address: { street: "", city: "", state: "", zip: 0, country: "" },
        email: "",
        phone: 0,
      },
    ],
    password: "",
    id: "",
    assignedSurveys: [],
    completedResponses: [],
  });
  const [disabled, isDisabled] = useState(true);
  /* //User data test
  const userTest: User = {
    isAdmin: false,
    firstName: "Jane",
    lastName: "Doe",
    address: {
      street: "1234 Example Drive",
      city: "Bethesda",
      state: "MD",
      zip: 21114,
      country: "United States",
    },
    school: "",
    birthdate: new Date(),
    gradYear: 2025,
    email: "janedoe12345@gmail.com",
    phone: 4435125555,
    yearsWithSwaliga: 2,
    ethnicity: "Pacific Islander",
    gender: "Female",
    password: "1234abc",
    id: "0000001",
    assignedSurveys: [],
    completedResponses: [],
    guardian: [
      {
        firstName: "Paul",
        lastName: "Doe",
        phone: 4436511901,
        email: "pauldoe123@gmail.com",
        address: {
          street: "1234 Example DR",
          city: "Bethesda",
          zip: 21145,
          state: "MD",
          country: "United States",
        },
      },
      {
        firstName: "Janice",
        lastName: "Doe",
        phone: 4436511921,
        email: "janicedoe1111@gmail.com",
        address: {
          street: "1234 Example DR",
          city: "Bethesda",
          zip: 21145,
          state: "MD",
          country: "United States",
        },
      },
    ],
  };
  */

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      fetchCurrUser(user.uid);
    } else {
      throw new Error("User not authenticated");
    }
    //fetchCurrUser(userTest.id) //uncomment to test
  }, []);

  const fetchCurrUser = async (id: string) => {
    try {
      const userData = await getAccountById(id);
      setCurrUser(userData);
      setUserState({
        ...userData,
      });
     
      // Uncomment to test
      // setCurrUser(userTest);
      // setUserState({ ...userTest });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  function handleLogout() {
    handleHome();
    logOut();
  }

  function handleCancel() {
    setUserState(currUser!);
    isDisabled(true);
  }

  async function handleSaveChanges() {
    try {
      await updateAccount(userState.id, userState);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }

  function handleHome() {
    <Link href="/"></Link>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.nav}>
          <Image
            src="/swaliga-website-logo.png"
            alt="swaliga logo"
            id="logo"
            width="200"
            height="35"
            className={styles.image}
          />
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <p className={styles.link}>Student ID: {currUser?.id}</p>
          <Link href="/settings" className={styles.link}>
            Settings
          </Link>
        </div>
        <Link href="/" className={styles.link} onClick={handleLogout}>
          Log Out
        </Link>
      </div>

      <div className={styles.rightPane}>
        <div className={styles.headSection}>
          <h1 className={styles.settingsHeader}>Settings</h1>
          <hr id="hr"></hr>
        </div>

        <div className={styles.subContainer}>
          <div className={styles.settingsContainer}>
            <div className={styles.headerContainer}>
              <h1 className={styles.sectionHeader}>Student Information</h1>
              <hr id="hr"></hr>
            </div>
            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>First Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.firstName}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      firstName: event.target.value,
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Last Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.lastName}
                  onChange={(event) =>
                    setUserState({ ...userState, lastName: event.target.value })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Email</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.email}
                  onChange={(event) =>
                    setUserState({ ...userState, email: event.target.value })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Phone Number</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.phone}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      phone: Number(event.target.value),
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Street</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.address.street}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      address: {
                        ...userState.address,
                        street: event.target.value,
                      },
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>City</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.address.city}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      address: {
                        ...userState.address,
                        city: event.target.value,
                      },
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>State</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.address.state}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      address: {
                        ...userState.address,
                        state: event.target.value,
                      },
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Zipcode</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.address.zip}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      address: {
                        ...userState.address,
                        zip: Number(event.target.value),
                      },
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Graduation Year</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.gradYear}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      gradYear: Number(event.target.value),
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}># of Years in Swaliga</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.yearsWithSwaliga}
                  onChange={(event) =>
                    setUserState({
                      ...userState,
                      yearsWithSwaliga: Number(event.target.value),
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.headerContainer}>
              <h2 className={styles.sectionHeader}>
                Emergency Contact #1 Information
              </h2>
              <hr id="hr"></hr>
            </div>
            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>First Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[0]?.firstName : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      firstName: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Last Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[0]?.lastName : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      lastName: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Email</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.guardian ? userState.guardian[0]?.email : ""}
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      email: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Phone Number</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.guardian ? userState.guardian[0]?.phone : ""}
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      phone: Number(event.target.value),
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Street</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[0]?.address.street
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      address: {
                        ...updatedGuardian[0]?.address,
                        street: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>City</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[0]?.address.city
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      address: {
                        ...updatedGuardian[0]?.address,
                        city: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>State</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[0]?.address.state
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      address: {
                        ...updatedGuardian[0]?.address,
                        state: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Zip</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[0]?.address.zip : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[0] = {
                      ...updatedGuardian[0],
                      address: {
                        ...updatedGuardian[0]?.address,
                        zip: Number(event.target.value),
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.headerContainer}>
              <h2 className={styles.sectionHeader}>
                Emergency Contact #2 Information
              </h2>
              <hr id="hr"></hr>
            </div>
            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>First Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[1]?.firstName : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      firstName: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Last Name</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[1]?.lastName : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      lastName: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Email</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.guardian ? userState.guardian[1]?.email : ""}
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      email: event.target.value,
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Phone Number</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={userState.guardian ? userState.guardian[1]?.phone : ""}
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      phone: Number(event.target.value),
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Street</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[1]?.address.street
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      address: {
                        ...updatedGuardian[1]?.address,
                        street: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>City</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[1]?.address.city
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      address: {
                        ...updatedGuardian[1]?.address,
                        city: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>State</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian
                      ? userState.guardian[1]?.address.state
                      : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      address: {
                        ...updatedGuardian[1]?.address,
                        state: event.target.value,
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <div className={styles.field}>
                <p className={styles.fieldName}>Zipcode</p>
                <input
                  type="text"
                  className={styles.inputContainer}
                  value={
                    userState.guardian ? userState.guardian[1]?.address.zip : ""
                  }
                  onChange={(event) => {
                    const updatedGuardian = userState.guardian
                      ? [...userState.guardian]
                      : [];
                    updatedGuardian[1] = {
                      ...updatedGuardian[1],
                      address: {
                        ...updatedGuardian[1]?.address,
                        zip: Number(event.target.value),
                      },
                    };
                    setUserState({
                      ...userState,
                      guardian: updatedGuardian,
                    });
                  }}
                  disabled={disabled}
                />
              </div>
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>
          </div>

          <div className={styles.btnsContainer}>
            <button onClick={handleHome}>&larr; Back to Home</button>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}