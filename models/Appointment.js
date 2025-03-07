const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');  // Importe ton middleware

// Exemple de route protégée pour récupérer les rendez-vous
router.get('/appointments', verifyToken, async (req, res) => {
  try {
    // Simule une récupération des rendez-vous
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving appointments' });
  }
});

module.exports = router;
