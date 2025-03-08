// File: routes/appointmentRoutes.js
const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getUserAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create an appointment (Accessible only to clients)
router.post('/', verifyToken, checkRole('client'), createAppointment);

// Route to get appointments of the logged-in user (Accessible to clients & professionals)
router.get('/user', verifyToken, getUserAppointments);

// Route to get all appointments (Accessible only to admins)
router.get('/all', verifyToken, checkRole('admin'), getAllAppointments);

// Route to update an appointment (Accessible to the concerned client or professional)
router.put('/:id', verifyToken, updateAppointment);

// Route to delete an appointment (Accessible to the concerned client or professional)
router.delete('/:id', verifyToken, deleteAppointment);

module.exports = router;