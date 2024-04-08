"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { User } from "@/types/user-types";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/lib/firebase/authentication/googleAuthentication";

export default function Settings() {
  const [currUser, setCurrUser] = useState<User>();
  const [first, setFirstName] = useState(currUser?.firstName);
  const [last, setLastName] = useState(currUser?.lastName);
  const [newEmail, setEmail] = useState(currUser?.email);
  const [phoneNumber, setPhone] = useState(currUser?.phone);
  const [addr, setAddr] = useState(currUser?.address);
  const [newGradYear, setGradYear] = useState(currUser?.gradYear);

  const q = query(collection(db, "users"), where("id", "==", currUser!.id));

  const fetchCurrUser = async (id: string) => {
    const userRef = doc(db, "users", id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setCurrUser(userDoc.data() as User);
    } else {
      console.log("User does not exist");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      fetchCurrUser(user.uid);
    }
  }, []);

  function handleLogout() {
    handleHome();
    logOut();
  }

  async function handleAddr() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { address: addr });

      console.log("Data with updated address: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  async function handleFirstName() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { firstName: first });

      console.log("Data with updated first name: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  async function handleLastName() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { lastName: last });

      console.log("Data with updated last name: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  async function handleEmail() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { email: newEmail });

      console.log("Data with updated email: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  async function handlePhone() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { phone: phoneNumber });

      console.log("Data with updated phone number: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  async function handleGradYear() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];
      await updateDoc(querySnapshot.ref, { gradYear: newGradYear });

      console.log("Data with updated gradYear: ", querySnapshot.data);
    } catch (error) {
      console.error(
        "Could not get user or couldn't update user's field",
        error
      );
      throw error;
    }
  }

  function handleCancel() {
    setFirstName(currUser?.firstName);
    setLastName(currUser?.lastName);
    setEmail(currUser?.email);
    setPhone(currUser?.phone);
    setGradYear(currUser?.gradYear);
    setAddr(currUser?.address);
  }

  async function handleSaveChanges() {
    try {
      const querySnapshot = (await getDocs(q)).docs[0];

      const userData = {
        firstName: first,
        lastName: last,
        email: newEmail,
        phone: phoneNumber,
        gradYear: newGradYear,
        address: addr,
      };

      await updateDoc(querySnapshot.ref, userData);

      fetch(`/api/user/${currUser!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Could not get user or couldn't execute PUT", error);
      throw error;
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
            width="300"
            height="50"
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
            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.firstName || "N/A"}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <button className={styles.editBtn} onClick={handleFirstName}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.lastName || "N/A"}
                onChange={(event) => setLastName(event.target.value)}
              />
              <button className={styles.editBtn} onClick={handleLastName}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.email || "N/A"}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button className={styles.editBtn} onClick={handleEmail}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.phone || "N/A"}
                onChange={(event) => setPhone(parseInt(event.target.value))}
              />
              <button className={styles.editBtn} onClick={handlePhone}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.address || "N/A"}
                onChange={(event) => setAddr(event.target.value)}
              />
              <button className={styles.editBtn} onClick={handleAddr}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.gradYear || "N/A"}
                onChange={(event) => setGradYear(parseInt(event.target.value))}
              />
              <button className={styles.editBtn} onClick={handleGradYear}>
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
