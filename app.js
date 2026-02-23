const STORAGE_KEY = "alexanderChoreData"; 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function testWrite() {
  try {
    await addDoc(collection(db, "test"), {
      message: "Pete was here",
      timestamp: new Date()
    });
    console.log("Success!");
  } catch (e) {
    console.error("Error:", e);
  }
}

testWrite();

// Your web app's Firebase configuration
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
  
// Load from localStorage or use default  
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;  
  
  
// Save function  
function saveData() {  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));  
}  
  
  
// Mark chore done  
function markDone(choreKey) {  
  const chore = data.chores[choreKey];  
  
  if (!chore || chore.status !== "available") return;  
  
  chore.status = "pending";  
  
  data.pending.push({  
    name: chore.name,  
    value: chore.value  
  });  
  
  saveData();  
  renderStatus();  
}  
  
  
// Render status  
function renderStatus() {  
  const list = document.getElementById("statusList");  
  list.innerHTML = "";  
  
  data.pending.forEach(item => {  
    const li = document.createElement("li");  
    li.textContent = item.name + " – Waiting for Mum ⏳";  
    list.appendChild(li);  
  });  
  
  updateBalanceUI();  
}  
  
  
// Update money + goal UI  
function updateBalanceUI() {  
  document.getElementById("balance").textContent = data.balance;  
  
  const remaining = Math.max(data.goalCost - data.balance, 0);  
  document.getElementById("remaining").textContent = remaining;  
  
  const progress = Math.min((data.balance / data.goalCost) * 100, 100);  
  document.getElementById("progress").style.width = progress + "%";  
}  
  
 function checkDailyReset() {  
  const today = new Date().toDateString();  
  
  if (data.lastReset !== today) {  
    resetChores();  
    data.lastReset = today;  
    saveData();  
  }  
}  
  
function resetChores() {  
  for (let key in data.chores) {  
    data.chores[key].status = "available";  
  }  
  
  data.pending = [];  
}  

// Run on page load  
checkDailyReset();
renderStatus();  
