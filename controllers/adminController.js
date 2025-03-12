const Appointment = require("../models/Appointment");
const { sendEmail } = require("../utils/emailService"); // Assuming you have an email service

// Render the admin dashboard
const renderAdminDashboard = async (req, res) => {
    try {
        res.render("adminDashboard"); // Render the admin dashboard page
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        res.status(500).send("Server error.");
    }
};

// Function to update appointment status (Admin only)
const updateAppointment = async (req, res) => {
    const { id } = req.params; // The appointment ID from the URL
    const { status, message } = req.body; // The new status and message from the request body

    try {
        // Find the appointment by its ID
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Update the appointment's status and message
        appointment.status = status;
        appointment.message = message;

        // Save the updated appointment to the database
        await appointment.save();

        // Send email notification for 'confirmed' or 'canceled' status
        if (status === "confirmed" || status === "canceled") {
            if (appointment.email) {
                const emailSubject = "Appointment Status Update";
                const emailText = `
                    Your appointment with Dr. ${appointment.doctor} in the ${appointment.department} department has been updated to: ${status}.
                    Appointment Date: ${new Date(appointment.date).toLocaleString()}
                    Status Update Message: ${message}
                `;
                await sendEmail(appointment.email, emailSubject, emailText); // Send the email notification
            }
        }

        // Respond with a success message
        res.status(200).json({ message: "Appointment status updated successfully", appointment });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Export the functions
module.exports = { renderAdminDashboard, updateAppointment };
