/* ===================================================================
   Personal Budget Tracker — Member 4 (Tharun): Categories & Transactions
   common.js
   -------------------------------------------------------------------
   Shared helpers used by BOTH categories.js and transactions.js.
   Load this file before either page-specific script.

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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

/* ---------------------- side menu bar (mobile) ---------------------- */
/* No-ops safely if the mobile hamburger/sidebar/overlay markup isn't
   present on the page (e.g. pages using the dashboard-style sidebar). */

function initSideMenu() {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!toggle || !sidebar || !overlay) return;

  function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  sidebar.querySelectorAll(".nav-list a").forEach((link) =>
    link.addEventListener("click", closeMenu)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");
  mobileBreakpoint.addEventListener("change", (e) => {
    if (!e.matches) closeMenu(); // left mobile width — reset to desktop state
  });
}
/* ===================================================================
   Personal Budget Tracker — Member 4 (Tharun): Categories
   categories.js
   -------------------------------------------------------------------
   Requires common.js to be loaded first (getCategories, saveCategories,
   getTransactions, formatMoney, escapeHtml, uid, initSideMenu).
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

    const totalEl = document.getElementById("stat-total-categories");
    const incomeEl = document.getElementById("stat-income-categories");
    const expenseEl = document.getElementById("stat-expense-categories");
    if (totalEl) totalEl.textContent = categories.length;
    if (incomeEl) incomeEl.textContent = categories.filter((c) => c.type === "income").length;
    if (expenseEl) expenseEl.textContent = categories.filter((c) => c.type === "expense").length;

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

/* ---------------------- boot ---------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initSideMenu();
  if (document.getElementById("category-form")) initCategoriesPage();
});