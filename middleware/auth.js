const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};