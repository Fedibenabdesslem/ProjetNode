const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret_key';  // Vérifie que tu utilises le même secret ici


const verifyToken = (req, res, next) => {
  // Vérifie si le token est présent dans l'en-tête Authorization
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

  console.log('Authorization Header:', req.header('Authorization'));  // Vérifie l'en-tête (à supprimer en production)

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Ajoute les données du token à la requête
    next(); // Passe à la prochaine étape du middleware
  } catch (err) {
    console.error('Token verification error:', err);  // Log l'erreur pour débogage
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { verifyToken };
