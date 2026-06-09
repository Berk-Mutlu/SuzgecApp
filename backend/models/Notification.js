const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['price_drop', 'stock_alert', 'stock', 'price_target', 'system', 'review'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  read: { type: Boolean, default: false },
  oldPrice: { type: Number },
  newPrice: { type: Number }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
