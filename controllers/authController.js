const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Vérifie que les champs nécessaires sont présents
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields: name, email, and password" });
    }

    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crée un nouvel utilisateur
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Génère un token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);


        // Renvoie la réponse avec le message et le token
        res.json({ message: "User registered", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
};

module.exports = { register, login };
