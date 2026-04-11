const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

comparisonSchema.index({ user: 1 });

module.exports = mongoose.model('Comparison', comparisonSchema);
