const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/redisMiddleware');
const {
  getStockAlerts, createStockAlert, deleteStockAlert,
  getPriceAlerts, createPriceAlert, updatePriceAlert, deletePriceAlert,
  getNotifications, markNotificationRead, deleteNotification
} = require('../controllers/berraController');
const { runStockCron } = require('../services/stockCron');

const stockAlertsRouter = express.Router();

stockAlertsRouter.get('/trigger-cron', async (req, res) => {
  if (req.query.secret !== (process.env.CRON_SECRET || 'suzgeccron123')) {
     return res.status(401).json({ error: 'Unauthorized' });
  }
  const result = await runStockCron();
  if (result.success) res.status(200).json(result);
  else res.status(500).json(result);
});

stockAlertsRouter.use(protect);
stockAlertsRouter.route('/').get(getStockAlerts).post(createStockAlert);
stockAlertsRouter.route('/:alertId').delete(deleteStockAlert);

const priceAlertsRouter = express.Router();
priceAlertsRouter.use(protect);
priceAlertsRouter.route('/').get(getPriceAlerts).post(createPriceAlert);
priceAlertsRouter.route('/:alertId').put(updatePriceAlert).delete(deletePriceAlert);

const notificationsRouter = express.Router();
notificationsRouter.use(protect);
// Redis: Bildirimleri önbellekle (TTL: 60 saniye)
notificationsRouter.route('/').get(cacheMiddleware(60), getNotifications);
notificationsRouter.route('/:id/read').put(markNotificationRead);
notificationsRouter.route('/:id').delete(deleteNotification);

const { aiCompareProducts } = require('../controllers/berraController');
const aiRouter = express.Router();
aiRouter.use(protect);
aiRouter.route('/compare').post(aiCompareProducts);

module.exports = { stockAlertsRouter, priceAlertsRouter, notificationsRouter, aiRouter };
