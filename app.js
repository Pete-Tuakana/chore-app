const STORAGE_KEY = "alexanderChoreData";  
  
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
  
  
// Run on page load  
renderStatus();  
