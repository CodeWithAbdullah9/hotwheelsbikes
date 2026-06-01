const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  subtotal:  { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name:    { type: String, required: true },
    email:   { type: String },
    phone:   { type: String },
    address: { type: String },
  },
  items:         [orderItemSchema],
  subtotal:      { type: Number, required: true },
  discount:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  shippingCost:  { type: Number, default: 0 },
  total:         { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod','bank_transfer','jazzcash','easypaisa','stripe','card','online','cash'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentScreenshot: { type: String, default: '' },
  stripePaymentIntentId: { type: String, default: '' },
  status:        { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  cancelReason:  { type: String, default: '' },
  notes:         { type: String, default: '' },
  source:        { type: String, enum: ['online','pos'], default: 'online' },
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `HW-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
