require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1); // Stop the server if the secret is not found
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header is missing or incorrect format');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    let message = 'Token is not valid';
    if (err.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }
    console.error('Error verifying token:', err);
    return res.status(401).json({ message });
  }
};

// Middleware to check user role
const checkRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: `Access denied. Requires ${role} role` });
  }
  next();
};

module.exports = { verifyToken, checkRole };