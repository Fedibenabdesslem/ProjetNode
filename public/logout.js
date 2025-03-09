// Fonction pour vérifier si l'utilisateur est connecté
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginRegisterBtns = document.querySelector(".get-quote"); // Conteneur des boutons Login & Register

    if (token) {
        // L'utilisateur est connecté
        logoutBtn.style.display = "block"; // Afficher le bouton Logout
        if (loginRegisterBtns) loginRegisterBtns.style.display = "none"; // Cacher les boutons Login & Register
    } else {
        // L'utilisateur n'est pas connecté
        logoutBtn.style.display = "none"; // Cacher le bouton Logout
        if (loginRegisterBtns) loginRegisterBtns.style.display = "block"; // Afficher Login & Register
    }
}

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem("token"); // Supprimer le token
    alert("You have been logged out.");
    checkLoginStatus(); // Mettre à jour l'affichage des boutons
    window.location.href = "index.html"; // Rediriger vers la page d'accueil
}

// Vérifier le statut de connexion au chargement de la page
document.addEventListener("DOMContentLoaded", checkLoginStatus);
