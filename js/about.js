// =============================
// Sidebar Click Effect
// =============================

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        menuItems.forEach(link => {
            link.classList.remove("bg-purple-600", "text-white");
        });

        this.classList.add("bg-purple-600", "text-white");

    });

});

// =============================
// Current Month
// =============================

const currentMonth = document.getElementById("currentMonth");

if (currentMonth) {

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const today = new Date();

    currentMonth.textContent =
        months[today.getMonth()] + " " + today.getFullYear();
}

// =============================
// Current Year
// =============================

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// =============================
// Profile Avatar
// =============================

const profileAvatar = document.getElementById("profileAvatar");

if (profileAvatar) {

    const username = localStorage.getItem("username");

    if (username && username.trim() !== "") {
        profileAvatar.textContent = username.charAt(0).toUpperCase();
    } else {
        profileAvatar.textContent = "S";
    }

}

// =============================
// Demo Statistics
// =============================

const totalTransactions = document.getElementById("totalTransactions");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalGoals = document.getElementById("totalGoals");

if (totalTransactions) {
    totalTransactions.textContent = "128";
}

if (totalIncome) {
    totalIncome.textContent = "₹1,45,000";
}

if (totalExpense) {
    totalExpense.textContent = "₹1,02,850";
}

if (totalGoals) {
    totalGoals.textContent = "6";
}