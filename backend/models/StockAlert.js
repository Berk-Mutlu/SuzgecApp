const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String }
}, { timestamps: true });

stockAlertSchema.index({ user: 1 });

module.exports = mongoose.model('StockAlert', stockAlertSchema);
