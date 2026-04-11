const StockAlert = require('../models/StockAlert');
const PriceAlert = require('../models/PriceAlert');

exports.getStockAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    
    const formatted = alerts.filter(a => a.product).map(a => ({
      _id: a._id,
      productId: a.product._id,
      productName: a.product.name,
      createdAt: a.createdAt,
      product: a.product 
    }));
    
    res.status(200).json({ success: true, data: formatted });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createStockAlert = async (req, res) => {
  try {
    const { productId } = req.body;
    
    
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    
    const existing = await StockAlert.findOne({ user: req.user._id, product: productId });
    if (existing) {
        return res.status(400).json({ success: false, error: 'Bu ürün zaten takip listenizde' });
    }

    await StockAlert.create({ user: req.user._id, product: productId, productName: product.name });
    res.status(201).json({ success: true, message: 'Takibe alındı' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteStockAlert = async (req, res) => {
  try {
    await StockAlert.findOneAndDelete({ _id: req.params.alertId, user: req.user._id });
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.getPriceAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user: req.user._id }).populate('product').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createPriceAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const alert = await PriceAlert.create({ 
        user: req.user._id, 
        product: productId, 
        targetPrice, 
        productName: product.name, 
        currentPrice: product.currentPrice 
    });
    
    res.status(201).json({ success: true, message: 'Alarm kuruldu', data: alert });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updatePriceAlert = async (req, res) => {
  try {
    const { targetPrice, enabled } = req.body;
    const updateData = {};
    if (targetPrice !== undefined) updateData.targetPrice = targetPrice;
    if (enabled !== undefined) updateData.enabled = enabled;

    const alert = await PriceAlert.findOneAndUpdate(
      { _id: req.params.alertId, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json({ success: true, message: 'Güncellendi', data: alert });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deletePriceAlert = async (req, res) => {
  try {
    await PriceAlert.findOneAndDelete({ _id: req.params.alertId, user: req.user._id });
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const { GoogleGenAI } = require('@google/genai');

exports.aiCompareProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length < 2) {
      return res.status(400).json({ error: 'Lütfen karşılaştırmak için en az 2 ürün seçin.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Sunucu ayarlarında Gemini API Anahtarı eksik (GEMINI_API_KEY).' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let productDetails = products.map((p, i) => 
      `${i + 1}. Ürün Adı: ${p.name}
       Satıcı: ${p.seller}
       Fiyat: ${p.price || p.currentPrice} ₺
       Özellikler: ${JSON.stringify(p.specs || {})}`
    ).join('\n\n');

    const prompt = `Sen Süz-Geç uygulamasının enerjik, trendleri yakından takip eden ve sosyal medya diline tam hakim "Gen Z" ruhlu bir alışveriş asistanısın. Görevin, aşağıda detayları verilen ürünlerden hangisinin öne çıktığını SADECE DİREKT 2-3 CÜMLEYLE BELİRTMEKTİR. Kesinlikle uzzzzuuun teknik listeler veya madde imleri KULLANMA. Bolca popüler jenerasyon jargonu, sıcak bir internet dili ve havalı emojiler 🚀🔥✨ kullanarak net kararını açıkla! Seni kasan bir robot gibi değil, arkadaşlarına DM atıyormuş gibi hisset.\n\nKarşılaştırılacak Ürünler:\n${productDetails}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ success: true, advice: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Yapay zeka ile iletişim kurulurken bir hata oluştu.' });
  }
};
