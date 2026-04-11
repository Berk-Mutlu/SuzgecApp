const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  searchQueries: [{ type: String, lowercase: true, index: true }], 
  brand: { type: String }, 
  description: { type: String }, 
  imageUrl: { type: String }, 
  currentPrice: { type: Number, required: true }, 
  originalPrice: { type: Number },
  seller: { type: String },
  sellerLogo: { type: String },
  condition: { type: String, enum: ['new', 'used'], default: 'new' },
  category: { type: String },
  rating: { type: Number },
  priceChange: { type: Number },
  inStock: { type: Boolean, default: true }, 
  productUrl: { type: String, required: true }, 
  imageUrls: [{ type: String }], 
  specs: { type: mongoose.Schema.Types.Mixed },
  source: { type: String, default: 'manual' }, 
  sourceProductId: { type: String }, 
  lastScrapedAt: { type: Date }, 
  priceInfo: { type: String }, 
  sellers: [{
    siteName: { type: String, required: true },
    siteLogoUrl: { type: String },
    price: { type: Number, required: true },
    buyUrl: { type: String },
    freeShipping: { type: Boolean, default: false },
    isOutlet: { type: Boolean, default: false },
  }],

  priceHistory: [{
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

productSchema.index({ source: 1, sourceProductId: 1 }, { unique: true, sparse: true });

productSchema.index({ name: 'text' });

productSchema.index({ lastScrapedAt: -1 });

module.exports = mongoose.model('Product', productSchema);
