
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // Vérifie si l'utilisateur est connecté
    const loginBtn = document.querySelector(".btn-login");
    const registerBtn = document.querySelector(".btn-register");
    const logoutBtn = document.getElementById("logoutBtn");
    const appointmentBtn = document.querySelector(".btn-appointment");

    if (token) {
        // L'utilisateur est connecté
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "block";
    } else {
        // L'utilisateur n'est pas connecté
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (registerBtn) registerBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        
        // Vérifier si l'utilisateur tente d'accéder directement à la page de rendez-vous
       
    }

    // Vérification avant d'ouvrir la page de rendez-vous via le bouton
    if (appointmentBtn) {
        appointmentBtn.addEventListener("click", function (event) {
            if (!token) {
                event.preventDefault(); // Empêche l'ouverture du lien
                alert("Vous devez être connecté pour prendre un rendez-vous !");
                window.location.href = "login.html"; // Redirige vers la page de connexion
            }
        });
    }
});

// Fonction de déconnexion
function logout() {
    localStorage.removeItem("token"); // Supprime le token
    alert("Vous êtes déconnecté !");
    window.location.href = "login.html"; // Redirige vers la page de connexion
}
