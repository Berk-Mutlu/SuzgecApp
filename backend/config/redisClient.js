const Redis = require('ioredis');

let redisClient = null;

/**
 * Redis bağlantısını oluşturur ve döndürür.
 * Vercel serverless ortamında bağlantı önbellekleme yapar.
 * Redis yoksa (ör. Vercel'de) hata vermez, null döner.
 */
const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null; // 3 denemeden sonra vazgeç
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      connectTimeout: 5000,
    });

    redisClient.on('connect', () => {
      console.log('[Redis] ✅ Redis bağlantısı kuruldu.');
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] ❌ Redis bağlantı hatası:', err.message);
    });

    redisClient.connect().catch(() => {
      console.warn('[Redis] ⚠️ Redis bağlantısı kurulamadı, önbelleksiz çalışılacak.');
      redisClient = null;
    });

    return redisClient;
  } catch (error) {
    console.warn('[Redis] ⚠️ Redis başlatılamadı:', error.message);
    return null;
  }
};

/**
 * Redis önbelleğinden veri al
 * @param {string} key - Önbellek anahtarı
 * @returns {Promise<object|null>}
 */
const cacheGet = async (key) => {
  const client = getRedisClient();
  if (!client) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('[Redis] Cache GET hatası:', err.message);
    return null;
  }
};

/**
 * Redis önbelleğine veri yaz
 * @param {string} key - Önbellek anahtarı
 * @param {object} value - Saklanacak veri
 * @param {number} ttl - Yaşam süresi (saniye), varsayılan 300 (5 dakika)
 */
const cacheSet = async (key, value, ttl = 300) => {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error('[Redis] Cache SET hatası:', err.message);
  }
};

/**
 * Redis önbelleğinden veri sil
 * @param {string} key - Silinecek anahtar
 */
const cacheDel = async (key) => {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    console.error('[Redis] Cache DEL hatası:', err.message);
  }
};

/**
 * JWT token'ı kara listeye ekle (logout işlemi için)
 * Token'ın kalan süresi kadar Redis'te tutulur.
 * @param {string} token - Kara listeye eklenecek JWT token
 * @param {number} expiresIn - Token'ın sona erme süresi (saniye)
 */
const blacklistToken = async (token, expiresIn) => {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.setex(`bl_${token}`, expiresIn, 'blacklisted');
    console.log('[Redis] 🚫 Token kara listeye eklendi.');
  } catch (err) {
    console.error('[Redis] Token blacklist hatası:', err.message);
  }
};

/**
 * JWT token'ın kara listede olup olmadığını kontrol et
 * @param {string} token - Kontrol edilecek token
 * @returns {Promise<boolean>}
 */
const isTokenBlacklisted = async (token) => {
  const client = getRedisClient();
  if (!client) return false;
  try {
    const result = await client.get(`bl_${token}`);
    return result !== null;
  } catch (err) {
    console.error('[Redis] Token blacklist kontrol hatası:', err.message);
    return false;
  }
};

module.exports = {
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDel,
  blacklistToken,
  isTokenBlacklisted,
};
