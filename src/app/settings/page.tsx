"use client";
import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { User } from "@/types/user-types";
import { auth } from "@/config/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import { logOut } from "@/features/auth/authN/googleAuthN";
import { getAccountById, updateAccount } from "@/data/users";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import RequireStudentAuth from "@/features/auth/RequireStudentAuth";

export default function Settings() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchCurrUser(user.uid);
    } else {
      throw new Error("User not authenticated");
    }
  }, []);

  const fetchCurrUser = async (id: string) => {
    setLoading(true);
    try {
      const userData = await getAccountById(id);
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data");
    }
    setLoading(false);
  };

  // cancels updating changes to the user
  function handleCancel() {
    router.push("/student-dashboard");
  }
  // updates changes to the user in Firestore and redirect to the student dashboard
  async function handleSaveChanges() {
    try {
      await updateAccount(userData?.id as string, {
        ...userData,
      });
      router.push("/student-dashboard"); // Redirect to student dashboard
    } catch (error) {
      console.error("Error updating user data");
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (userData) {
      setUserData({
        ...userData,
        [field]: value,
      });
    }
  };

  // handleGuardianChange is a separate function because guardian is a nested object
  const handleGuardianChange = (index: number, field: string, value: any) => {
    if (userData) {
      const updatedGuardian = userData.guardian ? [...userData.guardian] : [];
      updatedGuardian[index] = {
        ...updatedGuardian[index],
        [field]: value,
      };
      setUserData({
        ...userData,
        guardian: updatedGuardian,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <RequireStudentAuth>
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
                <p className={styles.link}>Student ID: {userData?.swaligaID}</p>
                <Link
                  href="/"
                  className={styles.link}
                  onClick={async () => {
                    await logOut();
                    router.refresh();
                  }}
                >
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
                    <h1 className={styles.sectionHeader}>
                      Student Information
                    </h1>
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
                          handleInputChange("firstName", event.target.value)
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
                          handleInputChange("lastName", event.target.value)
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
                          handleInputChange("email", event.target.value)
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
                        value={userData.phone.toString()}
                        onChange={(event) =>
                          handleInputChange("phone", Number(event.target.value))
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
                        value={userData.address.zip.toString()}
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
                        value={userData.gradYear.toString()}
                        onChange={(event) =>
                          handleInputChange(
                            "gradYear",
                            Number(event.target.value)
                          )
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
                        value={userData.yearsWithSwaliga.toString()}
                        onChange={(event) =>
                          handleInputChange(
                            "yearsWithSwaliga",
                            Number(event.target.value)
                          )
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
                          userData.guardian ? userData.guardian[0]?.name : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(0, "name", event.target.value);
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
                          handleGuardianChange(0, "email", event.target.value);
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
                          userData.guardian
                            ? userData.guardian[0]?.phone.toString()
                            : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(
                            0,
                            "phone",
                            Number(event.target.value)
                          );
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
                          handleGuardianChange(0, "address", {
                            ...userData.guardian?.[0].address,
                            street: event.target.value,
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
                          handleGuardianChange(0, "address", {
                            ...userData.guardian?.[0].address,
                            city: event.target.value,
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
                          handleGuardianChange(0, "address", {
                            ...userData.guardian?.[0].address,
                            state: event.target.value,
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
                            ? userData.guardian[0]?.address.zip.toString()
                            : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(0, "address", {
                            ...userData.guardian?.[0].address,
                            zip: Number(event.target.value),
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
                          userData.guardian ? userData.guardian[1]?.name : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(1, "name", event.target.value);
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
                          handleGuardianChange(1, "email", event.target.value);
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
                          userData.guardian
                            ? userData.guardian[1]?.phone.toString()
                            : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(
                            1,
                            "phone",
                            Number(event.target.value)
                          );
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
                          handleGuardianChange(1, "address", {
                            ...userData.guardian?.[1].address,
                            street: event.target.value,
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
                          handleGuardianChange(1, "address", {
                            ...userData.guardian?.[1].address,
                            city: event.target.value,
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
                          handleGuardianChange(1, "address", {
                            ...userData.guardian?.[1].address,
                            state: event.target.value,
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
                            ? userData.guardian[1]?.address.zip.toString()
                            : ""
                        }
                        onChange={(event) => {
                          handleGuardianChange(1, "address", {
                            ...userData.guardian?.[1].address,
                            zip: Number(event.target.value),
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
    </RequireStudentAuth>
  );
}
