const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// ----------Verify JWT Token---------
// Verify JWT token and attach user info to request object
exports.verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from database with division and OU details
    const user = await User.findById(decoded.id)
      .populate('division')
      .populate('organizationalUnit');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }

    // Check if user account is active
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive.'
      });
    }

    // Attach user data to request for use in controllers
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      division: user.division,
      organizationalUnit: user.organizationalUnit
    };

    next();
  } catch (error) {
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error verifying token',
      error: error.message
    });
  }
};

// ----------Verify user is management or admin---------
// Verify user is management or admin
exports.isManagementOrAdmin = (req, res, next) => {
  if (req.user.role === 'management' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Management or Admin role required.'
    });
  }
};

//  --------Verify user is admin---------
// Verify user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};
