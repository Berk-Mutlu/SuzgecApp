const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const { getRedisClient } = require('../config/redisClient');
const { getChannel } = require('../config/rabbitmqClient');
const { startConsumer } = require('../services/notificationConsumer');

dotenv.config();

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); 
  }
  next();
});

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    
    if (req.method === 'OPTIONS') return next();
    
    
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Middleware Error:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

app.use('/v1/auth', require('../routes/berkRoutes').authRouter);
app.use('/v1/users', require('../routes/berkRoutes').usersRouter);
app.use('/v1/products', require('../routes/berkRoutes').productsRouter);
app.use('/v1/comparisons', require('../routes/berkRoutes').comparisonsRouter);
app.use('/v1/lists', require('../routes/edaRoutes').listsRouter);
app.use('/v1/reviews', require('../routes/edaRoutes').reviewsRouter);
app.use('/v1/stock-alerts', require('../routes/berraRoutes').stockAlertsRouter);
app.use('/v1/price-alerts', require('../routes/berraRoutes').priceAlertsRouter);
app.use('/v1/notifications', require('../routes/berraRoutes').notificationsRouter);
app.use('/v1/ai', require('../routes/berraRoutes').aiRouter);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Süz-Geç API is running...' });
});

// Sağlık kontrolü endpoint'i (Docker health check için)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Süz-Geç API sağlıklı çalışıyor',
    services: {
      api: 'up',
      timestamp: new Date().toISOString()
    }
  });
});

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 9000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Redis bağlantısını başlat
    try {
      const redis = getRedisClient();
      if (redis) console.log('[Startup] 🔄 Redis bağlantısı başlatılıyor...');
    } catch (e) {
      console.warn('[Startup] ⚠️ Redis başlatılamadı, önbelleksiz devam edilecek.');
    }

    // RabbitMQ bağlantısını başlat ve consumer'ı çalıştır
    try {
      const channel = await getChannel();
      if (channel) {
        await startConsumer();
        console.log('[Startup] 🐰 RabbitMQ consumer başlatıldı.');
      }
    } catch (e) {
      console.warn('[Startup] ⚠️ RabbitMQ başlatılamadı, bildirimler doğrudan DB\'ye yazılacak.');
    }
  });
}

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('\n[Shutdown] 🛑 Sunucu kapatılıyor...');
  
  try {
    const { closeConnection } = require('../config/rabbitmqClient');
    await closeConnection();
  } catch (e) {}
  
  try {
    const redis = getRedisClient();
    if (redis) await redis.quit();
  } catch (e) {}

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
