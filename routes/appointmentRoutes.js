const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    getUserAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/', verifyToken, createAppointment);
router.get('/', verifyToken, getUserAppointments);
router.get('/all', verifyToken, getAllAppointments); // Route pour les admins
router.put('/:id', verifyToken, updateAppointment);
router.delete('/:id', verifyToken, deleteAppointment);


module.exports = router;
