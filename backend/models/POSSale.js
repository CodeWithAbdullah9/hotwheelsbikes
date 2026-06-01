const mongoose = require('mongoose');

const posItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const posSaleSchema = new mongoose.Schema({
  saleNumber:    { type: String, unique: true },
  operator:      { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  items:         [posItemSchema],
  subtotal:      { type: Number, required: true },
  discountType:  { type: String, enum: ['percent','fixed'], default: 'fixed' },
  discountValue: { type: Number, default: 0 },
  discountAmount:{ type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  total:         { type: Number, required: true },
  amountPaid:    { type: Number, default: 0 },
  change:        { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash','card','online'], default: 'cash' },
  customerName:  { type: String, default: 'Walk-in Customer' },
  customerPhone: { type: String, default: '' },
  note:          { type: String, default: '' },
}, { timestamps: true });

posSaleSchema.pre('save', async function(next) {
  if (!this.saleNumber) {
    const count = await mongoose.model('POSSale').countDocuments();
    this.saleNumber = `POS-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('POSSale', posSaleSchema);
