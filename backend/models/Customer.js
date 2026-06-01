const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, unique: true, sparse: true, lowercase: true },
  password:       { type: String, default: null },
  phone:          { type: String, trim: true, default: '' },
  address:        { type: String, default: '' },
  city:           { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  googleId:       { type: String, default: null },
  isVerified:     { type: Boolean, default: false },
  totalOrders:    { type: Number, default: 0 },
  totalSpent:     { type: Number, default: 0 },
  isBlocked:      { type: Boolean, default: false },
  notes:          { type: String, default: '' },
  lastLogin:      { type: Date },
}, { timestamps: true });

customerSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

customerSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

customerSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Customer', customerSchema);
