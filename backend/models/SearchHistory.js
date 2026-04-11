const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  resultCount: { type: Number, default: 0 },
  category: { type: String }
}, { timestamps: true });

searchHistorySchema.index({ user: 1, query: 1 }, { unique: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
