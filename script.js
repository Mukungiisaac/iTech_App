// Firebase imports (v10 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9iJiSe4Abq1CWjizoU7EZYjFxrH_DNSU",
  authDomain: "itech-studio-e10ed.firebaseapp.com",
  projectId: "itech-studio-e10ed",
  storageBucket: "itech-studio-e10ed.appspot.com",
  messagingSenderId: "500081130595",
  appId: "1:500081130595:web:4cc46ac29479dd03a10c56",
  measurementId: "G-3F0SJHJ6B5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();



  const textElement = document.getElementById("animated-text");
  const messages = [
    "Welcome to iTech Studio",
    "We design, We develop.",
    "The Real Chamber of Solutions.",
    "Creativity meets technology"
  ];
  let index = 0;

  function showNextText() {
    // Fade out
    textElement.classList.remove("fade-in");
    textElement.classList.add("fade-out");

    setTimeout(() => {
      // Change text after fade out
      index = (index + 1) % messages.length;
      textElement.textContent = messages[index];

      // Fade in
      textElement.classList.remove("fade-out");
      textElement.classList.add("fade-in");
    }, 500); // match fade-out duration
  }

  // Start the loop
  setInterval(showNextText, 3000); // change every 3 seconds


// 🔐 Global reply tracker
let currentReply = null;

// ✅ Signup with Email
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("User registered!, Login now"))
    .catch(err => alert('Sign Up Failed'));
}

// ✅ Login with Email
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => showChat(auth.currentUser.email))
    .catch(err => alert("Login Failed!"));
}

// ✅ Google Sign-In
function googleSignIn() {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      showChat(user.email);
    })
    .catch(err => alert("Google Sign-In Error: " + err.message));
}

// ✅ Show Chat UI
function showChat(email) {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("chat-section").style.display = "block";
  document.getElementById("user-email").innerText = email;
  listenForMessages();
}

// ✅ Logout
function logout() {
  signOut(auth).then(() => {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("chat-section").style.display = "none";
    document.getElementById("chat-box").innerHTML = "";
  });
}

function cancelReply() {
  currentReply = null;
  document.getElementById("reply-user").innerText = "";
  document.getElementById("reply-text").innerText = "";
  document.getElementById("reply-bar").style.display = "none";
}


// ✅ Activate reply
function enableReply(msgId, user, text) {
  if (!msgId || !user || !text) {
    console.warn("Missing reply data:", msgId, user, text);
    return;
  }

  currentReply = { msgId, user, text };
  document.getElementById("reply-user").innerText = user;
  document.getElementById("reply-text").innerText = text;
  document.getElementById("reply-bar").style.display = "flex";
}

async function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();
  const user = auth.currentUser;

  if (!text || !user) return;

  const payload = {
    user: user.email,
    text: text,
    timestamp: serverTimestamp()
  };

  if (currentReply && currentReply.user && currentReply.text) {
    payload.replyTo = {
      msgId: currentReply.msgId,
      user: currentReply.user,
      text: currentReply.text
    };
  }

  try {
    await addDoc(collection(db, "messages"), payload);
    input.value = "";
    cancelReply();
  } catch (error) {
    alert("Error sending message: " + error.message);
  }
}


// ✅ Listen for messages and display
function listenForMessages() {
  const chatBox = document.getElementById("chat-box");
  const messagesRef = collection(db, "messages");

 onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const m = doc.data();

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    bubble.classList.add(m.user === auth.currentUser.email ? "you" : "other");

    let html = "";
    if (m.replyTo) {
      html += `<div class="replied-text"><strong>${m.replyTo.user || "Someone"}:</strong> ${m.replyTo.text}</div>`;
    }
    html += `<div>${m.text}</div>`;
    bubble.innerHTML = html;

    // Long press / right click
    bubble.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      // Only trigger if user and text are present
      if (m.user && m.text) {
        enableReply(doc.id, m.user, m.text);
      }
    });

    chatBox.appendChild(bubble);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
});

}

// ✅ Make all functions accessible globally
window.signup = signup;
window.login = login;
window.googleSignIn = googleSignIn;
window.logout = logout;
window.sendMessage = sendMessage;
window.cancelReply = cancelReply;
window.enableReply = enableReply;
window.listenForMessages = listenForMessages;
