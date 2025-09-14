import BlankBackgroundPage from "@/components/layout/pages/BlankBackgroundPage";
import ErrorPage from "../error";
import styles from "./ChangeEmailPage.module.css";
import { useEffect, useState } from "react";
import useAuth from "@/features/auth/authN/components/useAuth";
import Link from "next/link";
import { ActionCodeInfo, applyActionCode } from "firebase/auth";
import { auth as firebaseAuth, functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";

interface ChangeEmailPageProps {
  oobCode: string;
  actionCodeInfo?: ActionCodeInfo;
}

export default function ChangeEmailPage(props: ChangeEmailPageProps) {
  const { oobCode, actionCodeInfo } = props;
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const auth = useAuth();

  useEffect(() => {
    const handleChangeEmail = async () => {
      await applyActionCode(firebaseAuth, oobCode);
      if (actionCodeInfo?.data.email) {
        await httpsCallable(functions, 'handleEmailChange')(actionCodeInfo.data.email);
      }
      await auth.user!.getIdToken(true);
    };

    handleChangeEmail()
      .then(() => {
        setSuccess(true);
      })
      .catch((error: any) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <BlankBackgroundPage backgroundColor="#295972">
      <div className={styles.container}>
        <h1 className={styles.header}>
          {success ? "Your email has been changed!" : "Changing email..."}
        </h1>
        {success && (
          <p className={styles.message}>
            Please click <Link href="/">here</Link> to return to the home page.
          </p>
        )}
      </div>
    </BlankBackgroundPage>
  );
}
