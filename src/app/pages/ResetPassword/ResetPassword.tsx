/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import styles from '../ResetPassword/ResetPassword.module.css';
import CompanyLogo from '../../images/logo.svg';
import CompanyLogoWords from '../../images/logo2.svg';

function ResetPasswordPage() {
    return (
        <>
        <body>
            <div className={styles.page}>
                    <div className={styles.logoSide}>    
                        <img id={styles.design} src={CompanyLogo.src} alt="Company Logo"/>     
                        <img id={styles.sitename} src={CompanyLogoWords.src} alt="Company Logo with Words (SwaligaFoundation.org)"/>   
                    </div>
                    <div className={styles.formSide}>
                        <div className={styles.innerBox}>
                            <p className={styles.title}>Reset Password</p>
                            <form className={styles.form}>
                                <p><input className={styles.input} type="text" placeholder="new password"></input></p>
                                <p><input className={styles.input} type="text" placeholder="confirm password"></input></p>
                                <p><input className={styles.submit} type="submit"></input></p>
                            </form>
                        </div>
                    </div>
            </div>
        </body>            
        </>
    );
  }
  
  export default ResetPasswordPage;