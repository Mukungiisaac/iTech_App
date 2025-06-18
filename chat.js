
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔐 Only show chat if logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("user-email").innerText = user.email;
    listenForMessages();
    listenForTyping();
  }
});

let currentReply = null;

function cancelReply() {
  currentReply = null;
  document.getElementById("reply-user").innerText = "";
  document.getElementById("reply-text").innerText = "";
  document.getElementById("reply-bar").style.display = "none";
}

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
    timestamp: serverTimestamp(),
  };

  if (currentReply && currentReply.user && currentReply.text) {
    payload.replyTo = {
      msgId: currentReply.msgId,
      user: currentReply.user,
      text: currentReply.text,
    };
  }

  try {
    await addDoc(collection(db, "messages"), payload);
    input.value = "";
    cancelReply();
    await deleteDoc(doc(db, "typing", user.uid)); // stop typing indicator
  } catch (error) {
    alert("Error sending message: " + error.message);
  }
}

function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

function listenForMessages() {
  const chatBox = document.getElementById("chat-box");
  const messagesRef = query(collection(db, "messages"), orderBy("timestamp"));

  let lastDate = null;

  onSnapshot(messagesRef, (snapshot) => {
    chatBox.innerHTML = "";

    snapshot.forEach((doc) => {
      const m = doc.data();

      let dateStr = "";
      if (m.timestamp?.toDate) {
        const dateObj = m.timestamp.toDate();
        dateStr = dateObj.toDateString();
      }

      if (dateStr && dateStr !== lastDate) {
        const dateHeader = document.createElement("div");
        dateHeader.classList.add("date-separator");
        dateHeader.innerText = dateStr;
        chatBox.appendChild(dateHeader);
        lastDate = dateStr;
      }

      const bubble = document.createElement("div");
      bubble.classList.add("message-bubble");
      bubble.classList.add(m.user === auth.currentUser.email ? "you" : "other");

      const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        const time = `${hours}:${minutes} ${ampm}`;


      let html = "";
      if (m.replyTo) {
        html += `<div class="replied-text"><strong>${m.replyTo.user || "Someone"}:</strong> ${m.replyTo.text}</div>`;
      }

      html += `<div>${m.text}</div>`;
      html += `<div class="time-stamp">${time}</div>`;

      bubble.innerHTML = html;

      bubble.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (m.user && m.text) {
          enableReply(doc.id, m.user, m.text);
        }
      });

      chatBox.appendChild(bubble);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Typing indicator logic
function listenForTyping() {
  const typingIndicator = document.getElementById("typing-indicator");
  const typingRef = collection(db, "typing");

  onSnapshot(typingRef, (snapshot) => {
    let someoneTyping = false;
    snapshot.forEach(doc => {
      if (doc.id !== auth.currentUser.uid) {
        someoneTyping = true;
      }
    });
    typingIndicator.style.display = someoneTyping ? "block" : "none";
  });
}

const messageInput = document.getElementById("message");
let typingTimeout;

messageInput.addEventListener("input", () => {
  const user = auth.currentUser;
  if (!user) return;

  setDoc(doc(db, "typing", user.uid), {
    user: user.email,
    typing: true
  });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    deleteDoc(doc(db, "typing", user.uid));
  }, 2000);
});

  const chatBox = document.getElementById("chat-box");
  const fileInput = document.getElementById("file-upload");

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;

        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        const time = `${hours}:${minutes} ${ampm}`;

        // Create message bubble
        const msg = document.createElement("div");
        msg.classList.add("message-bubble");
        msg.innerHTML = `
          <strong style="display: block;">You</strong>
          <img src="${imageData}" alt="Uploaded Image" />
          <small style="display: block; margin-top: 4px;">${time}</small>
          <span class="delete-btn" title="Delete">🗑️</span>
        `;

        // Append and scroll
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Attach delete event
        msg.querySelector(".delete-btn").addEventListener("click", () => {
          chatBox.removeChild(msg);
        });

        // Reset
        fileInput.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  });



window.sendMessage = sendMessage;
window.logout = logout;
window.cancelReply = cancelReply;
window.enableReply = enableReply;
