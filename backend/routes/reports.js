const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayOnline, weekOnline, monthOnline,
      todayPOS, weekPOS, monthPOS,
      totalProducts, lowStockCount,
      recentOrders, topProducts,
      dailyRevenue,
    ] = await Promise.all([
      Order.aggregate([{ $match: { createdAt: { $gte: today }, source: 'online' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: weekStart }, source: 'online' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: monthStart }, source: 'online' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: today }, source: 'pos' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: weekStart }, source: 'pos' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: monthStart }, source: 'pos' } }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$lowStockAlert'] } }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('items.product', 'name'),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
      // Last 7 days revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      today: { orders: todayOnline[0]?.count || 0, revenue: (todayOnline[0]?.revenue || 0) + (todayPOS[0]?.revenue || 0), pos: todayPOS[0]?.count || 0 },
      week: { orders: weekOnline[0]?.count || 0, revenue: (weekOnline[0]?.revenue || 0) + (weekPOS[0]?.revenue || 0), pos: weekPOS[0]?.count || 0 },
      month: { orders: monthOnline[0]?.count || 0, revenue: (monthOnline[0]?.revenue || 0) + (monthPOS[0]?.revenue || 0), pos: monthPOS[0]?.count || 0 },
      totalProducts, lowStockCount,
      recentOrders, topProducts, dailyRevenue,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Sales report
router.get('/sales', protect, async (req, res) => {
  try {
    const { from, to, groupBy = 'day' } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to + 'T23:59:59');
    }

    const fmt = groupBy === 'month' ? '%Y-%m' : groupBy === 'week' ? '%Y-W%V' : '%Y-%m-%d';

    const [onlineSales, posSales] = await Promise.all([
      Order.aggregate([
        { $match: { ...match, source: 'online' } },
        { $group: { _id: { $dateToString: { format: fmt, date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { ...match, source: 'pos' } },
        { $group: { _id: { $dateToString: { format: fmt, date: '$createdAt' } }, sales: { $sum: 1 }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ onlineSales, posSales });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Inventory report
router.get('/inventory', protect, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    const totalValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);
    const lowStock = products.filter(p => p.stock <= p.lowStockAlert);
    const outOfStock = products.filter(p => p.stock === 0);
    res.json({ products, totalValue, lowStock, outOfStock, totalProducts: products.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
