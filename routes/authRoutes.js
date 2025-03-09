const express = require("express");
const { register, login } = require("../controllers/authController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const { getUserAppointments, getAllAppointments } = require("../controllers/appointmentController");
const User = require("../models/User"); // ✅ Ensure User model is imported
const Appointment = require("../models/Appointment");

const router = express.Router();

// ✅ Register a new user
router.post("/register", register);

// ✅ Login user
router.post("/login", login);

// ✅ Get all users (Admin only)
router.get("/users", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const users = await User.find({}, "name email role");
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get current logged-in user details
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email role");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get user-specific appointments
router.get("/appointments/user", verifyToken, getUserAppointments);

// ✅ Create an appointment (Clients Only)
router.post("/appointments", verifyToken, checkRole("client"), async (req, res) => {
    const { name, email, phone, department, doctor, date, message } = req.body;

    try {
        const newAppointment = new Appointment({
            client: req.user.id,
            name,
            email,
            phone,
            department,
            doctor,
            date,
            message,
            status: "scheduled"
        });

        await newAppointment.save();
        res.status(201).json({ success: true, message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get all appointments (Admin Only)
router.get("/appointments/all", verifyToken, checkRole("admin"), getAllAppointments);

module.exports = router;
