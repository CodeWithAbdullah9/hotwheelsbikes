const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const SystemLog = require('../models/SystemLog');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin   = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) return res.status(401).json({ message: 'Account inactive or not found' });

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role))
    return res.status(403).json({ message: 'Access denied' });
  next();
};

exports.log = (action, module) => async (req, res, next) => {
  try {
    await SystemLog.create({
      admin:   req.admin?._id,
      action,
      module,
      details: JSON.stringify({ body: req.body, params: req.params }),
      ip:      req.ip,
    });
  } catch {}
  next();
};
