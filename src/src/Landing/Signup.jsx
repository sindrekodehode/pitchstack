import React, { useState } from "react";
import styles from './landing.module.css'
import { Navigate, Link, useNavigate } from "react-router-dom";
import { doSignInWithGoogle, doCreateUserWithEmailAndPassword } from "../../../firebase/auth"; 
import { useAuth } from "../Context/authContext";

export function Signup() {
    const { userLoggedIn, currentUser, setCurrentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const sendInfo = async () => {
        if (currentUser) {
            const config= {
                headers: {'Authorization': 'Bearer ' + currentUser.getIdToken()},
                withCredentials: true,
            }
            await axios.post('https://aivispitchstackserver.azurewebsites.net/auth', config)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            const user = await doCreateUserWithEmailAndPassword(email, password);
            setCurrentUser(user);
        }
        await sendInfo()
    }

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false);
            })
        }
        await sendInfo()
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/dropbox'} replace={true} />)}
            <main className={styles.main}>
                <div className={styles.inputContainer}>
                    <h3 className={styles.headerThing}>Create your account</h3>
                        <div className={styles.inputWrapper}>
                            <div className={styles.googleBtnContainer}>
                                <button
                                onClick={onGoogleSignIn}
                                className={styles.googleBtn}><img src='/google.svg' alt='google logo' className={styles.googleSvg}></img>Sign up with google<img src='/right.svg' alt='right arrow' className={styles.rarrowSvg}></img></button>
                            </div>

                            <div className={styles.divider}>
                                <div className={styles.line}></div>
                                <span>or</span>
                                <div className={styles.line}></div>
                            </div>
                            <form className={styles.inputForm}>
                                <label htmlFor="username">Username</label>
                                <input
                                    className={styles.inputs}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="User"
                                />
                                <label htmlFor="email">Email</label>
                                <input
                                    className={styles.inputs}
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="email@gmail.com"
                                />
                                <label htmlFor="password"></label>
                                <input
                                    className={styles.inputs}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <div className={styles.loginBtnContainer}>
                                    <button 
                                    onSubmit={onSubmit}
                                    className={styles.inputFormBtn}
                                    >Sign Up</button>
                                </div>
                            </form>
                        </div>  
                </div>
            </main>
        </div>
    )
}