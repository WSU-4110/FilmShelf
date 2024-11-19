import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Only import Analytics in a browser environment
const isBrowser = typeof window !== "undefined";

const firebaseConfig = {
    apiKey: "AIzaSyA1XdAictL8tS3QpQUuROzKCL6sRq8VLL4",
    authDomain: "filmshelf-de256.firebaseapp.com",
    projectId: "filmshelf-de256",
    storageBucket: "filmshelf-de256.appspot.com",
    messagingSenderId: "128798557656",
    appId: "1:128798557656:web:e88faab0c6bc44ee5ddead",
    measurementId: "G-B1TB39HP52",
};

console.log("Before Firebase Initialization");

const app = initializeApp(firebaseConfig);

console.log("Firebase Initialized", app);
console.log("After Firebase Initialization");

// Conditionally initialize analytics
let analytics;
if (isBrowser) {
  const { getAnalytics } = await import("firebase/analytics");
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { analytics };
