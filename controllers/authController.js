const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fonction pour enregistrer un nouvel utilisateur
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation des champs
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Veuillez fournir tous les champs requis : nom, email et mot de passe" });
    }

    // Validation de l'email avec une expression régulière
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email invalide" });
    }

    // Validation du mot de passe (ex: longueur minimale de 6 caractères)
    if (password.length < 8) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crée un nouvel utilisateur
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Génère un token JWT avec une expiration
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Renvoie la réponse sans le mot de passe hashé
        res.status(201).json({ message: "Utilisateur enregistré avec succès", token });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Fonction pour connecter un utilisateur
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez fournir un email et un mot de passe" });
    }

    try {
        // Trouve l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Vérifie le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Génère un token JWT avec une expiration
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Renvoie la réponse avec le token
        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = { register, login }; 