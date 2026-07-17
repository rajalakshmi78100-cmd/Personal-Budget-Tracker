/* ===================================================================
   Personal Budget Tracker — Member 4 (Tharun): Categories & Transactions
   script.js
   -------------------------------------------------------------------
   Shared localStorage keys (so this can merge with teammates' modules):
     ledger_categories   -> array of { id, name, type, budgetLimit }
     ledger_transactions -> array of { id, date, categoryId, note,
                                        type, amount }
   =================================================================== */
 
const STORAGE_KEYS = {
  categories: "ledger_categories",
  transactions: "ledger_transactions",
};
 
const DEFAULT_CATEGORIES = [
  { id: "cat_food", name: "Food", type: "expense", budgetLimit: 6000 },
  { id: "cat_transport", name: "Transport", type: "expense", budgetLimit: 2000 },
  { id: "cat_bills", name: "Bills & Utilities", type: "expense", budgetLimit: 4000 },
  { id: "cat_shopping", name: "Shopping", type: "expense", budgetLimit: 3000 },
  { id: "cat_salary", name: "Salary", type: "income", budgetLimit: null },
  { id: "cat_freelance", name: "Freelance", type: "income", budgetLimit: null },
];
 
/* ---------------------- Data layer ---------------------- */
 
function uid(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
 
function getCategories() {
  const raw = localStorage.getItem(STORAGE_KEYS.categories);
  if (!raw) {
    saveCategories(DEFAULT_CATEGORIES);
    return [...DEFAULT_CATEGORIES];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
 
function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}
 
function getTransactions() {
  const raw = localStorage.getItem(STORAGE_KEYS.transactions);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
 
function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}
 
function formatMoney(n) {
  const num = Number(n) || 0;
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
 
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
 
/* ===================================================================
   CATEGORIES PAGE
   =================================================================== */
 
function initCategoriesPage() {
  const form = document.getElementById("category-form");
  const grid = document.getElementById("category-grid");
  const emptyState = document.getElementById("category-empty");
  const errorBox = document.getElementById("category-error");
  const typeToggle = document.getElementById("category-type-toggle");
  let selectedType = "expense";
  let editingId = null;
 
  function setSelectedType(type) {
    selectedType = type;
    typeToggle.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("selected", btn.dataset.type === type);
    });
  }
 
  typeToggle.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => setSelectedType(btn.dataset.type));
  });
 
  function renderCategories() {
    const categories = getCategories();
    const transactions = getTransactions();
    grid.innerHTML = "";
 
    if (categories.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";
 
    categories.forEach((cat) => {
      const spent = transactions
        .filter((t) => t.categoryId === cat.id && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
 
      const card = document.createElement("div");
      card.className = "category-card";
 
      const initial = cat.name.trim().charAt(0).toUpperCase() || "?";
      const limitLine =
        cat.type === "expense" && cat.budgetLimit
          ? `${formatMoney(spent)} / ${formatMoney(cat.budgetLimit)} used`
          : cat.type === "income"
          ? "Income source"
          : "No limit set";
 
      card.innerHTML = `
        <div class="badge ${cat.type}">${initial}</div>
        <div class="category-name">${escapeHtml(cat.name)}</div>
        <span class="tag ${cat.type}">${cat.type}</span>
        <div class="category-meta"><span>${limitLine}</span></div>
        <div class="category-actions">
          <button class="icon-btn edit-btn" data-id="${cat.id}">Edit</button>
          <button class="icon-btn danger delete-btn" data-id="${cat.id}">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
 
    grid.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => startEdit(btn.dataset.id))
    );
    grid.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategory(btn.dataset.id))
    );
  }
 
  function startEdit(id) {
    const categories = getCategories();
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    editingId = id;
    document.getElementById("category-name").value = cat.name;
    document.getElementById("category-limit").value = cat.budgetLimit || "";
    setSelectedType(cat.type);
    document.getElementById("category-submit").textContent = "Update category";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
 
  function deleteCategory(id) {
    const inUse = getTransactions().some((t) => t.categoryId === id);
    if (inUse) {
      if (!confirm("This category has transactions linked to it. Delete anyway? Linked transactions will keep the category name as 'Deleted category'.")) {
        return;
      }
    }
    const categories = getCategories().filter((c) => c.id !== id);
    saveCategories(categories);
    renderCategories();
  }
 
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("category-name").value.trim();
    const limitRaw = document.getElementById("category-limit").value;
    errorBox.classList.remove("visible");
 
    if (!name) {
      errorBox.textContent = "Please enter a category name.";
      errorBox.classList.add("visible");
      return;
    }
 
    const categories = getCategories();
    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId
    );
    if (duplicate) {
      errorBox.textContent = "A category with this name already exists.";
      errorBox.classList.add("visible");
      return;
    }
 
    const budgetLimit = limitRaw ? Number(limitRaw) : null;
 
    if (editingId) {
      const idx = categories.findIndex((c) => c.id === editingId);
      categories[idx] = { ...categories[idx], name, type: selectedType, budgetLimit };
    } else {
      categories.push({ id: uid("cat"), name, type: selectedType, budgetLimit });
    }
 
    saveCategories(categories);
    form.reset();
    editingId = null;
    document.getElementById("category-submit").textContent = "Add category";
    setSelectedType("expense");
    renderCategories();
  });
 
  renderCategories();
}
 