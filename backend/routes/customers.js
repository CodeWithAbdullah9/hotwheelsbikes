const router   = require('express').Router();
const Customer = require('../models/Customer');
const Order    = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    const total     = await Customer.countDocuments(query);
    const customers = await Customer.find(query).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit);
    res.json({ customers, total, page: +page, pages: Math.ceil(total/+limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Not found' });
    const orders = await Order.find({ 'customer.email': customer.email }).sort({ createdAt: -1 }).limit(20);
    res.json({ customer, orders });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, authorize('super_admin'), async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/block', protect, authorize('super_admin'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
