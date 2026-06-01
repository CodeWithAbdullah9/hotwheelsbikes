const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  series:        { type: String, required: true, trim: true },
  year:          { type: Number, required: true },
  sku:           { type: String, unique: true, sparse: true },
  barcode:       { type: String, unique: true, sparse: true },
  price:         { type: Number, required: true, min: 0 },
  salePrice:     { type: Number, default: 0 },
  costPrice:     { type: Number, default: 0 },
  stock:         { type: Number, required: true, default: 0, min: 0 },
  lowStockAlert: { type: Number, default: 5 },
  image:         { type: String, default: '' },
  category:      { type: String, default: 'Hot Wheels' },
  description:   { type: String, default: '' },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockAlert;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
