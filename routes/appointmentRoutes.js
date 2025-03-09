// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware'); // Corrected import path

// Route to create an appointment (Client only)
router.post('/', verifyToken, appointmentController.createAppointment);

// Route to get all appointments (Admin only)
router.get('/', verifyToken, checkRole('admin'), appointmentController.getAllAppointments);

// Route to get user-specific appointments (Client only)
router.get('/user', verifyToken, appointmentController.getUserAppointments);

// Route to update an appointment (Client only)
router.put('/:appointmentId', verifyToken, appointmentController.updateAppointment);

// Route to delete an appointment (Client only)
router.delete('/:appointmentId', verifyToken, appointmentController.deleteAppointment);

module.exports = router;
