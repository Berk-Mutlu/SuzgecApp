const { cacheGet, cacheSet } = require('../config/redisClient');

/**
 * Redis önbellekleme middleware'i.
 * GET isteklerinde önce Redis'e bakar, varsa direkt döner.
 * Yoksa isteği controller'a yönlendirir ve sonucu cache'e yazar.
 * 
 * @param {number} ttl - Önbellek süresi (saniye), varsayılan 300
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Sadece GET istekleri önbelleklenir
    if (req.method !== 'GET') return next();

    // Kullanıcıya özel cache key oluştur
    const userId = req.user ? req.user._id : 'public';
    const cacheKey = `cache:${userId}:${req.originalUrl}`;

    try {
      const cachedData = await cacheGet(cacheKey);
      
      if (cachedData) {
        console.log(`[Redis Cache] ✅ Önbellekten döndürüldü: ${req.originalUrl}`);
        return res.status(200).json(cachedData);
      }

      // Cache miss — orijinal res.json'ı yakala ve cache'e yaz
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        // Sadece başarılı yanıtları önbelleğe al
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheSet(cacheKey, data, ttl).catch(() => {});
          console.log(`[Redis Cache] 📝 Önbelleğe yazıldı: ${req.originalUrl} (TTL: ${ttl}s)`);
        }
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error('[Redis Cache] Middleware hatası:', err.message);
      next(); // Hata durumunda önbelleksiz devam et
    }
  };
};

module.exports = { cacheMiddleware };
