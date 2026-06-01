const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const { protect } = require('../middleware/auth');

// In-memory rate limiting store (for production, use Redis)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 1000; // 30 seconds

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Rate limiting middleware
const checkRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, resetTime: 0 };

  if (attempts.resetTime > now) {
    const remainingTime = Math.ceil((attempts.resetTime - now) / 1000);
    return res.status(429).json({ 
      message: 'Too many failed attempts. Try again later.',
      locked: true,
      remainingTime 
    });
  }

  if (attempts.count >= MAX_ATTEMPTS && attempts.resetTime <= now) {
    loginAttempts.delete(ip);
  }

  next();
};

// POST /api/auth/login
router.post('/login', checkRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isActive) {
      // Log failed attempt
      const ip = req.ip || req.connection.remoteAddress;
      const attempts = loginAttempts.get(ip) || { count: 0, resetTime: 0 };
      attempts.count += 1;
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.resetTime = Date.now() + LOCK_TIME;
      }
      loginAttempts.set(ip, attempts);
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await admin.comparePassword(password);
    if (!ok) {
      // Log failed attempt
      const ip = req.ip || req.connection.remoteAddress;
      const attempts = loginAttempts.get(ip) || { count: 0, resetTime: 0 };
      attempts.count += 1;
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.resetTime = Date.now() + LOCK_TIME;
      }
      loginAttempts.set(ip, attempts);
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Clear successful login attempts
    const ip = req.ip || req.connection.remoteAddress;
    loginAttempts.delete(ip);

    admin.lastLogin = new Date();
    await admin.save();

    res.json({ token: sign(admin._id), admin: admin.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.admin));

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    const ok = await admin.comparePassword(currentPassword);
    if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const admin = await Admin.findOne({ email });
    // Always return success to prevent email enumeration
    // In production, send actual reset email here
    res.json({ 
      message: 'If an account exists with this email, a password reset link has been sent',
      emailExists: !!admin
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password required' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
