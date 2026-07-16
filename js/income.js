document.getElementById("incomeForm").addEventListener("submit", function (e) {

    e.preventDefault();

    let income = {

        amount: document.getElementById("amount").value,
        source: document.getElementById("source").value,
        date: document.getElementById("date").value,
        payment: document.getElementById("payment").value,
        description: document.getElementById("description").value,
        notes: document.getElementById("notes").value

    };

    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];

    incomes.push(income);

    localStorage.setItem("incomes", JSON.stringify(incomes));

    alert("Income Added Successfully!");

    this.reset();

});