// ==============================
// ADD INCOME PAGE
// ==============================

// Get Form
const incomeForm = document.getElementById("incomeForm");

// Get Input Fields
const amount = document.getElementById("amount");
const source = document.getElementById("source");
const date = document.getElementById("date");
const payment = document.getElementById("payment");
const description = document.getElementById("description");
const notes = document.getElementById("notes");

// Set Today's Date
if (date) {
    date.valueAsDate = new Date();
}

// Load Existing Data
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];

// ==============================
// ADD INCOME
// ==============================

if (incomeForm) {

    incomeForm.addEventListener("submit", function (e) {

        e.preventDefault();
         console.log("Submit event is working!");

        // Validation

        if (amount.value.trim() === "") {
            alert("Please enter the amount.");
            amount.focus();
            return;
        }

        if (Number(amount.value) <= 0) {
            alert("Amount must be greater than 0.");
            amount.focus();
            return;
        }

        if (description.value.trim() === "") {
            alert("Please enter description.");
            description.focus();
            return;
        }

        // Create Object

        const income = {

            id: Date.now(),

            amount: Number(amount.value),

            source: source.value,

            date: date.value,

            payment: payment.value,

            description: description.value,

            notes: notes.value

        };

        // Push Into Array

        incomes.push(income);

        // Save Local Storage

        localStorage.setItem("incomes", JSON.stringify(incomes));

        // Success

        alert("✅ Income Added Successfully!");

        console.log(incomes);

        // Reset Form

        incomeForm.reset();

        // Today's Date Again

        date.valueAsDate = new Date();

    });

}

// ==============================
// CANCEL BUTTON
// ==============================

const cancelBtn = document.querySelector('button[type="reset"]');

if (cancelBtn) {

    cancelBtn.addEventListener("click", function () {

        const confirmClear = confirm("Clear all entered details?");

        if (!confirmClear) {

            return;

        }

        incomeForm.reset();

        date.valueAsDate = new Date();

    });

}

// ==============================
// VIEW SAVED DATA
// ==============================

function displayIncomes() {

    const storedIncome = JSON.parse(localStorage.getItem("incomes")) || [];

    console.log("Stored Income");

    console.table(storedIncome);

}

displayIncomes();

// ==============================
// TOTAL INCOME
// ==============================

function getTotalIncome() {

    const storedIncome = JSON.parse(localStorage.getItem("incomes")) || [];

    let total = 0;

    storedIncome.forEach(function (income) {

        total += Number(income.amount);

    });

    console.log("Total Income : ₹" + total);

}

getTotalIncome();

// ==============================
// DELETE ALL INCOME (Optional)
// ==============================

function clearIncomeData() {

    const confirmDelete = confirm("Delete all saved income?");

    if (confirmDelete) {

        localStorage.removeItem("incomes");

        alert("All income deleted.");

        location.reload();

    }

}

// ==============================
// CHECK LOCAL STORAGE
// ==============================

console.log(localStorage.getItem("incomes"));
// ==============================
// INCOME SOURCE SELECT BOX
// ==============================

function selectIncome(element) {

    // Remove box from all items
    document.querySelectorAll(".income-option").forEach(item => {

        item.classList.remove(
            "bg-green-50",
            "border",
            "border-green-500",
            "shadow-md"
        );

    });


    // Add box only selected item
    element.classList.add(
        "bg-green-50",
        "border",
        "border-green-500",
        "shadow-md"
    );


    // Select radio button
    element.querySelector("input").checked = true;

}


// Default selected item
window.addEventListener("load", () => {

    const firstOption = document.querySelector(".income-option");

    if(firstOption){

        firstOption.classList.add(
            "bg-green-50",
            "border",
            "border-green-500",
            "shadow-md"
        );

        firstOption.querySelector("input").checked = true;

    }

});