import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASuSsmUjZyZPTZ0C4_U5K1KACWtCu4HmE",
  authDomain: "filmshelf-de256.firebaseapp.com",
  projectId: "filmshelf-de256",
  storageBucket: "filmshelf-de256.firebasestorage.app",
  messagingSenderId: "128798557656",
  appId: "1:128798557656:web:e88faab0c6bc44ee5ddead",
  measurementId: "G-B1TB39HP52"
};



console.log("Before Firebase Initialization");

const app = initializeApp(firebaseConfig);

console.log("Firebase Initialized", app);
console.log("After Firebase Initialization");
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();
