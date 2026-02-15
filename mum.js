  
localStorage.removeItem("mumLoggedIn");  
  
const STORAGE_KEY = "alexanderChoreData";  
  
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {  
  pending: [],  
  balance: 0  
};  
  
function saveData() {  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));  
}  
  
function renderPending() {  
  const list = document.getElementById("pendingList");  
  list.innerHTML = "";  
  
  if (!data.pending || data.pending.length === 0) {  
    list.innerHTML = "<li>No pending chores 🎉</li>";  
    return;  
  }  
  
  data.pending.forEach((item, index) => {  
    const li = document.createElement("li");  
  
    li.innerHTML = `  
      ${item.name} – $${item.value}  
      <button onclick="approve(${index})">Approve</button>  
    `;  
  
    list.appendChild(li);  
  });  
}  
  
function approve(index) {  
  const item = data.pending[index];  
  
  data.balance += item.value;  
  data.pending.splice(index, 1);  
  
  saveData();  
  renderPending();  
}  
