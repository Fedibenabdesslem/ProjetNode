document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (!name || !email || !password) {
        errorMessage.innerText = "All fields are required!";
        return;
    }

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.status === 201) {
            localStorage.setItem("token", result.token);
            alert("Registration successful! Redirecting...");
            window.location.href = "login.html"; // Redirect after successful registration
        } else {
            errorMessage.innerText = result.message;
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.innerText = "An error occurred.";
    }
});
