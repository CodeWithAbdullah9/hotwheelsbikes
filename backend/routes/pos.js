const router   = require('express').Router();
const POSSale  = require('../models/POSSale');
const Product  = require('../models/Product');
const StockLog = require('../models/StockLog');
const { protect, authorize } = require('../middleware/auth');

// GET all POS sales
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, from, to } = req.query;
    const query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to)   query.createdAt.$lte = new Date(to + 'T23:59:59');
    }
    const total = await POSSale.countDocuments(query);
    const sales = await POSSale.find(query)
      .populate('operator', 'name')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json({ sales, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single POS sale
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await POSSale.findById(req.params.id).populate('operator', 'name email');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create POS sale
router.post('/', protect, async (req, res) => {
  try {
    const { items, discountType, discountValue, paymentMethod, customerName, customerPhone, amountPaid, note, taxRate } = req.body;

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    // Calculate totals
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    let discountAmount = 0;
    if (discountType === 'percent') discountAmount = (subtotal * discountValue) / 100;
    else discountAmount = discountValue || 0;

    const afterDiscount = subtotal - discountAmount;
    const tax   = (afterDiscount * (taxRate || 0)) / 100;
    const total = afterDiscount + tax;
    const change = (amountPaid || 0) - total;

    const sale = await POSSale.create({
      operator: req.admin._id,
      items,
      subtotal,
      discountType,
      discountValue: discountValue || 0,
      discountAmount,
      tax,
      total,
      amountPaid: amountPaid || total,
      change: Math.max(0, change),
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      note: note || '',
    });

    // Deduct stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      const before  = product.stock;
      product.stock -= item.quantity;
      await product.save();
      await StockLog.create({
        product: product._id, admin: req.admin._id,
        type: 'sale', quantity: item.quantity,
        before, after: product.stock,
        note: `POS Sale ${sale.saleNumber}`,
        reference: sale.saleNumber,
      });
    }

    const populated = await POSSale.findById(sale._id).populate('operator', 'name');
    res.status(201).json(populated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET POS summary stats
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [todaySales, totalSales, totalRevenue] = await Promise.all([
      POSSale.countDocuments({ createdAt: { $gte: today } }),
      POSSale.countDocuments(),
      POSSale.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);
    res.json({ todaySales, totalSales, totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
