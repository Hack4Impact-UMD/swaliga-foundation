"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { User } from "@/types/user-types";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/lib/firebase/authentication/googleAuthentication";
import { updateAccount } from "@/lib/firebase/database/users";

export default function Settings() {
  const [currUser, setCurrUser] = useState<User>();
  const [first, setFirstName] = useState<string>("");
  const [last, setLastName] = useState<string>("");
  const [newEmail, setEmail] = useState<string>("");
  const [phoneNumber, setPhone] = useState<number>(0);
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<number>(0);
  const [newGradYear, setGradYear] = useState<number>(0);
  const [yearsSwaliga, setYearsSwaliga] = useState<number>(0);
  const [disabled, isDisabled] = useState(true);
  const [fGuardianFirst, setFGuardianFirst] = useState<string>("");
  const [fGuardianLast, setFGuardianLast] = useState<string>("");
  const [fGuardianEmail, setFGuardianEmail] = useState<string>("");
  const [fGuardianPhone, setFGuardianPhone] = useState<number>(0);
  const [fGuardianStreet, setFGuardianStreet] = useState<string>("");
  const [fGuardianCity, setFGuardianCity] = useState<string>("");
  const [fGuardianState, setFGuardianState] = useState<string>("");
  const [fGuardianZip, setFGuardianZip] = useState<number>(0);
  const [SGuardianFirst, setSGuardianFirst] = useState<string>("");
  const [SGuardianLast, setSGuardianLast] = useState<string>("");
  const [SGuardianEmail, setSGuardianEmail] = useState<string>("");
  const [SGuardianPhone, setSGuardianPhone] = useState<number>(0);
  const [SGuardianStreet, setSGuardianStreet] = useState<string>("");
  const [SGuardianCity, setSGuardianCity] = useState<string>("");
  const [SGuardianState, setSGuardianState] = useState<string>("");
  const [SGuardianZip, setSGuardianZip] = useState<number>(0);

  const q = query(collection(db, "users"), where("id", "==", currUser!.id));
  useEffect(() => {
    const fetchCurrUser = async (id: string) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User is not authenticated.");
        }

        const userRef = doc(db, "users", id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrUser(userData);
          console.log(userData.firstName);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setPhone(userData.phone);
          setStreet(userData.address.street);
          setCity(userData.address.city);
          setState(userData.address.state);
          setZip(userData.address.zip);
          setGradYear(userData.gradYear);
          setYearsSwaliga(userData.yearsWithSwaliga);

          if (userData.guardian && userData.guardian.length > 0) {
            setFGuardianFirst(userData.guardian[0]?.firstName || "");
            setFGuardianLast(userData.guardian[0]?.lastName || "");
            setFGuardianEmail(userData.guardian[0]?.email || "");
            setFGuardianPhone(userData.guardian[0]?.phone || 0);
            setFGuardianStreet(userData.guardian[0]?.address.street || "");
            setFGuardianCity(userData.guardian[0]?.address.city || "");
            setFGuardianState(userData.guardian[0]?.address.state || "");
            setFGuardianZip(userData.guardian[0]?.address.zip || 0);

            setSGuardianFirst(userData.guardian[1]?.firstName || "");
            setSGuardianLast(userData.guardian[1]?.lastName || "");
            setSGuardianEmail(userData.guardian[1]?.email || "");
            setSGuardianPhone(userData.guardian[1]?.phone || 0);
            setSGuardianStreet(userData.guardian[1]?.address.street || "");
            setSGuardianCity(userData.guardian[1]?.address.city || "");
            setSGuardianState(userData.guardian[1]?.address.state || "");
            setSGuardianZip(userData.guardian[1]?.address.zip || 0);
          }
        } else {
          console.log("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchCurrUser(currUser!.id);
  });

  function handleLogout() {
    handleHome();
    logOut();
  }

  function handleCancel() {
    setFirstName(currUser!.firstName);
    setLastName(currUser!.lastName);
    setEmail(currUser!.email);
    setPhone(currUser!.phone);
    setGradYear(currUser!.gradYear);
    setStreet(currUser!.address.street);
    setCity(currUser!.address.city);
    setState(currUser!.address.state);
    setZip(currUser!.address.zip);

    isDisabled(true);
  }

  async function handleSaveChanges() {
    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = {
          firstName: first,
          lastName: last,
          email: newEmail,
          phone: phoneNumber,
          yearsWithSwaliga: yearsSwaliga,
          gradYear: newGradYear,
          address: {
            street: street,
            city: city,
            state: state,
          },
          guardian: [
            {
              firstName: fGuardianFirst,
              lastName: fGuardianLast,
              email: fGuardianEmail,
              phone: fGuardianPhone,
              address: {
                street: fGuardianStreet,
                city: fGuardianCity,
                state: fGuardianState,
                zip: fGuardianZip,
              },
            },
            {
              firstName: SGuardianFirst,
              lastName: SGuardianLast,
              email: SGuardianEmail,
              phone: SGuardianPhone,
              address: {
                street: SGuardianStreet,
                city: SGuardianCity,
                state: SGuardianState,
                zip: SGuardianZip,
              },
            },
          ],
        };

        const docSnapshot = querySnapshot.docs[0];
        await updateAccount(docSnapshot.id, userData);
        console.log("User data updated successfully");
      } else {
        console.log("No matching documents found");
      }
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
            width="250"
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
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || first}
                onChange={(event) => setFirstName(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || last}
                onChange={(event) => setLastName(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || newEmail}
                onChange={(event) => setEmail(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || phoneNumber}
                onChange={(event) => setPhone(parseInt(event.target.value))}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || street}
                onChange={(event) => setStreet(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || city}
                onChange={(event) => setCity(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || state}
                onChange={(event) => setState(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || zip}
                onChange={(event) => setZip(Number(event.target.value))}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || newGradYear}
                onChange={(event) => setGradYear(parseInt(event.target.value))}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || yearsSwaliga}
                onChange={(event) =>
                  setYearsSwaliga(parseInt(event.target.value))
                }
                disabled={disabled}
              />
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
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianFirst}
                onChange={(event) => setFGuardianFirst(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianLast}
                onChange={(event) => setFGuardianLast(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianEmail}
                onChange={(event) => setFGuardianEmail(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianPhone}
                onChange={(event) =>
                  setFGuardianPhone(parseInt(event.target.value))
                }
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianStreet}
                onChange={(event) => setFGuardianStreet(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianCity}
                onChange={(event) => setFGuardianCity(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianState}
                onChange={(event) => setFGuardianState(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || fGuardianZip}
                onChange={(event) =>
                  setFGuardianZip(parseInt(event.target.value))
                }
                disabled={disabled}
              />
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
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianFirst}
                onChange={(event) => setSGuardianFirst(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianLast}
                onChange={(event) => setSGuardianLast(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianEmail}
                onChange={(event) => setSGuardianEmail(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianPhone}
                onChange={(event) =>
                  setSGuardianPhone(parseInt(event.target.value))
                }
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianStreet}
                onChange={(event) => setSGuardianStreet(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianCity}
                onChange={(event) => setSGuardianCity(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianState}
                onChange={(event) => setSGuardianState(event.target.value)}
                disabled={disabled}
              />
              <button
                className={styles.editBtn}
                onClick={() => isDisabled(false)}
              >
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                value={"" || SGuardianZip}
                onChange={(event) =>
                  setSGuardianZip(parseInt(event.target.value))
                }
                disabled={disabled}
              />
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
