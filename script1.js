const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const type = document.getElementById("type");
const date = document.getElementById("date");
const incomeDisplay = document.getElementById("total-income");
const expenseDisplay = document.getElementById("total-expense");
const balanceDisplay = document.getElementById("total-balance");
const transactionList = document.getElementById("transaction-list");
const themeToggle = document.getElementById("theme-toggle");
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
const clearFilters = document.getElementById("clear-filters");

let transactions = [];

// Initialize on page load
window.addEventListener("DOMContentLoaded", init);

function init() {
  // Load transactions from localStorage
  const stored = localStorage.getItem("transactions");
  if (stored) {
    transactions = JSON.parse(stored);
    transactions.forEach(displayTransaction);
    updateSummary();
  }

  // Apply theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  // Event Listeners
  themeToggle.addEventListener("change", handleThemeToggle);
  form.addEventListener("submit", handleFormSubmit);
  filterCategory.addEventListener("change", applyFilters);
  filterDate.addEventListener("change", applyFilters);
  clearFilters.addEventListener("click", clearFilterInputs);
}

// Handle theme toggle switch
function handleThemeToggle() {
  const isDark = themeToggle.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  if (description.value.trim() === "" || amount.value <= 0 || !date.value) {
    alert("Please fill in all fields correctly!");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: description.value,
    amount: parseFloat(amount.value),
    category: category.value,
    type: type.value,
    date: date.value
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  displayTransaction(transaction);
  updateSummary();
  form.reset();
}

// Render a transaction row
function displayTransaction(txn) {
  const row = document.createElement("tr");
  row.classList.add("category-" + txn.category.toLowerCase());

  row.innerHTML = `
    <td>${txn.date}</td>
    <td>${txn.description}</td>
    <td>${txn.category}</td>
    <td>₹${txn.amount}</td>
    <td>${txn.type}</td>
    <td><button onclick="deleteTransaction(${txn.id})">Delete</button></td>
  `;

  transactionList.appendChild(row);
}

// Update totals (income, expense, balance)
function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(txn => {
    if (txn.type === "income") income += txn.amount;
    else expense += txn.amount;
  });

  incomeDisplay.textContent = income.toFixed(2);
  expenseDisplay.textContent = expense.toFixed(2);
  balanceDisplay.textContent = (income - expense).toFixed(2);
}

// Delete a transaction by ID
function deleteTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  applyFilters();
  updateSummary();
}

// Filter transactions
function applyFilters() {
  transactionList.innerHTML = "";
  const cat = filterCategory.value;
  const dateVal = filterDate.value;

  transactions
    .filter(txn =>
      (cat === "all" || txn.category === cat) &&
      (dateVal === "" || txn.date === dateVal)
    )
    .forEach(displayTransaction);
}

// Clear filters and reapply all transactions
function clearFilterInputs() {
  filterCategory.value = "all";
  filterDate.value = "";
  applyFilters();
}
