"use client";
import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { User } from "@/types/user-types";
import { auth } from "@/lib/firebase/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/lib/firebase/authentication/googleAuthentication";
import { getAccountById, updateAccount } from "@/lib/firebase/database/users";
import { useRouter } from "next/navigation";

export default function Settings({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const [userData, setUserData] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    //if (user) {
      fetchCurrUser(userId);
    //} else {
    //  throw new Error("User not authenticated");
    //}
  }, []);

  const fetchCurrUser = async (id: string) => {
    try {
      const userData = await getAccountById(id);
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  function handleCancel() {
    router.push(`/student-dashboard/${userId}`);
  }

  async function handleSaveChanges() {
    try {
      await updateAccount(userData?.id as string, userData as User);
      handleCancel();
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }

  return (
    <div className={styles.container}>
      {userData && (
        <>
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
              <p className={styles.link}>Student ID: {userData?.id}</p>
              <Link href="/" className={styles.link} onClick={() => logOut()}>
                Log Out
              </Link>
            </div>
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
                      value={userData.firstName}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          firstName: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Last Name</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.lastName}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          lastName: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Email</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.email}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          email: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Phone Number</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.phone}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          phone: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Street</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.address.street}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            street: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>City</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.address.city}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            city: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>State</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.address.state}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            state: event.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Zipcode</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.address.zip}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            zip: Number(event.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Graduation Year</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.gradYear}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          gradYear: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}># of Years in Swaliga</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={userData.yearsWithSwaliga}
                      onChange={(event) =>
                        setUserData({
                          ...userData,
                          yearsWithSwaliga: Number(event.target.value),
                        })
                      }
                    />
                  </div>
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
                        userData.guardian ? userData.guardian[0]?.firstName : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          firstName: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Last Name</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[0]?.lastName : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          lastName: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Email</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[0]?.email : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          email: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Phone Number</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[0]?.phone : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          phone: Number(event.target.value),
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Street</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[0]?.address.street
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          address: {
                            ...updatedGuardian[0]?.address,
                            street: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>City</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[0]?.address.city
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          address: {
                            ...updatedGuardian[0]?.address,
                            city: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>State</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[0]?.address.state
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          address: {
                            ...updatedGuardian[0]?.address,
                            state: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Zip</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[0]?.address.zip
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[0] = {
                          ...updatedGuardian[0],
                          address: {
                            ...updatedGuardian[0]?.address,
                            zip: Number(event.target.value),
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
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
                        userData.guardian ? userData.guardian[1]?.firstName : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          firstName: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Last Name</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[1]?.lastName : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          lastName: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Email</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[1]?.email : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          email: event.target.value,
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Phone Number</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian ? userData.guardian[1]?.phone : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          phone: Number(event.target.value),
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Street</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[1]?.address.street
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          address: {
                            ...updatedGuardian[1]?.address,
                            street: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>City</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[1]?.address.city
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          address: {
                            ...updatedGuardian[1]?.address,
                            city: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>State</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[1]?.address.state
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          address: {
                            ...updatedGuardian[1]?.address,
                            state: event.target.value,
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className={styles.settingField}>
                  <div className={styles.field}>
                    <p className={styles.fieldName}>Zipcode</p>
                    <input
                      type="text"
                      className={styles.inputContainer}
                      value={
                        userData.guardian
                          ? userData.guardian[1]?.address.zip
                          : ""
                      }
                      onChange={(event) => {
                        const updatedGuardian = userData.guardian
                          ? [...userData.guardian]
                          : [];
                        updatedGuardian[1] = {
                          ...updatedGuardian[1],
                          address: {
                            ...updatedGuardian[1]?.address,
                            zip: Number(event.target.value),
                          },
                        };
                        setUserData({
                          ...userData,
                          guardian: updatedGuardian,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.btnsContainer}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleSaveChanges}>Save Changes</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
