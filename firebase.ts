// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';
const serviceAccount = require('./src/system/serviceAccount.json') as admin.ServiceAccount;


const firebaseConfig = {
  apiKey: "AIzaSyAUlXSuQm6QLpFRGGXDXqcN0alIG37HlqA",
  authDomain: "workpocket-c9c9d.firebaseapp.com",
  projectId: "workpocket-c9c9d",
  storageBucket: "workpocket-c9c9d.appspot.com",
  messagingSenderId: "745106116997",
  appId: "1:745106116997:web:3849ee75bc7b5bd591f4ec",
  measurementId: "G-Z7RNS1QXT3"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app);
export const db = getFirestore(app);
export const GoogleProvider = new GoogleAuthProvider();