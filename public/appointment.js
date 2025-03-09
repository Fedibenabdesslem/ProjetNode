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