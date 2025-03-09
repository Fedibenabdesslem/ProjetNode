require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const cors = require("cors");

// Database connection
connectDB();

// Configure CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    credentials: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Serve index.html at root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});