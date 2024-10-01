import { auth, googleProvider} from "../config/firebase-config"
import { signInWithPopup, signOut } from "firebase/auth"
import { db } from "../config/firebase-config"
import { doc, setDoc} from "firebase/firestore"
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

const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
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

export const logout = async () => {
    try {
        console.log(auth)
        await signOut(auth)
    } catch (error) {
        alert("Error signing out")
    }
}