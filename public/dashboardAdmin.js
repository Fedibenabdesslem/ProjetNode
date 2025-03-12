$(document).ready(function () {
    const token = localStorage.getItem("token");

    // Check if the user is authorized
    if (!token) {
        alert("Unauthorized! Please log in.");
        window.location.href = "/login.html"; // Redirect to login if no token
    }

    // Function to Fetch Appointments
    function fetchAppointments() {
        $.ajax({
            url: "/api/appointments", // Endpoint to fetch all appointments
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }, // Pass the authorization token
            success: function (appointments) {
                let html = `
                    <table border="1" width="100%">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>`;

                // Loop through each appointment and create table rows
                appointments.forEach(appointment => {
                    html += `
                        <tr>
                            <td>${appointment.name}</td>
                            <td>${appointment.email}</td>
                            <td>${appointment.phone}</td>
                            <td>${appointment.department}</td>
                            <td>${appointment.doctor}</td>
                            <td>${new Date(appointment.date).toLocaleString()}</td>
                            <td>
                                <select class="status-select" data-id="${appointment._id}">
                                    <option value="scheduled" ${appointment.status === "scheduled" ? "selected" : ""}>Scheduled</option>
                                    <option value="confirmed" ${appointment.status === "confirmed" ? "selected" : ""}>Confirmed</option>
                                    <option value="completed" ${appointment.status === "completed" ? "selected" : ""}>Completed</option>
                                    <option value="canceled" ${appointment.status === "canceled" ? "selected" : ""}>Canceled</option>
                                </select>
                            </td>
                            <td>
                                <textarea class="message-text" data-id="${appointment._id}">${appointment.message}</textarea>
                            </td>
                            <td>
                                <button class="update-btn" data-id="${appointment._id}">Update</button>
                                <button class="delete-btn" data-id="${appointment._id}">Delete</button>
                            </td>
                        </tr>`;
                });

                html += `</table>`;
                $("#appointmentsList").html(html); // Inject HTML to the #appointmentsList container
            },
            error: function () {
                $("#appointmentsList").html("<p>Failed to load appointments.</p>");
            }
        });
    }

    // Fetch appointments when the page loads
    fetchAppointments();

    // Update Appointment
    $(document).on("click", ".update-btn", async function () {
        const appointmentId = $(this).data("id");
        const newStatus = $(`.status-select[data-id='${appointmentId}']`).val(); // Get the new status
        const newMessage = $(`.message-text[data-id='${appointmentId}']`).val(); // Get the new message

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

            const result = await response.json();

            if (response.ok) {
                alert("Appointment updated successfully!");
                fetchAppointments(); // Refresh the appointment list after update
            } else {
                alert(result.message || "Failed to update appointment.");
            }
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("An error occurred while updating the appointment.");
        }
    });

    // Delete Appointment
    $(document).on("click", ".delete-btn", function () {
        const appointmentId = $(this).data("id");

        if (!confirm("Are you sure you want to delete this appointment?")) return; // Confirm before deletion

        $.ajax({
            url: `/api/appointments/${appointmentId}`, // Delete appointment by ID
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }, // Pass the authorization token
            success: function () {
                alert("Appointment deleted successfully!");
                fetchAppointments(); // Reload appointments after deletion
            },
            error: function (xhr) {
                alert("Failed to delete appointment: " + xhr.responseText);
            }
        });
    });

    // Logout Functionality
    $("#logoutBtn").click(function () {
        localStorage.removeItem("token"); // Remove the token from local storage
        window.location.href = "/login.html"; // Redirect to login page
    });
});
