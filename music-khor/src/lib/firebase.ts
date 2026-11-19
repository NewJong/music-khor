import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADlywLrHisRIFbwYAp0soWEiNtdEQgjFk",
  authDomain: "newjong-42df7.firebaseapp.com",
  databaseURL: "https://newjong-42df7-default-rtdb.firebaseio.com",
  projectId: "newjong-42df7",
  storageBucket: "newjong-42df7.firebasestorage.app",
  messagingSenderId: "344018927360",
  appId: "1:344018927360:web:8db08ddb42339cd722fde5",
  measurementId: "G-9L83F49CET",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
};
