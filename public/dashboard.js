document.addEventListener("DOMContentLoaded", async () => {
    console.log("Dashboard script loaded"); // Debug: Check if the script is running
    const token = localStorage.getItem("token");
    console.log("Token retrieved:", token);

    if (!token) {
        alert("Unauthorized! Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    try {
        // Fetch user data from the backend
        const userResponse = await fetch("/api/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const userResult = await userResponse.json();
        console.log("User Data:", userResult);

        if (userResponse.ok) {
            // Display user information
            document.getElementById("userName").innerText = userResult.user.name;
            document.getElementById("userEmail").innerText = userResult.user.email;
        } else {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        // Fetch user-specific appointments
        const appointmentsResponse = await fetch("/api/appointments/user", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const appointmentsResult = await appointmentsResponse.json();
        console.log("Appointments Data:", appointmentsResult);

        if (appointmentsResponse.ok) {
            displayAppointments(appointmentsResult.appointments);
        } else {
            // If no appointments, display message from backend or a default message
            document.getElementById("appointmentsList").innerHTML =
                `<p>${appointmentsResult.message || "No appointments found."}</p>`;
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        window.location.href = "login.html";
    }

    // Logout function
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});

// Function to display appointments in a table format with update and delete buttons
function displayAppointments(appointments) {
    const appointmentsList = document.getElementById("appointmentsList");

    if (!appointments || appointments.length === 0) {
        appointmentsList.innerHTML = "<p>No appointments found.</p>";
        return;
    }

    // Clear the loading message
    appointmentsList.innerHTML = "";

    // Create a table to display appointments
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Message</th>
                <th>Actions</th> <!-- New column for actions -->
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = table.querySelector("tbody");

    // Populate the table with appointment data
    appointments.forEach(appointment => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleString()}</td>
            <td>${appointment.department}</td>
            <td>${appointment.doctor}</td>
            <td>${appointment.status}</td>
            <td>${appointment.message}</td>
            
            <td>
                <button class="updateBtn" data-id="${appointment._id}">Update</button>
                <button class="deleteBtn" data-id="${appointment._id}">Delete</button>
            </td>
        `;

        // Add event listeners for update and delete buttons
        row.querySelector(".updateBtn").addEventListener("click", () => updateAppointment(appointment._id));
        row.querySelector(".deleteBtn").addEventListener("click", () => deleteAppointment(appointment._id));

        tbody.appendChild(row);
    });

    // Append the table to the appointments list container
    appointmentsList.appendChild(table);
}
async function updateAppointment(appointmentId) {
    const newStatus = prompt("Enter new status (completed, pending, etc.):");
    const newMessage = prompt("Enter new message:");

    if (!newStatus || !newMessage) {
        alert("Please provide both status and message.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status: newStatus,
                message: newMessage
            })
        });

        const text = await response.text(); // Get the raw response text

        // Check if the response is valid JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            alert("Server returned an error: " + text); // Display the raw error message
            return;
        }

        if (response.ok) {
            alert("Appointment updated successfully!");
            window.location.reload(); // Refresh the page to show updated appointments
        } else {
            alert(result.message || "Failed to update appointment.");
        }
    } catch (error) {
        console.error("Error updating appointment:", error);
        alert("An error occurred while updating the appointment.");
    }
}

// Delete appointment (Client or Professional)
async function deleteAppointment(appointmentId) {
    // Confirm the deletion in the frontend (browser)
    const confirmDelete = confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) {
        return; // If the user cancels, do nothing
    }

    const token = localStorage.getItem("token");
    
    // Proceed with deletion if the token exists
    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    try {
        // Send DELETE request to backend
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` // Send the token for authorization
            }
        });

        const result = await response.json(); // Get the response from backend
        if (response.ok) {
            alert("Appointment deleted successfully!");
            window.location.reload(); // Reload the page to reflect the deletion
        } else {
            alert(result.message || "Failed to delete appointment.");
        }
    } catch (error) {
        console.error("Error deleting appointment:", error);
        alert("An error occurred while deleting the appointment.");
    }
}

// Assuming you're binding the delete button to this function in the UI
document.querySelector(".deleteBtn").addEventListener("click", function() {
    const appointmentId = this.getAttribute("data-appointment-id"); // Get the appointment ID from the button attribute
    deleteAppointment(appointmentId);
});

