import { auth, googleProvider} from "../config/firebase-config"
import { signInWithPopup, signOut } from "firebase/auth"
import { useEffect } from "react"

export const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
        console.log(auth)
    } catch (error) {
        alert("Error Signing In")
        console.log(error)
    }

}

export const logout = async () => {
    try {
        console.log(auth)
        await signOut(auth)
        console.log(auth)
    } catch (error) {
        alert("Error signing out")
    }
}