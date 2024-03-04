import styles from "./ResetPasswordPage.module.css";
import CompanyLogo from "@/../public/images/logo.svg";
import CompanyLogoWords from "@/../public/images/logo2.svg";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from 'react';


export default function ResetPasswordPage() {

  const [email, setEmail] = useState('');
  const auth = getAuth();

  const triggerResetEmail = async () => {
    console.log(email); // Log the current value of email
    try {
      await sendPasswordResetEmail(auth, email); // Send password reset email
      console.log("Password reset email sent"); // Log success message
    } catch (error) {
      console.error("Error sending password reset email:", error); // Log error message
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logoSide}>
        <img id={styles.design} src={CompanyLogo.src} alt="Company Logo" />
        <img
          id={styles.sitename}
          src={CompanyLogoWords.src}
          alt="Company Logo with Words (SwaligaFoundation.org)"
        />
      </div>
      <div className={styles.formSide}>
        <div className={styles.innerBox}>
          <p className={styles.title}>Reset Password</p>
          <form className={styles.form}>
            <input
              className={styles.input}
              type="password"
              placeholder="new password"
            />
            <input
              className={styles.input}
              type="password"
              placeholder="confirm password"
            />
            <input className={styles.submit} type="submit" />
          </form>
        </div>
      </div>
      <div className="reset">
      {/* Input field for entering email address */}
      <input
        className="resetEmailInput"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Button to trigger sending password reset email */}
      <button className="resetBtn" type="button" onClick={triggerResetEmail}>
        Reset password
      </button>
    </div>
    </div>
  );
}
