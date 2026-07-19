const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    document.getElementById("userError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";

    let valid = true;

    if (username === "") {
        document.getElementById("userError").textContent = "Username is required";
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        document.getElementById("emailError").textContent = "Email is required";
        valid = false;
    }
    else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email";
        valid = false;
    }

    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required";
        valid = false;
    }
    else if (password.length < 6) {
        document.getElementById("passwordError").textContent = "Password must be at least 6 characters";
        valid = false;
    }

    if (valid) {

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", email);

        alert("Login Successful");

        window.location.href = "pages/dashboard.html";

    }

});