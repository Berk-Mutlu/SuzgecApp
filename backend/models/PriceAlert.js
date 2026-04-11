const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String },
  targetPrice: { type: Number, required: true },
  currentPrice: { type: Number },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

priceAlertSchema.index({ user: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
