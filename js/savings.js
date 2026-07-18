const form = document.getElementById("savingForm");
const list = document.getElementById("savingList");


// Load saved data
let savings = JSON.parse(localStorage.getItem("savings")) || [];


// Display existing savings when page loads
displaySavings();

displaySummary();



form.addEventListener("submit", function(e){

    e.preventDefault();


    const name = document.getElementById("savingName").value;
    const target = Number(document.getElementById("targetAmount").value);
    const saved = Number(document.getElementById("savedAmount").value);



    // Validation

    if(saved > target){

        alert("Saved amount cannot be greater than target amount");

        return;

    }



    // Calculate percentage

    let percent = Math.round((saved / target) * 100);

    percent = Math.min(percent, 100);



    // Create saving object

    const saving = {

        name:name,
        target:target,
        saved:saved,
        percent:percent

    };



    // Store data

    savings.push(saving);

    localStorage.setItem(
        "savings",
        JSON.stringify(savings)
    );



    // Refresh display

    displaySavings();

    displaySummary();



    form.reset();


});






// Display Savings Cards

function displaySavings(){


    list.innerHTML = "";


    savings.forEach(function(item){


        const card = document.createElement("div");


        card.className = 
        "bg-white p-5 rounded-3xl shadow-sm border";



        card.innerHTML = `


        <h2 class="text-xl font-bold">
            ${item.name}
        </h2>


        <p class="mt-2 text-gray-600">
            Target: ₹${item.target}
        </p>


        <p class="text-gray-600">
            Saved: ₹${item.saved}
        </p>



        <div class="w-full bg-gray-200 rounded-full h-4 mt-4">

            <div 
            class="bg-purple-600 h-4 rounded-full transition-all duration-500"
            style="width:${item.percent}%">

            </div>

        </div>



        <p class="mt-3 font-semibold text-purple-600">

            ${item.percent}% Completed

        </p>


        `;


        list.appendChild(card);


    });


}






// Update Summary Cards

function displaySummary(){


    const totalSavings = document.getElementById("totalSavings");
    const completedGoals = document.getElementById("completedGoals");
    const activeGoals = document.getElementById("activeGoals");



    let total = 0;
    let completed = 0;
    let active = 0;



    savings.forEach(function(item){


        total += item.saved;



        if(item.percent === 100){

            completed++;

        }
        else{

            active++;

        }


    });




    if(totalSavings){

        totalSavings.innerText = "₹" + total;

    }


    if(completedGoals){

        completedGoals.innerText = completed;

    }


    if(activeGoals){

        activeGoals.innerText = active;

    }


}