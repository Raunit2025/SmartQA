const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting: Bearer <token>
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

module.exports = auth;
