// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9iJiSe4Abq1CWjizoU7EZYjFxrH_DNSU",
  authDomain: "itech-studio-e10ed.firebaseapp.com",
  projectId: "itech-studio-e10ed",
  storageBucket: "itech-studio-e10ed.appspot.com",
  messagingSenderId: "500081130595",
  appId: "1:500081130595:web:4cc46ac29479dd03a10c56",
  measurementId: "G-3F0SJHJ6B5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
