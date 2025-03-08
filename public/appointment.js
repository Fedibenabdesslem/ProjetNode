document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    const appointmentData = {
        name: document.querySelector("input[name='name']").value,
        email: document.querySelector("input[name='email']").value,
        phone: document.querySelector("input[name='phone']").value,
        department: document.querySelector("input[name='department']").value,
        doctor: document.querySelector("input[name='doctor']").value,
        date: document.querySelector("input[name='date']").value,
        message: document.querySelector("textarea[name='message']").value
    };

    try {
        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include the token here
            },
            body: JSON.stringify(appointmentData)
        });

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Unexpected response:", text);
            throw new Error("Server returned non-JSON response");
        }

        const result = await response.json();

        if (response.ok) {
            alert("Appointment created successfully!");
            window.location.href = "dashboard.html"; // Redirect after creating appointment
        } else {
            alert(result.message); // Show error message from the server
        }
    } catch (error) {
        console.error("Appointment creation error:", error);
        alert("Appointment creation failed!");
    }
});
async function loadAppointments() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Inclure le token ici
            }
        });

        // Vérifier que la réponse est JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Unexpected response:", text);
            throw new Error("Server returned non-JSON response");
        }

        const appointments = await response.json();
        
        if (response.ok) {
            const tableBody = document.querySelector("#appointmentsTable tbody");
            tableBody.innerHTML = ""; // Effacer le contenu existant
            appointments.forEach(appointment => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${appointment.name}</td>
                    <td>${appointment.email}</td>
                    <td>${appointment.phone}</td>
                    <td>${appointment.department}</td>
                    <td>${appointment.doctor}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.message}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert("Failed to load appointments: " + appointments.message);
        }
    } catch (error) {
        console.error("Error loading appointments:", error);
        alert("Failed to load appointments.");
    }
}

// Appeler cette fonction après la soumission du formulaire et l'ajout du rendez-vous
document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    const appointmentData = {
        name: document.querySelector("input[name='name']").value,
        email: document.querySelector("input[name='email']").value,
        phone: document.querySelector("input[name='phone']").value,
        department: document.querySelector("input[name='department']").value,
        doctor: document.querySelector("input[name='doctor']").value,
        date: document.querySelector("input[name='date']").value,
        message: document.querySelector("textarea[name='message']").value
    };

    try {
        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Inclure le token ici
            },
            body: JSON.stringify(appointmentData)
        });

        // Vérifier si la réponse est JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Unexpected response:", text);
            throw new Error("Server returned non-JSON response");
        }

        const result = await response.json();

        if (response.ok) {
            alert("Appointment created successfully!");
            window.location.href = "dashboard.html"; // Rediriger après la création du rendez-vous
            loadAppointments(); // Charger et afficher les rendez-vous
        } else {
            alert(result.message); // Afficher le message d'erreur du serveur
        }
    } catch (error) {
        console.error("Appointment creation error:", error);
        alert("Appointment creation failed!");
    }
});

// Appeler la fonction pour charger les rendez-vous au chargement de la page
window.addEventListener('load', loadAppointments);
