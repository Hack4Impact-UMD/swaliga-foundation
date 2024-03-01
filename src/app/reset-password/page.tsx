/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import styles from '../reset-password/reset-password.module.css';
import CompanyLogo from '../../../public/images/logo.svg';
import CompanyLogoWords from '../../../public/images/logo2.svg';

function ResetPasswordPage() {
    return (
        <div className={styles.page}>
            <div className={styles.logoSide}>    
                <img id={styles.design} src={CompanyLogo.src} alt="Company Logo"/>     
                <img id={styles.sitename} src={CompanyLogoWords.src} alt="Company Logo with Words (SwaligaFoundation.org)"/>   
            </div>
            <div className={styles.formSide}>
                <div className={styles.innerBox}>
                    <p className={styles.title}>Reset Password</p>
                    <form className={styles.form}>
                        <input className={styles.input} type="password" placeholder="new password"></input>
                        <input className={styles.input} type="password" placeholder="confirm password"></input>
                        <input className={styles.submit} type="submit"></input>
                    </form>
                </div>
            </div>
        </div>
    );
  }
  
  export default ResetPasswordPage;