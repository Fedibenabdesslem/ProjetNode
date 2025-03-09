// Vérifier si l'utilisateur est connecté
function checkLoginStatus() {
    // Exemple de vérification : si un cookie 'user' existe (à ajuster selon votre système d'authentification)
    const isLoggedIn = document.cookie.includes('user');

    if (isLoggedIn) {
        // Masquer les boutons login et register
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';

        // Afficher le bouton logout
        document.getElementById('logoutBtn').style.display = 'inline-block';
    } else {
        // Afficher les boutons login et register
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('registerBtn').style.display = 'inline-block';

        // Masquer le bouton logout
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

// Appeler la fonction lors du chargement de la page
window.onload = checkLoginStatus;
