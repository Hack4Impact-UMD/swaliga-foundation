import { redirect, useRouter } from "next/navigation";
import styles from "./EmailVerifiedPage.module.css";
import Link from "next/link";

export default function EmailVerifiedPage() {
  const router = useRouter();
  setTimeout(() => router.push("/"), 2000);
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Your email has been verified! </h1>
        <p>
          You will be redirected to the home page shortly. To go there now,
          click <Link href="/">here</Link>.
        </p>
      </div>
    </div>
  );
}
