import { auth, googleProvider} from "../config/firebase-config"
import { signInWithPopup, signOut } from "firebase/auth"
import { db } from "../config/firebase-config"
import { doc, setDoc, getDoc} from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updatePassword} from "firebase/auth"
import { useEffect } from "react"

export const signInWithGoogle = async () => {
    try {
        const res=await signInWithPopup(auth, googleProvider)
        const curuser=res.user
        await saveUserToFirestore(curuser);
        console.log(auth)
    } catch (error) {
        alert("Error Signing In")
        console.log(error)
    }
}

export const doSignInWithEmailAndPassword = (email, password) => {
    try {
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      alert("Password Or email does not match");
    }
};

/*
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
  };
  
  export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  };
  */

const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()){
    await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        lists: null,
        reviews: null,
        watchedMovies: null,
        public: false,
        followed: null,
        lastLogin: new Date()
    }, { merge: true });
  };
}

export const logout = async () => {
    try {
        console.log(auth)
        await signOut(auth)
    } catch (error) {
        alert("Error signing out")
    }
}