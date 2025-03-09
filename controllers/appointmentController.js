const Appointment = require("../models/Appointment");
const sendEmail = require('../utils/emailService'); 



const createAppointment = async (req, res) => {
    const { name, email, phone, department, doctor, date, message } = req.body;

    try {
        // Check if user role is 'client'
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Access denied. Only clients can create appointments" });
        }

        console.log("Received appointment data:", req.body);  // Debug log to check if the data is coming correctly

        // Create new appointment object
        const newAppointment = new Appointment({
            name,
            email,
            phone,
            department,
            doctor,
            date,
            message,
            status: "scheduled", // Default status
            client: req.user.id, // Associate appointment with logged-in client
            created_at: Date.now()
        });

        // Save the appointment to the database
        await newAppointment.save();
        console.log("Appointment saved:", newAppointment);  // Debug log to check if appointment was saved

        // Send email confirmation to the client
        const emailSubject = "Confirmation de Rendez-vous";
        const emailText = `
            Bonjour ${name},

            Votre rendez-vous a été confirmé avec ${doctor} dans le département ${department}.
            Date du rendez-vous: ${newAppointment.date.toLocaleString()}.
            Message: ${message}

            Merci de votre confiance !
        `;

        // Send the confirmation email using the sendEmail function
        await sendEmail(email, emailSubject, emailText);

        // Respond with success message
        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);  // Debug log for errors
        res.status(500).json({ message: "Server error" });
    }
};

// Get all appointments (Admin)
const getAllAppointments = async (req, res) => {
    try {
        // Verify that the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Reserved for administrators" });
        }

        const appointments = await Appointment.find()
            .populate("client", "name email") // Populate client details
            .populate("professional", "name email"); // Populate professional details

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};// Get user-specific appointments (Client)
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.find({ client: userId }).populate("client", "name email");

        console.log("Appointments for user:", appointments); // Debugging log to check the data

        if (appointments.length === 0) {
            return res.status(200).json({ message: "No appointments found for this user", appointments: [] });
        }

        res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateAppointment(appointmentId) {
    // Prompt the user to update the status, date, or message (simplified example)
    const newStatus = prompt("Enter new status (completed, pending, etc.):");
    const newMessage = prompt("Enter new message:");

    if (!newStatus || !newMessage) {
        alert("Please provide both status and message.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`/api/appointments/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId,
                status: newStatus,
                message: newMessage
            })
        });

        const result = await response.json();
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

const deleteAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId; // Get appointment ID from URL params
    
    try {
        // Find and delete the appointment
        const appointment = await Appointment.findByIdAndDelete(appointmentId);

        // If appointment not found, return an error
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        // Respond with success
        res.status(200).json({ message: "Appointment deleted successfully." });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


module.exports = {
    createAppointment,
    getAllAppointments,
    getUserAppointments,
    updateAppointment,
    deleteAppointment
};
