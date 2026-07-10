import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlIwbwALgicxJyB1mOPHcQeg_LAILWmvE",
  authDomain: "carbontally.firebaseapp.com",
  projectId: "carbontally",
  storageBucket: "carbontally.firebasestorage.app",
  messagingSenderId: "744965278672",
  appId: "1:744965278672:web:422dc39e6df9a717a547d5",
  measurementId: "G-YFEMEB603B"
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();