const router = require('express').Router();
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = 'uploads/products';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all products (public for frontend) - only active products
router.get('/public', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name category price salePrice stock image sku description _id')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET all products (protected for admin) - only active products
router.get('/', protect, async (req, res) => {
  try {
    const { search, series, minPrice, maxPrice, stockStatus, page = 1, limit = 100 } = req.query;
    const query = { isActive: true };  // Always filter out deleted products

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { series: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
    if (series) query.series = { $regex: series, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }
    if (stockStatus === 'low') query.$expr = { $lte: ['$stock', '$lowStockAlert'] };
    if (stockStatus === 'out') query.stock = 0;
    if (stockStatus === 'in') query.stock = { $gt: 0 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ products, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET low stock products — MUST be before /:id route
router.get('/alerts/low-stock', protect, async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockAlert'] },
    }).sort({ stock: 1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single product
router.get('/:id', protect, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create product
router.post('/', protect, authorize('super_admin', 'inventory_manager'), upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/products/${req.file.filename}`;
    const product = await Product.create(data);

    await StockLog.create({
      product: product._id, admin: req.admin._id,
      type: 'add', quantity: product.stock,
      before: 0, after: product.stock,
      note: 'Initial stock on product creation',
    });

    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update product
router.put('/:id', protect, authorize('super_admin', 'inventory_manager'), upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    const oldStock = product.stock;
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/products/${req.file.filename}`;

    Object.assign(product, data);
    await product.save();

    if (+req.body.stock !== oldStock) {
      await StockLog.create({
        product: product._id, admin: req.admin._id,
        type: 'adjust', quantity: Math.abs(+req.body.stock - oldStock),
        before: oldStock, after: +req.body.stock,
        note: req.body.stockNote || 'Manual adjustment',
      });
    }

    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE product (soft delete)
router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET stock logs for a product
router.get('/:id/stock-logs', protect, async (req, res) => {
  try {
    const logs = await StockLog.find({ product: req.params.id })
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST bulk import CSV
router.post('/bulk/import', protect, authorize('super_admin', 'inventory_manager'), async (req, res) => {
  try {
    const { products } = req.body;
    const results = await Product.insertMany(products, { ordered: false });
    res.json({ imported: results.length });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET export CSV data
router.get('/bulk/export', protect, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
