document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check if the user is logged in by verifying the token
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in first.");
        return;
    }

    // Collect form data
    const appointmentData = {
        name: document.querySelector("input[name='name']").value,
        email: document.querySelector("input[name='email']").value,
        phone: document.querySelector("input[name='phone']").value,
        department: document.querySelector("input[name='department']").value,
        doctor: document.querySelector("input[name='doctor']").value,
        date: document.querySelector("input[name='date']").value,
        message: document.querySelector("textarea[name='message']").value
    };

    // Basic form validation
    if (!appointmentData.name || !appointmentData.email || !appointmentData.phone || !appointmentData.department || !appointmentData.doctor || !appointmentData.date) {
        alert("Please fill in all required fields.");
        return;
    }

    // Debugging: Log the appointmentData to check if everything is correct
    console.log("Appointment data to be sent:", appointmentData);

    try {
        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include the token in headers for authentication
            },
            body: JSON.stringify(appointmentData)
        });

        // Debugging: Check the response status and content
        console.log("Response status:", response.status);
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Unexpected response:", text);
            throw new Error("Server returned non-JSON response");
        }

        const result = await response.json();

        if (response.ok) {
            alert("Appointment created successfully!");
            window.location.href = "dashboard.html"; // Redirect to dashboard after appointment creation
        } else {
            // If the server returns an error message, alert the user
            alert(result.message || "Failed to create appointment. Please try again.");
        }
    } catch (error) {
        console.error("Appointment creation error:", error);
        alert("Appointment creation failed! Please try again later.");
    }
});
