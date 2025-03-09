require('dotenv').config();
const jwt = require('jsonwebtoken');

// Ensure JWT_SECRET is available
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('⚠️ JWT_SECRET is not defined in environment variables. Please check your .env file.');
}

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      console.error('❌ No token provided.');
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (err) {
    let message = 'Invalid token';
    if (err.name === 'TokenExpiredError') message = 'Token has expired';
    else if (err.name === 'JsonWebTokenError') message = 'Invalid token signature';

    console.error(`❌ Token verification failed: ${message}`, err);
    return res.status(401).json({ message });
  }
};

// ✅ Middleware to check user role
const checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.error('❌ Role missing from user payload.');
    return res.status(403).json({ message: 'Access denied. User role is missing.' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    console.error(`❌ Unauthorized access: Requires role ${allowedRoles.join(' or ')}, but user has ${req.user.role}.`);
    return res.status(403).json({ message: `Access denied. Requires role: ${allowedRoles.join(' or ')}` });
  }

  next();
};

module.exports = { verifyToken, checkRole };
