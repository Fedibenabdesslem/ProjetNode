// Function to check if the user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
        // User is logged in, show the Logout button
        logoutBtn.style.display = "block";
    } else {
        // User is not logged in, hide the Logout button
        logoutBtn.style.display = "none";
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "index.html"; // Redirect to the home page
}

// Check login status when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);