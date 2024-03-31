


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import { collection, getDocs } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyColX6_GYcsTzlYKqHfsuGVR9Cq59qW8sk",
  authDomain: "rescue-a996f.firebaseapp.com",
  projectId: "rescue-a996f",
  storageBucket: "rescue-a996f.appspot.com",
  messagingSenderId: "1031256960413",
  appId: "1:1031256960413:web:63b9de9c80241bbe185374"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app;