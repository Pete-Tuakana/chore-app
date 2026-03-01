import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAlkbSQOQNk9RDssqaezwcYINZYxCX09O0",
  authDomain: "small-change-app.firebaseapp.com",
  projectId: "small-change-app",
  storageBucket: "small-change-app.firebasestorage.app",
  messagingSenderId: "84595380385",
  appId: "1:84595380385:web:a66bfd44290e958ed720e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const childName = window.childName;

// 🔥 Load chores for this child only
async function loadChores() {
  const snapshot = await getDocs(collection(db, "chores"));
  const list = document.getElementById("statusList");
  list.innerHTML = "";

  const today = new Date().toDateString();

  for (const docSnap of snapshot.docs) {
    const chore = docSnap.data();
    const choreRef = doc(db, "chores", docSnap.id);

    if (chore.child !== childName) continue;

    // Daily reset
    if (!chore.lastReset || chore.lastReset.toDate().toDateString() !== today) {
      await updateDoc(choreRef, {
        status: "available",
        lastReset: Timestamp.now()
      });
      chore.status = "available";
    }

    if (chore.status === "pending") {
      const li = document.createElement("li");
      li.textContent = chore.name + " – Waiting for Mum ⏳";
      list.appendChild(li);
    }
  }
}

loadChores();

// Mark chore done
async function markDone(choreKey) {
  const choreRef = doc(db, "chores", choreKey);

  await updateDoc(choreRef, {
    status: "pending"
  });

  loadChores();
}

window.markDone = markDone;

// 🔥 Live balance listener (dynamic child)
const balanceRef = doc(db, "children", childName);

onSnapshot(balanceRef, (docSnap) => {
  if (docSnap.exists()) {
    const balance = docSnap.data().balance || 0;

    document.getElementById("balance").textContent =
      balance.toFixed(2);

    const goalAmount = childName === "conor" ? 35 : 85;
    
    const remaining = goalAmount - balance;

    document.getElementById("remaining").textContent =
      remaining > 0 ? remaining.toFixed(2) : "0";

    const percent = Math.min((balance / goalAmount) * 100, 100);
    document.getElementById("progress").style.width =
      percent + "%";
  }
});
