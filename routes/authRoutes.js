const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Appointment = require("../models/Appointment"); 
const { verifyToken, checkRole } = require("../middleware/authMiddleware");  
const { getUserAppointments } = require("../controllers/appointmentController");  // <-- Import createAppointment here

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "Email already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword, role: role || 'client' }); // Default role is 'client'
  
      await user.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(201).json({ token, message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
// Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token, message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
// Get all users (Protected Route)
router.get("/users", verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, "name email"); 
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get logged-in user details
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get('/user', verifyToken, getUserAppointments);

router.post('/appointments', verifyToken, checkRole('client'), async (req, res) => {
    const { name, email, phone, department, doctor, date, message } = req.body;
  
    try {
      const newAppointment = new Appointment({
        name,
        email,
        phone,
        department,
        doctor,
        date,
        message,
        status: "scheduled", // Default status
        created_at: Date.now()
      });
  
      await newAppointment.save();
  
      res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
