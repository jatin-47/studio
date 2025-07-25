
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4SviSkRVNIE2OGPo0JI2C2lzwikr2dfI",
  authDomain: "eventide-intel-jn8fi.firebaseapp.com",
  projectId: "eventide-intel-jn8fi",
  storageBucket: "eventide-intel-jn8fi.firebasestorage.app",
  messagingSenderId: "830236450380",
  appId: "1:830236450380:web:893ee0c9be48e652145ee9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
