import React from 'react'
import { initializeApp} from "firebase/app";
import {
    getFirestore,collection,getDocs,addDoc
} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    GoogleAuthProvider,
    setPersistence
  } from 'firebase/auth'
  

const apiKey = `${import.meta.env.VITE_APP_API_KEY}`
const authDomain = `${import.meta.env.VITE_APP_AUTH_DOMAIN}`
const projectId = `${import.meta.env.VITE_APP_PROJECT_ID}`
const storageBucket= `${import.meta.env.VITE_APP_STORAGE_BUCKET}`
const messagingSenderId= `${import.meta.env.VITE_APP_MESSAGING_SENDER_ID}`
const appId = `${import.meta.env.VITE_APP_APP_ID}`
const measurementId = `${import.meta.env.VITE_APP_MEASUREMENT_ID}`
const firebaseConfig = {
    apiKey:`${apiKey}`,
    authDomain:`${authDomain}`,
    projectId:`${projectId}`,
    storageBucket:`${storageBucket}`,
    messagingSenderId:`${messagingSenderId}`,
    appId:`${appId}`,
    measurementId:`${measurementId}`
}

console.log(import.meta.env);
console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
 

