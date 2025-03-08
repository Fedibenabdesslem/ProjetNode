document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Unauthorized! Redirecting to login.");
        window.location.href = "login.html"; // ✅ Ensure redirection works
        return;
    }

    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("userName").innerText = result.user.name;
            document.getElementById("userEmail").innerText = result.user.email;
        } else {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html"; // ✅ Redirect if token invalid
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "login.html"; // ✅ Handle errors properly
    }

    // Logout function
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html"; // ✅ Ensure logout works
    });
});
