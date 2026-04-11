const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: String,
    required: [true, 'Ürün ID zorunludur.']
  },
  rating: {
    type: Number,
    required: [true, 'Değerlendirme puanı zorunludur.'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Yorum 500 karakterden uzun olamaz.']
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
