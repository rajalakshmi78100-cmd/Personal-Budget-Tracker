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
   Personal Budget Tracker — Member 4 (Tharun): Transactions
   transactions.js
   -------------------------------------------------------------------
   Requires common.js to be loaded first (getCategories, getTransactions,
   saveTransactions, formatMoney, formatDate, escapeHtml, uid, initSideMenu).
   =================================================================== */

function initTransactionsPage() {
  const form = document.getElementById("transaction-form");
  const errorBox = document.getElementById("transaction-error");
  const typeToggle = document.getElementById("transaction-type-toggle");
  const categorySelect = document.getElementById("transaction-category");
  const dateInput = document.getElementById("transaction-date");
  const tbody = document.getElementById("transaction-tbody");
  const emptyState = document.getElementById("transaction-empty");
  const searchInput = document.getElementById("filter-search");
  const categoryFilter = document.getElementById("filter-category");
  const typeFilter = document.getElementById("filter-type");
  const sortSelect = document.getElementById("filter-sort");

  let selectedType = "expense";
  dateInput.value = new Date().toISOString().slice(0, 10);

  function setSelectedType(type) {
    selectedType = type;
    typeToggle.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("selected", btn.dataset.type === type);
    });
    populateCategorySelect();
  }

  typeToggle.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => setSelectedType(btn.dataset.type));
  });

  function populateCategorySelect() {
    const categories = getCategories().filter((c) => c.type === selectedType);
    categorySelect.innerHTML = categories
      .map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
      .join("");
    if (categories.length === 0) {
      categorySelect.innerHTML = `<option value="">No ${selectedType} categories yet</option>`;
    }
  }

  function populateCategoryFilter() {
    const categories = getCategories();
    categoryFilter.innerHTML =
      `<option value="">All categories</option>` +
      categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  }

  function categoryName(id) {
    const cat = getCategories().find((c) => c.id === id);
    return cat ? cat.name : "Deleted category";
  }

  function renderTransactions() {
    const all = getTransactions();
    const search = searchInput.value.trim().toLowerCase();
    const catFilter = categoryFilter.value;
    const tFilter = typeFilter.value;
    const sort = sortSelect.value;

    let rows = all.filter((t) => {
      if (search && !(t.note || "").toLowerCase().includes(search)) return false;
      if (catFilter && t.categoryId !== catFilter) return false;
      if (tFilter && t.type !== tFilter) return false;
      return true;
    });

    rows = rows.slice().sort((a, b) => {
      if (sort === "date-asc") return a.date.localeCompare(b.date);
      if (sort === "amount-desc") return Number(b.amount) - Number(a.amount);
      if (sort === "amount-asc") return Number(a.amount) - Number(b.amount);
      return b.date.localeCompare(a.date); // date-desc default
    });

    tbody.innerHTML = "";

    if (rows.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }

    // running balance computed over chronological order regardless of display sort
    const chronological = all.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    const balanceMap = {};
    let running = 0;
    chronological.forEach((t) => {
      running += t.type === "income" ? Number(t.amount) : -Number(t.amount);
      balanceMap[t.id] = running;
    });

    rows.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDate(t.date)}</td>
        <td>${escapeHtml(categoryName(t.categoryId))}</td>
        <td class="note-cell">${escapeHtml(t.note || "—")}</td>
        <td><span class="tag ${t.type}">${t.type}</span></td>
        <td class="amount ${t.type}">${formatMoney(t.amount)}</td>
        <td class="balance-col">${formatMoney(balanceMap[t.id])}</td>
        <td><button class="icon-btn danger delete-tx" data-id="${t.id}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".delete-tx").forEach((btn) =>
      btn.addEventListener("click", () => {
        const updated = getTransactions().filter((t) => t.id !== btn.dataset.id);
        saveTransactions(updated);
        renderTransactions();
        renderSummary();
      })
    );
  }

  function renderSummary() {
    const all = getTransactions();
    const income = all.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = all.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const net = income - expense;
    document.getElementById("summary-income").textContent = formatMoney(income);
    document.getElementById("summary-expense").textContent = formatMoney(expense);
    const netEl = document.getElementById("summary-net");
    netEl.textContent = formatMoney(net);
    netEl.style.color = net < 0 ? "var(--expense)" : "var(--income)";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorBox.classList.remove("visible");

    const date = dateInput.value;
    const categoryId = categorySelect.value;
    const note = document.getElementById("transaction-note").value.trim();
    const amount = Number(document.getElementById("transaction-amount").value);

    if (!date || !categoryId || !amount || amount <= 0) {
      errorBox.textContent = "Please fill date, category and a valid amount greater than 0.";
      errorBox.classList.add("visible");
      return;
    }

    const transactions = getTransactions();
    transactions.push({
      id: uid("tx"),
      date,
      categoryId,
      note,
      type: selectedType,
      amount,
    });
    saveTransactions(transactions);

    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    setSelectedType(selectedType);
    renderTransactions();
    renderSummary();
  });

  [searchInput, categoryFilter, typeFilter, sortSelect].forEach((el) =>
    el.addEventListener("input", renderTransactions)
  );

  populateCategorySelect();
  populateCategoryFilter();
  setSelectedType("expense");
  renderTransactions();
  renderSummary();
}

/* ---------------------- boot ---------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initSideMenu();
  if (document.getElementById("transaction-form")) initTransactionsPage();
});