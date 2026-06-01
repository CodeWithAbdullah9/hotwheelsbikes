const router  = require('express').Router();
const Order   = require('../models/Order');
const Settings = require('../models/Settings');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// Multer for payment screenshots
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = 'uploads/payments';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET public payment settings (for checkout page)
router.get('/settings', async (req, res) => {
  try {
    const s = await Settings.findOne();
    res.json({
      bankName:        s?.bankName        || '',
      bankAccountName: s?.bankAccountName || '',
      bankAccountNo:   s?.bankAccountNo   || '',
      bankIBAN:        s?.bankIBAN        || '',
      jazzcashNumber:  s?.jazzcashNumber  || '',
      jazzcashName:    s?.jazzcashName    || '',
      easypaisaNumber: s?.easypaisaNumber || '',
      easypaisaName:   s?.easypaisaName   || '',
      stripePublicKey: s?.stripePublicKey || '',
      codEnabled:      s?.codEnabled      ?? true,
      bankEnabled:     s?.bankEnabled     ?? true,
      jazzcashEnabled: s?.jazzcashEnabled ?? true,
      easypaisaEnabled:s?.easypaisaEnabled?? true,
      stripeEnabled:   s?.stripeEnabled   ?? false,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST upload payment screenshot
router.post('/screenshot/:orderId', upload.single('screenshot'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    order.paymentScreenshot = `/uploads/payments/${req.file.filename}`;
    order.paymentStatus = 'pending'; // awaiting admin verification
    await order.save();

    res.json({ message: 'Screenshot uploaded', screenshot: order.paymentScreenshot });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create Stripe payment intent
router.post('/stripe/create-intent', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('YOUR_')) {
      return res.status(400).json({ message: 'Stripe not configured' });
    }
    const stripe = require('stripe')(stripeKey);
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'pkr',
      metadata: { orderId },
    });
    res.json({ clientSecret: intent.client_secret, intentId: intent.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST confirm Stripe payment
router.post('/stripe/confirm', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('YOUR_')) {
      return res.status(400).json({ message: 'Stripe not configured' });
    }
    const stripe = require('stripe')(stripeKey);
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status === 'succeeded') {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.stripePaymentIntentId = paymentIntentId;
        await order.save();
      }
      res.json({ success: true });
    } else {
      res.status(400).json({ message: `Payment status: ${intent.status}` });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
