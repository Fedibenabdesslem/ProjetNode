document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token); // Ensure the token is saved
            alert("Login successful! Redirecting...");
            if (result.role === "admin") {
                window.location.href = "dashboardAdmin.html";
            } else {
                window.location.href = "dashboard.html"; 
            }
        } else {
            errorMessage.innerText = result.message;
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.innerText = "Login failed!";
    }
});