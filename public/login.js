document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    const errorMessage = document.getElementById("error-message");
    const loginRegisterBtns = document.querySelector(".get-quote"); // Conteneur des boutons Login & Register
    const logoutBtn = document.getElementById("logoutBtn");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token); // Sauvegarde du token
            alert("Login successful! Redirecting...");

            // Mettre à jour l'affichage des boutons
            if (loginRegisterBtns) loginRegisterBtns.style.display = "none"; // Cacher Login & Register
            if (logoutBtn) logoutBtn.style.display = "block"; // Afficher Logout

            window.location.href = "dashboard.html"; // Redirection après connexion
        } else {
            errorMessage.innerText = result.message;
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.innerText = "Login failed!";
    }
});
