// ==========================
// Active Sidebar Menu
// ==========================

const menuItems = document.querySelectorAll(".menu-item");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
menuBtn.addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        menuItems.forEach(link => {
            link.classList.remove("bg-purple-600", "text-white");
        });

        this.classList.add("bg-purple-600", "text-white");

    });

});


// ==========================
// Greeting Message
// ==========================

const greeting = document.getElementById("greeting");

if (greeting) {

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting.innerHTML = "Good Morning 👋";

    }

    else if (hour < 17) {

        greeting.innerHTML = "Good Afternoon ☀️";

    }

    else {

        greeting.innerHTML = "Good Evening 🌙";

    }

}


// ==========================
// Notification Bell
// ==========================

const bell = document.querySelector(".fa-bell");

if (bell) {

    bell.addEventListener("click", function () {

        alert("No new notifications");

    });

}


// ==========================
// Dashboard Values
// (Temporary Static Values)
// ==========================

const dashboardData = {

    balance: 85400,
    income: 45000,
    expense: 18700,
    savings: 26300

};

console.log("Dashboard Loaded");
console.log(dashboardData);


// ==========================
// Future Local Storage
// ==========================

// Later we'll replace the above values with:
//
// const income = JSON.parse(localStorage.getItem("income")) || [];
// const expense = JSON.parse(localStorage.getItem("expense")) || [];
//
// Then calculate:
//
// Total Income
// Total Expense
// Balance
// Savings
//
// automatically.