// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const { renderAdminDashboard , updateAppointment } = require("../controllers/adminController");


// Admin Dashboard Route (Only Admins)
router.get("/dashboard", verifyToken, checkRole("admin"), renderAdminDashboard);

// Update Appointment Status (Only Admins)
router.put("/appointments/:id", verifyToken, checkRole("admin"), updateAppointment);

module.exports = router;