import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("User registered! Now login."))
    .catch((err) => alert("Sign Up Failed: " + err.message));
}
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // ❌ Don't redirect manually here
      // ✅ Let check-auth.js on index.html handle redirection based on session
      console.log("User signed in. Waiting for redirect by onAuthStateChanged...");
    })
    .catch((err) => alert("Login Failed: " + err.message));
}


function googleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      window.location.href = "index.html"; // ✅ Redirect to main website
    })
    .catch((err) => alert("Google Sign-In Error: " + err.message));
}

window.signup = signup;
window.login = login;
window.googleSignIn = googleSignIn;
