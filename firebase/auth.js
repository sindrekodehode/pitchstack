import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        return createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    return result
}

export const doSignOut = () => {
    return auth.signOut();
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
}

export const doSendEmailVerification = async () => {
    if (auth.currentUser) {
        try {
            await sendEmailVerification(auth.currentUser, {
                url: `${window.location.origin}/dropbox`,
            });
        } catch (error) {
            console.error("Failed to send validation email:", error);
        }
    } 
}




