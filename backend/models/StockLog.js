const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  admin:     { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  type:      { type: String, enum: ['add','remove','adjust','sale','return'], required: true },
  quantity:  { type: Number, required: true },
  before:    { type: Number, required: true },
  after:     { type: Number, required: true },
  note:      { type: String, default: '' },
  reference: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('StockLog', stockLogSchema);
