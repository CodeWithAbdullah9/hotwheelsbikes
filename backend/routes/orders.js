const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const Customer = require('../models/Customer');
const { protect, authorize } = require('../middleware/auth');
const { notifyAdminNewOrder, sendOrderConfirmationToCustomer, sendWhatsAppNotification } = require('../utils/mailer');

// GET all orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, source, search, page = 1, limit = 20, from, to } = req.query;
    const query = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } },
    ];
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to + 'T23:59:59');
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('items.product', 'name image');

    res.json({ orders, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single order (admin protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single order PUBLIC (for order confirmation page — no auth)
router.get('/public/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });

    const prevStatus = order.status;
    order.status = status;
    if (status === 'cancelled') {
      order.cancelReason = cancelReason || '';
      // Restore stock if cancelling
      if (prevStatus !== 'cancelled') {
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            const before = product.stock;
            product.stock += item.quantity;
            await product.save();
            await StockLog.create({
              product: product._id, admin: req.admin._id,
              type: 'return', quantity: item.quantity,
              before, after: product.stock,
              note: `Order ${order.orderNumber} cancelled`,
              reference: order.orderNumber,
            });
          }
        }
      }
    }
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update full order
router.put('/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST create order from customer website (public — no auth required)
router.post('/', async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes, shippingCost, discount, tax } = req.body;

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ message: 'Customer name and phone are required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Build order items — use provided price/name directly (frontend static products)
    const mongoose = require('mongoose');
    const orderItems = items.map(item => ({
      ...(mongoose.isValidObjectId(item.product) ? { product: item.product } : {}),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      subtotal: Number(item.price) * Number(item.quantity),
    }));

    const subtotal = orderItems.reduce((s, i) => s + i.subtotal, 0);
    const discountAmt = discount || 0;
    const taxAmt = tax || 0;
    const shipping = shippingCost || 0;
    const total = subtotal - discountAmt + taxAmt + shipping;

    // Create order
    const order = await Order.create({
      customer,
      items: orderItems,
      subtotal,
      discount: discountAmt,
      tax: taxAmt,
      shippingCost: shipping,
      total,
      paymentMethod: paymentMethod || 'cod',
      source: 'online',
      notes: notes || '',
    });

    // Save/update customer record — email ya phone se
    const customerIdentifier = customer.email
      ? { email: customer.email }
      : { phone: customer.phone };

    if (customer.email || customer.phone) {
      await Customer.findOneAndUpdate(
        customerIdentifier,
        {
          $set: {
            name: customer.name,
            phone: customer.phone || '',
            email: customer.email || undefined,
            address: customer.address || '',
          },
          $inc: { totalOrders: 1, totalSpent: total },
        },
        { upsert: true, new: true }
      );
    }

    // Send email + WhatsApp notifications (non-blocking)
    const payLabel = { cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer', jazzcash: 'JazzCash', easypaisa: 'EasyPaisa', stripe: 'Card' }[order.paymentMethod] || order.paymentMethod;
    const waMsg = `*New Order - Hot Wheels Bikes*\n\nOrder: ${order.orderNumber}\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nTotal: Rs. ${order.total.toLocaleString()}\nPayment: ${payLabel}\nAddress: ${order.customer.address || 'N/A'}\n\nItems:\n${order.items.map(i => `- ${i.name} x${i.quantity}`).join('\n')}`;

    notifyAdminNewOrder(order).catch(() => { });
    sendOrderConfirmationToCustomer(order).catch(() => { });
    sendWhatsAppNotification(waMsg).catch(() => { });

    res.status(201).json({ order, orderNumber: order.orderNumber });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST create POS order (admin protected)
router.post('/pos', protect, async (req, res) => {
  try {
    const { customer, items, paymentMethod, discount, tax } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Validate stock and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      const itemPrice = product.salePrice && product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price;
      const itemSubtotal = itemPrice * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
      subtotal += itemSubtotal;

      // Update stock
      const before = product.stock;
      product.stock -= item.quantity;
      await product.save();

      // Create stock log
      await StockLog.create({
        product: product._id,
        admin: req.admin._id,
        type: 'sale',
        quantity: item.quantity,
        before,
        after: product.stock,
        note: `POS sale`,
        reference: `POS-${Date.now()}`,
      });
    }

    const discountAmt = discount || 0;
    const taxAmt = tax || 0;
    const total = subtotal - discountAmt + taxAmt;

    // Create order
    const order = await Order.create({
      customer: customer || { name: 'Walk-in Customer', phone: 'N/A' },
      items: orderItems,
      subtotal,
      discount: discountAmt,
      tax: taxAmt,
      shippingCost: 0,
      total,
      paymentMethod: paymentMethod || 'cash',
      source: 'pos',
      paymentStatus: 'paid',
      status: 'completed',
    });

    res.status(201).json({ order, orderNumber: order.orderNumber });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
