// File: app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// Database connection
connectDB();

// Serve static files (CSS, JS, images, fonts)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the authentication routes
app.use("/api/auth", authRoutes);

// Use the appointment routes at /api/appointments
app.use('/api/appointments', appointmentRoutes); // Ensure this line is correct

// Serve index.html when accessing the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});