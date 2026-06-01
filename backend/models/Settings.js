const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName:    { type: String, default: 'Hot Wheels Bikes' },
  currency:     { type: String, default: 'PKR' },
  taxRate:      { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  lowStockDefault: { type: Number, default: 5 },
  invoicePrefix:   { type: String, default: 'HW' },
  address:      { type: String, default: 'DHA Phase 4, Karachi' },
  phone:        { type: String, default: '+92 336 1320540' },
  email:        { type: String, default: 'info@hotwheelsbikes.com' },
  // Payment Settings
  bankName:        { type: String, default: '' },
  bankAccountName: { type: String, default: '' },
  bankAccountNo:   { type: String, default: '' },
  bankIBAN:        { type: String, default: '' },
  jazzcashNumber:  { type: String, default: '' },
  jazzcashName:    { type: String, default: '' },
  easypaisaNumber: { type: String, default: '' },
  easypaisaName:   { type: String, default: '' },
  stripePublicKey: { type: String, default: '' },
  stripeEnabled:   { type: Boolean, default: false },
  codEnabled:      { type: Boolean, default: true },
  bankEnabled:     { type: Boolean, default: true },
  jazzcashEnabled: { type: Boolean, default: true },
  easypaisaEnabled:{ type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
