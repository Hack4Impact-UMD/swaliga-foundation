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
import { updateAccount } from "@/lib/firebase/database/users";

export default function Settings() {
  const [currUser, setCurrUser] = useState<User>();
  const [first, setFirstName] = useState(currUser?.firstName);
  const [last, setLastName] = useState(currUser?.lastName);
  const [newEmail, setEmail] = useState(currUser?.email);
  const [phoneNumber, setPhone] = useState(currUser?.phone);
  const [addr, setAddr] = useState(currUser?.address);
  const [newGradYear, setGradYear] = useState(currUser?.gradYear);
  const [disabled, isDisabled] = useState(true);

  const fetchCurrUser = async (id: string) => {
    const userRef = doc(db, "users", id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setCurrUser(userDoc.data() as User);
    } else {
      console.log("User does not exist");
    }
  };
  
  const q = query(collection(db, "users"), where("id", "==", currUser!.id));

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

  function handleCancel() {
    setFirstName(currUser?.firstName);
    setLastName(currUser?.lastName);
    setEmail(currUser?.email);
    setPhone(currUser?.phone);
    setGradYear(currUser?.gradYear);
    setAddr(currUser?.address);
    isDisabled(true);
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
      await updateAccount(currUser!.id, userData);

      fetch(`/api/user/${currUser!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      isDisabled(false);
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
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.lastName || "N/A"}
                onChange={(event) => setLastName(event.target.value)}
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.email || "N/A"}
                onChange={(event) => setEmail(event.target.value)}
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.phone || "N/A"}
                onChange={(event) => setPhone(parseInt(event.target.value))}
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.address || "N/A"}
                onChange={(event) => setAddr(event.target.value)}
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
                Edit
              </button>
            </div>

            <div className={styles.settingField}>
              <input
                type="text"
                className={styles.inputContainer}
                defaultValue={currUser?.gradYear || "N/A"}
                onChange={(event) => setGradYear(parseInt(event.target.value))}
                disabled={disabled}
              />
              <button className={styles.editBtn} onClick={()=>isDisabled(false)}>
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
