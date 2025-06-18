import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Protect main page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in — send to login
    window.location.href = "login.html";
  } else {
    // Logged in — you can show user email or allow access
    console.log("User is logged in:", user.email);
  }
});
