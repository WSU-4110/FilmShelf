
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import axios from 'axios';

export class UserInfo {
  constructor(uid, displayName, email, lists = [], reviews = [], watchedMovies = [], isPublic = false, followed = [], lastLogin = new Date()) {
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.lists = lists;
    this.reviews = reviews;
    this.watchedMovies = watchedMovies;
    this.isPublic = isPublic;
    this.followed = followed;
    this.lastLogin = lastLogin;
  }

  static async fetchUserFirestore(uid) {
    const userRef = doc(db, "users", uid); 
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return new UserProfile(
        data.uid,
        data.displayName,
        data.email,
        data.lists || [],
        data.reviews || [],
        data.watchedMovies || [],
        data.isPublic || false,
        data.followed || [],
        data.lastLogin ? new Date(data.lastLogin.seconds * 1000) : new Date() )
    } else {
      console.log("No such user!");
      return null;
    }
  }

  async saveToFirestore() {
    const userRef = doc(db, "users", this.uid);
    await setDoc(userRef, {
      uid: this.uid,
      displayName: this.displayName,
      email: this.email,
      lists: this.lists,
      reviews: this.reviews,
      watchedMovies: this.watchedMovies,
      public: this.isPublic,
      followed: this.followed,
      lastLogin: this.lastLogin
    }, { merge: true });

  }
}

