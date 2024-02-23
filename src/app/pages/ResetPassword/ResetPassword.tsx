/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import styles from '../ResetPassword/ResetPassword.module.css';
import CompanyLogo from '../../images/logo.svg';

function ResetPasswordPage() {
    return (
        <>
        <body>
            <div className={styles.page}>
                    <div className={styles.logoSide}>    
                        <img src={CompanyLogo.src} alt="Company Logo"/>     
                    </div>
                    <div className={styles.formSide}>
                        <div className={styles.innerBox}>
                            <h2 className={styles.title}>Reset Password</h2>
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