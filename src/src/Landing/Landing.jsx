import React, { useState } from "react";
import styles from './landing.module.css'
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

export function Landing() {
    const { userLoggedIn } = useAuth();

    let navigate = useNavigate();

    const registerBtn = () => {
        navigate('/signup');
    }
    const loginBtn = () => {
        navigate('/signin');
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/dropbox'} replace={true} />)}
            <main className={styles.main}>
                <div className={styles.inputContainer}>
                    <div className={styles.textContainer}>
                        <h3 className={styles.gradientText}>THINK BIG.</h3>
                        <h3 className={styles.gradientText}>MAKE YOUR</h3>
                        <h3 className={styles.gradientText}>IDEAS VISIBLE.</h3>
                    </div>
                    <div className={styles.blurb}>
                        <p className={styles.blurbP}>VIS Innovasjon presents a platform powered by ChatGPT, designed to evaluate startup pitch decks and funding applications.  By uploading PDFs, users gain insights into the strangths and weaknesses of their submissions across various benchmarks.  This tool is essential for startups aiming to refine their approach and secure financial support.</p>
                    </div>
                    <div className={styles.btnContainer}>
                        <button 
                        onClick={registerBtn}
                        className={styles.inputFormBtn}
                        >Join</button>
                        <button
                        onClick={loginBtn}
                        className={styles.inputFormBtn}
                        >Sign In</button>
                    </div>
                </div>
            </main>
        </div>
    )
}