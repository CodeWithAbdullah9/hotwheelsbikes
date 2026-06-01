const router   = require('express').Router();
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const Customer = require('../models/Customer');
const Order    = require('../models/Order');

const signToken = (id) =>
  jwt.sign({ id, type: 'customer' }, process.env.USER_JWT_SECRET, { expiresIn: process.env.USER_JWT_EXPIRES_IN });

// Middleware — protect user routes
const protectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
    if (decoded.type !== 'customer') return res.status(401).json({ message: 'Invalid token' });
    const user = await Customer.findById(decoded.id).select('-password');
    if (!user || user.isBlocked) return res.status(401).json({ message: 'Account not found or blocked' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ─── REGISTER ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await Customer.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await Customer.create({ name, email, password, phone: phone || '', isVerified: true });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ─── LOGIN ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await Customer.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (user.isBlocked) return res.status(401).json({ message: 'Account is blocked' });
    if (!user.password) return res.status(401).json({ message: 'Please login with Google' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── GET CURRENT USER ───────────────────────────────────────
router.get('/me', protectUser, (req, res) => res.json(req.user));

// ─── UPDATE PROFILE ─────────────────────────────────────────
router.put('/profile', protectUser, async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    const user = await Customer.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, city },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ─── CHANGE PASSWORD ────────────────────────────────────────
router.put('/change-password', protectUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await Customer.findById(req.user._id);
    if (!user.password) return res.status(400).json({ message: 'No password set (Google account)' });
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ─── MY ORDERS ──────────────────────────────────────────────
router.get('/orders', protectUser, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { 'customer.email': req.user.email };
    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json({ orders, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── SINGLE ORDER ───────────────────────────────────────────
router.get('/orders/:id', protectUser, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, 'customer.email': req.user.email });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── GOOGLE OAUTH ───────────────────────────────────────────
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.toSafeObject()))}`);
  }
);

module.exports = router;
module.exports.protectUser = protectUser;
