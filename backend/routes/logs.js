const router    = require('express').Router();
const SystemLog = require('../models/SystemLog');
const StockLog  = require('../models/StockLog');
const { protect, authorize } = require('../middleware/auth');

router.get('/system', protect, authorize('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const total = await SystemLog.countDocuments();
    const logs  = await SystemLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .skip((+page-1)*+limit).limit(+limit);
    res.json({ logs, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stock', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const total = await StockLog.countDocuments();
    const logs  = await StockLog.find()
      .populate('product', 'name sku')
      .populate('admin', 'name')
      .sort({ createdAt: -1 })
      .skip((+page-1)*+limit).limit(+limit);
    res.json({ logs, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
