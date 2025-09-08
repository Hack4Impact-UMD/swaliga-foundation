import { useRouter } from "next/navigation";
import styles from "./VerifyEmailPage.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/features/auth/authN/emailPasswordAuthN";
import useAuth from "@/features/auth/authN/components/useAuth";
import ErrorPage from "../error";
import BlankBackgroundPage from "@/components/layout/pages/BlankBackgroundPage";

interface VerifyEmailPageProps {
  oobCode: string;
}

export default function VerifyEmailPage(props: VerifyEmailPageProps) {
  const { oobCode } = props;
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleVerifyEmail = async () => {
      await verifyEmail(oobCode);
      await auth.user!.getIdToken(true);
    };

    handleVerifyEmail()
      .then(() => {
        setVerified(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
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
          {verified ? "Your email has been verified!" : "Verifying email..."}
        </h1>
        {verified && (
          <p className={styles.message}>
            You will be redirected to the home page shortly. To go there now,
            click <Link href="/">here</Link>.
          </p>
        )}
      </div>
    </BlankBackgroundPage>
  );
}
