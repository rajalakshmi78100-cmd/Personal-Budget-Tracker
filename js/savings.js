const form = document.getElementById("savingForm");
const list = document.getElementById("savingList");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("savingName").value;
    const target = Number(document.getElementById("targetAmount").value);
    const saved = Number(document.getElementById("savedAmount").value);

    const percent = Math.round((saved / target) * 100);

    const card = document.createElement("div");

    card.className = "bg-white p-5 rounded-lg shadow";

    card.innerHTML = `
        <h2 class="text-xl font-bold">${name}</h2>

        <p>Target: ₹${target}</p>

        <p>Saved: ₹${saved}</p>

        <div class="w-full bg-gray-200 rounded-full h-4 mt-3">
            <div class="bg-purple-600 h-4 rounded-full"
                 style="width:${percent}%"></div>
        </div>

        <p class="mt-2">${percent}% Completed</p>
    `;

    list.appendChild(card);

    form.reset();

});