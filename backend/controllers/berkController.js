const User = require('../models/User');
const Product = require('../models/Product');
const Comparison = require('../models/Comparison');
const SearchHistory = require('../models/SearchHistory');
const jwt = require('jsonwebtoken');
const { sendNotification } = require('../services/notificationProducer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'suzgec_secret_key', { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Şifre en az 8 karakter olmalıdır' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Bu e-posta adresi zaten kullanımda' });
    const user = await User.create({ email, password, firstName, lastName });
    if (user) {
      // RabbitMQ: Yeni kullanıcıya "Hoş Geldiniz" bildirimi gönder
      await sendNotification({
        userId: user._id,
        type: 'system',
        title: 'Hoş Geldiniz! 🎉',
        message: `Merhaba ${firstName || 'Kullanıcı'}, Süz-Geç ailesine hoş geldiniz! Fiyat takibi, stok alarmları ve akıllı karşılaştırma özelliklerimizi keşfedin.`,
      });

      res.status(201).json({ success: true, _id: user._id, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(400).json({ success: false, message: 'Geçersiz kullanıcı verisi' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        success: true,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) { res.status(401).json({ description: 'Yetkisiz erişim' }); }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      await user.save();
      res.status(200).json({ message: 'Güncelleme başarılı' });
    } else res.status(404).json({ message: 'User not found' });
  } catch (error) { res.status(401).json({ description: 'Yetkisiz erişim' }); }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).send();
  } catch (error) { res.status(401).json({ description: 'Yetkisiz erişim' }); }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) res.status(200).json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.getProductSellers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });


    const cacheThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasSellers = product.sellers && product.sellers.length > 0;
    const hasImages = product.imageUrls && product.imageUrls.length > 0;
    const isFresh = product.lastScrapedAt && product.lastScrapedAt > cacheThreshold;

    if (hasSellers && hasImages && isFresh) {
      console.log(`[Cache] 🚀 "${product.name}" için veriler veritabanından getirildi.`);
      return res.status(200).json({
        sellers: product.sellers || [],
        imageUrls: product.imageUrls || [],
        specs: product.specs || {},
        currentPrice: product.currentPrice
      });
    }


    console.log(`[API] 🕵️‍♂️ "${product.name}" için yeni veriler çekiliyor (Stage 2)...`);
    const [sellers, details] = await Promise.all([
      dataForSeoApi.getSellers(product.sourceProductId),
      dataForSeoApi.getProductInfo(product.sourceProductId)
    ]);


    let updated = false;
    if (sellers && sellers.length > 0) {
      product.sellers = sellers;
      updated = true;

      // Ana fiyatı en ucuz satıcı fiyatıyla senkronize et
      const prices = sellers.map(s => s.price).filter(p => p > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        if (product.currentPrice !== minPrice) {
          product.currentPrice = minPrice;
          // Fiyat geçmişine ekle
          if (!product.priceHistory) product.priceHistory = [];
          product.priceHistory.push({ date: new Date(), price: minPrice });
        }
      }
    }

    if (details.imageUrls && details.imageUrls.length > 0) {
      product.imageUrls = details.imageUrls;
      updated = true;
    }

    if (details.specs && Object.keys(details.specs).length > 0) {
      product.specs = details.specs;
      updated = true;
    }

    if (updated) {
      product.lastScrapedAt = new Date();
      await product.save();
    }

    res.status(200).json({
      sellers: product.sellers || [],
      imageUrls: product.imageUrls || [],
      specs: product.specs || {},
      currentPrice: product.currentPrice
    });
  } catch (error) {
    console.error(`[Sellers] Error:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.resolveAdUrl = async (req, res) => {
  try {
    const { url, productId, siteName } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL belirtilmedi' });


    if (productId && siteName) {
      const product = await Product.findById(productId);
      if (product && product.sellers) {
        const seller = product.sellers.find(s => s.siteName === siteName);
        if (seller && seller.buyUrl && !seller.buyUrl.includes('google.com/aclk')) {
          console.log(`[Cache] 🔗 "${siteName}" için çözülmüş link veritabanından getirildi.`);
          return res.status(200).json({ success: true, url: seller.buyUrl });
        }
      }
    }


    if (!url.includes('google.com/aclk')) {
      return res.status(200).json({ success: true, url: url });
    }


    console.log(`[API] 🔗 Link çözümleniyor (DataForSEO)...`);
    const finalUrl = await dataForSeoApi.resolveAdUrl(url);

    if (finalUrl) {

      if (productId && siteName) {
        await Product.updateOne(
          { _id: productId, "sellers.siteName": siteName },
          { $set: { "sellers.$.buyUrl": finalUrl } }
        );
      }
      res.status(200).json({ success: true, url: finalUrl });
    } else {
      res.status(400).json({ success: false, message: 'Link çözülemedi' });
    }
  } catch (error) {
    console.error(`[ResolveAdUrl] Error:`, error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getComparison = async (req, res) => {
  try {
    const comparison = await Comparison.findOne({ user: req.user._id }).populate('items');
    res.status(200).json({ success: true, data: comparison || { items: [] } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.addToComparison = async (req, res) => {
  try {
    const { productId } = req.body;
    let comparison = await Comparison.findOne({ user: req.user._id });
    if (!comparison) comparison = await Comparison.create({ user: req.user._id, items: [] });


    const itemStrings = comparison.items.map(id => id.toString());
    if (!itemStrings.includes(productId)) {
      comparison.items.push(productId);
      await comparison.save();
    }
    res.status(201).json({ success: true, message: 'Ürün karşılaştırmaya eklendi' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.removeFromComparison = async (req, res) => {
  try {
    const comparison = await Comparison.findOne({ user: req.user._id });
    if (!comparison) {
      return res.status(404).json({ success: false, message: 'Karşılaştırma listesi bulunamadı' });
    }

    const itemExists = comparison.items.some(item => item.toString() === req.params.itemId);
    if (!itemExists) {
      return res.status(404).json({ success: false, message: 'Ürün listede bulunamadı (Geçersiz veya boş ID)' });
    }

    comparison.items = comparison.items.filter(item => item.toString() !== req.params.itemId);
    await comparison.save();

    res.status(200).json({ success: true, message: 'Ürün karşılaştırmadan çıkarıldı' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

const { calculateRelevanceScore, normalizeQuery } = require('../utils/searchNormalizer');
const dataForSeoApi = require('../services/dataForSeoApi');

const CACHE_HOURS = 24;

exports.searchProducts = async (req, res) => {
  try {
    const rawQuery = (req.query?.q || req.body?.query || '').trim();
    if (!rawQuery) {
      const count = req.query.limit ? parseInt(req.query.limit) : 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const skip = (page - 1) * count;

      // Tek sorgu ile rastgele ürünler çek — N+1 sorgu problemi çözümü
      const products = await Product.aggregate([
        { $skip: skip },
        { $sample: { size: count } }
      ]);

      if (!products || products.length === 0) {
        const fallback = await Product.find({}).skip(skip).limit(count);
        return res.status(200).json(fallback);
      }
      return res.status(200).json(products);
    }

    const canonicalQuery = normalizeQuery(rawQuery);
    if (!canonicalQuery) return res.status(200).json([]);

    // Synonym haritası
    const synonymMap = {
      'televizyon': ['tv', 'television', 'smart tv'],
      'tv': ['televizyon', 'television', 'smart tv'],
      'bilgisayar': ['laptop', 'notebook', 'pc', 'computer'],
      'laptop': ['bilgisayar', 'notebook'],
      'telefon': ['phone', 'smartphone', 'cep telefonu'],
      'kulaklık': ['headphone', 'earphone', 'earbuds', 'headset'],
      'tablet': ['ipad'],
      'saat': ['watch', 'smartwatch'],
      'kamera': ['camera'],
    };

    // Arama terimlerini synonymlerle genişlet
    const queryWords = rawQuery.toLowerCase().split(/\s+/);
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Her kelime için: kelime VEYA synonym'leri eşleşmeli
    // Tüm kelimeler AND ile bağlanacak — hepsi isimde bulunmalı
    const wordConditions = queryWords.map(word => {
      const alternatives = [escapeRegex(word)];
      if (synonymMap[word]) {
        synonymMap[word].forEach(syn => alternatives.push(escapeRegex(syn)));
      }
      // Bu kelime veya synonymlerinden biri isimde olmalı
      return { name: { $regex: alternatives.join('|'), $options: 'i' } };
    });

    let matchedProducts = await Product.find({
      $or: [
        { searchQueries: canonicalQuery },
        { $and: wordConditions }
      ]
    }).limit(200);

    // DataForSEO — taze veri yoksa veya az sonuç varsa
    const cacheThreshold = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000);
    const hasFreshCache = matchedProducts.length > 0 && matchedProducts.some(p => p.lastScrapedAt && p.lastScrapedAt > cacheThreshold);

    if (!hasFreshCache || matchedProducts.length < 5) {
      console.log(`[Search] 🔍 Taze veri çekiliyor (DataForSEO): "${rawQuery}"`);
      const dfsProducts = await dataForSeoApi.searchShopping(rawQuery);

      if (dfsProducts.length > 0) {
        for (const sp of dfsProducts) {
          try {
            const existing = await Product.findOne({ sourceProductId: sp.product_id, source: 'dataforseo' });
            if (existing) {
              existing.name = sp.title;
              existing.imageUrl = sp.image_url;
              existing.currentPrice = sp.price;
              existing.lastScrapedAt = new Date();
              if (!existing.searchQueries.includes(canonicalQuery)) {
                existing.searchQueries.push(canonicalQuery);
              }
              await existing.save();
            } else {
              await Product.create({
                name: sp.title, productUrl: sp.product_url, imageUrl: sp.image_url,
                currentPrice: sp.price, rating: sp.rating, source: 'dataforseo',
                sourceProductId: sp.product_id, searchQueries: [canonicalQuery],
                lastScrapedAt: new Date(),
                priceHistory: sp.price ? [{ date: new Date(), price: sp.price }] : []
              });
            }
          } catch (upsertErr) {
            console.error('[Search] Upsert hatası:', upsertErr);
          }
        }
        // Yeni verilerle tekrar sorgula
        matchedProducts = await Product.find({
          $or: [
            { searchQueries: canonicalQuery },
            { $and: wordConditions }
          ]
        }).limit(200);
      }
    }

    // ─── Tier-Based Sıralama ───
    // Tier 1: searchQueries tag eşleşmesi (daha önce bu arama için bulunan asıl ürünler)
    // Tier 2: İsimde tam arama ifadesi + aksesuar değil
    // Tier 3: İsimde tam arama ifadesi + aksesuar olabilir
    // Tier 4: İsimde synonym eşleşmesi
    // Tier 5: Kısmi eşleşme
    const rawLower = rawQuery.toLowerCase();

    // Aksesuar/mobilya kelimeleri — ana ürün değil, aksesuar olduğunu gösterir
    const accessoryWords = [
      'sehpa', 'sehpası', 'stand', 'standı', 'standi', 'konsol', 'konsolu',
      'dolap', 'dolabı', 'ünite', 'ünitesi', 'raf', 'raflı', 'rafli',
      'mount', 'askı', 'askılık', 'kılıf', 'kilif', 'çanta', 'canta',
      'cam', 'koruyucu', 'aksesuar', 'aparatı', 'tutucu', 'şarj', 'kablo',
      'adaptör', 'adapter', 'çantası', 'kapak', 'cover', 'case'
    ];

    const rankedProducts = matchedProducts.map(p => {
      const nameLower = p.name.toLowerCase();
      const isAccessory = accessoryWords.some(w => nameLower.includes(w));
      const hasTagMatch = p.searchQueries && p.searchQueries.includes(canonicalQuery);
      let tier = 5;

      // Tam ifade eşleşmesi
      const hasExactMatch = nameLower.includes(rawLower);
      // Synonym eşleşmesi
      const hasSynonymMatch = !hasExactMatch && queryWords.every(word => {
        if (nameLower.includes(word)) return true;
        const syns = synonymMap[word] || [];
        return syns.some(s => nameLower.includes(s.toLowerCase()));
      });

      if (hasTagMatch && !isAccessory) {
        tier = 1; // Tag eşleşmesi + ana ürün = en yüksek öncelik
      } else if (hasExactMatch && !isAccessory) {
        tier = 2; // Tam eşleşme + ana ürün
      } else if (hasExactMatch && isAccessory) {
        tier = 3; // Tam eşleşme ama aksesuar
      } else if (hasSynonymMatch && !isAccessory) {
        tier = 2; // Synonym + ana ürün
      } else if (hasSynonymMatch && isAccessory) {
        tier = 4; // Synonym + aksesuar
      } else if (hasTagMatch) {
        tier = 3; // Tag var ama başka bir şekilde eşleşmiş
      }

      return {
        ...p.toObject(),
        _tier: tier,
        _freshness: p.lastScrapedAt ? p.lastScrapedAt.getTime() : 0
      };
    });

    // Sırala: tier (düşük=daha alakalı) → tazelik (yeni=üstte)
    rankedProducts.sort((a, b) => {
      if (a._tier !== b._tier) return a._tier - b._tier;
      return b._freshness - a._freshness;
    });

    // Dahili alanları temizle, ilk 50'yi döndür
    const finalProducts = rankedProducts.slice(0, 50).map(({ _tier, _freshness, ...clean }) => clean);

    if (req.user && rawQuery) {
      try {
        await SearchHistory.findOneAndUpdate(
          { user: req.user._id, query: rawQuery },
          { $set: { resultCount: finalProducts.length, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true, new: true }
        );
      } catch (err) { }
    }

    console.log(`[Search] ✅ "${rawQuery}" → ${finalProducts.length} ürün sunuluyor.`);
    res.status(200).json(finalProducts);
  } catch (error) {
    console.error(`[Search] Genel Sistem Hatası: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(10);
    res.status(200).json(history);
  } catch (error) { res.status(400).json({ error: error.message }); }
};
