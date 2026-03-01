import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

let currentChild = null;

async function loadChild(childName) {
  currentChild = childName;
  renderPending();
  renderBalance();
}

async function renderPending() {
  const list = document.getElementById("pendingList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "chores"));

  snapshot.forEach((docSnap) => {
    const chore = docSnap.data();

    if (
      chore.status === "pending" &&
      chore.child === currentChild
    ) {
      const li = document.createElement("li");

      li.innerHTML = `
        ${chore.name} - $${chore.value}
        <button onclick="approve('${docSnap.id}', ${chore.value})">
          Approve
        </button>
      `;

      list.appendChild(li);
    }
  });
}

async function renderBalance() {
  const childRef = doc(db, "children", currentChild);
  const childSnap = await getDoc(childRef);

  if (childSnap.exists()) {
    const balance = childSnap.data().balance || 0;
    document.getElementById("mumBalance").textContent = balance.toFixed(2);
  }
}

async function approve(choreId, value) {
  const choreRef = doc(db, "chores", choreId);
  const childRef = doc(db, "children", currentChild);

  // 1️⃣ Get current balance
  const childSnap = await getDoc(childRef);
  const currentBalance = childSnap.data().balance || 0;

  // 2️⃣ Update balance
  await updateDoc(childRef, {
    balance: currentBalance + value
  });

  // 3️⃣ Reset chore
  await updateDoc(choreRef, {
    status: "available"
  });

  renderPending();
  renderBalance();
}

window.loadChild = loadChild;
window.approve = approve;
