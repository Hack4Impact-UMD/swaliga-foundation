"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { User } from "@/types/user-types";
import { getAuth } from "firebase/auth";

export default function Settings() {
    const [currUser, setCurrUser] = useState<User>();
    const fetchCurrUser = async (id: string) => {
        const userRef = doc(db, "users", id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            setCurrUser(userDoc.data() as User);
        } else {
            console.log("User does not exist");
        }
    }

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            fetchCurrUser(user.uid);
        }
    })
    
    return (
        <div className={styles.container}>
            <div className={styles.leftPane}>
                <img src="/swaliga-website-logo.png" alt="swaliga logo" />
                <p>Home</p>
                <p>Student ID: XXX-XXX-XXXX</p>
                <div className={styles.settingsTab}>
                    <p>Settings</p>
                </div>
                <p>Log Out</p>
            </div>

            <div className={styles.rightPane}>
                <div className={styles.headSection}>
                    <h1 className={styles.settingsHeader}>Settings</h1>
                    <hr id="hr"></hr>
                </div>

                {/* Map out fields instead */}
                <div className={styles.settingsContainer}>
                    <div className={styles.settingField}>
                        <input type="text" className={styles.inputContainer}/>
                        <button className={styles.editBtn}>Edit</button>
                    </div>

                    <div className={styles.settingField}>
                        <input type="text" className={styles.inputContainer}/>
                        <button className={styles.editBtn}>Edit</button>
                    </div>
                </div>

                <div className={styles.btnsContainer}>
                    <button>Back to Home</button>
                    <button>Cancel</button>
                    <button>Save Changes</button>
                </div>
            </div>
        </div>
    )
}