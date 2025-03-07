require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  // Récupère le token de l'en-tête Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Ajoute les données du token à la requête
    next(); // Passe à la prochaine étape du middleware
  } catch (err) {
    // Gère les erreurs spécifiques de JWT
    let message = 'Token is not valid';
    if (err.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }
    return res.status(401).json({ message });
  }
};

// Middleware pour vérifier les rôles
const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Access denied. Requires ${role} role` });
  }
  next();
};

module.exports = { verifyToken, checkRole };