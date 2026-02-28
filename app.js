import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc, 
  doc 
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Temporary local state object (so UI doesn't crash)
let data = {
  balance: 0,
  goalCost: 85,
  chores: {},
  pending: []
};

// Default data  
const defaultData = {  
  balance: 0,  
  goalCost: 85, 
  lastReset: null,
  chores: {  
    clothes: { name: "Sort clothes", value: 5, status: "available" },  
    dishes: { name: "Empty dishwasher", value: 5, status: "available" },  
    bin: { name: "Take out bin", value: 5, status: "available" }  
  },  
  pending: []  
};  
  

async function loadChores() {
  const snapshot = await getDocs(collection(db, "chores"));
  data.chores = {};

  const list = document.getElementById("statusList");
  list.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const chore = docSnap.data();
    data.chores[docSnap.id] = chore;

    if (chore.status === "pending") {
      const li = document.createElement("li");
      li.textContent = chore.name + " – Waiting for Mum ⏳";
      list.appendChild(li);
    }
  });

  console.log("Chores loaded:", data.chores);
}

loadChores(); 
  
// Mark chore done  
async function markDone(choreKey) {
  const choreRef = doc(db, "chores", choreKey);

  await updateDoc(choreRef, {
    status: "pending"
  });

  loadChores(); // reload from Firestore
}
  
  
// Render status  
//function renderStatus() {  
//  const list = document.getElementById("statusList");  
//  list.innerHTML = "";  
  
//  data.pending.forEach(item => {  
//    const li = document.createElement("li");  
//    li.textContent = item.name + " – Waiting for Mum ⏳";  
//    list.appendChild(li);  
//  });  
  
//  updateBalanceUI();  
//}  
  
  
// Update money + goal UI  
//function updateBalanceUI() {  
//  document.getElementById("balance").textContent = data.balance;  
  
//  const remaining = Math.max(data.goalCost - data.balance, 0);  
//  document.getElementById("remaining").textContent = remaining;  
  
//  const progress = Math.min((data.balance / data.goalCost) * 100, 100);  
//  document.getElementById("progress").style.width = progress + "%";  
//}  
  
// function checkDailyReset() {  
//  const today = new Date().toDateString();  
  
 // if (data.lastReset !== today) {  
 //   resetChores();  
  //  data.lastReset = today;  
  //  saveData();  
//  }  
//}  
  
//function resetChores() {  
//  for (let key in data.chores) {  
//    data.chores[key].status = "available";  
//  }  
  
//  data.pending = [];  
//}  

// Run on page load  
//checkDailyReset();
//renderStatus();  

window.markDone = markDone;
