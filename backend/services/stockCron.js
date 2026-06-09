const cron = require('node-cron');
const StockAlert = require('../models/StockAlert');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { getSellers } = require('./dataForSeoApi');
const { sendNotification } = require('./notificationProducer');

const runStockCron = async () => {
  console.log('[Cron] 🕒 Stok kontrol işlemi başlatılıyor...');

  try {
    const alerts = await StockAlert.find().populate('product');

    if (alerts.length === 0) {
      console.log('[Cron] 📦 Bekleyen stok alarmı yok.');
      return { success: true, message: 'No alerts to process' };
    }

    const uniqueProducts = {};
    for (const alert of alerts) {
      if (alert.product && alert.product.sourceProductId) {
        if (!uniqueProducts[alert.product._id]) {
          uniqueProducts[alert.product._id] = {
            product: alert.product,
            users: []
          };
        }
        uniqueProducts[alert.product._id].users.push({ userId: alert.user, alertId: alert._id });
      }
    }

    for (const pId of Object.keys(uniqueProducts)) {
      const { product, users } = uniqueProducts[pId];

      console.log(`[Cron] 🕵️‍♂️ "${product.name}" için stok durumu kontrol ediliyor...`);
      
      try {
        const sellers = await getSellers(product.sourceProductId);

        if (sellers && sellers.length > 0) {
          console.log(`[Cron] 🎉 "${product.name}" tekrar stokta! ${users.length} kullanıcıya bildirilecek.`);

          product.sellers = sellers;
          product.inStock = true;
          product.lastScrapedAt = new Date();
          await product.save();

          for (const u of users) {
            // RabbitMQ kuyruğuna bildirim gönder
            const sent = await sendNotification({
              userId: u.userId,
              type: 'stock',
              title: 'Stok Alarmı',
              message: `Takip ettiğiniz "${product.name}" tekrar stoklara girdi! Hemen inceleyin.`,
              productId: product._id,
              productName: product.name,
            });

            // RabbitMQ kullanılamıyorsa doğrudan veritabanına yaz (fallback)
            if (!sent) {
              await Notification.create({
                user: u.userId,
                type: 'stock',
                title: 'Stok Alarmı',
                message: `Takip ettiğiniz "${product.name}" tekrar stoklara girdi! Hemen inceleyin.`,
                productId: product._id,
                productName: product.name,
                read: false
              });
            }
             
            await StockAlert.findByIdAndDelete(u.alertId);
          }
        } else {
             console.log(`[Cron] ❌ "${product.name}" hala stokta yok.`);
        }
      } catch (err) {
        console.error(`[Cron] 🚫 "${product.name}" için API hatası:`, err.message);
      }
    }

    console.log('[Cron] ✅ Stok kontrol işlemi tamamlandı.');
    return { success: true, message: 'Cron job completed successfully' };
  } catch (error) {
    console.error('[Cron] 🚨 Stok kontrol işleminde kritik hata:', error);
    return { success: false, error: error.message };
  }
};

const initCron = () => {
  cron.schedule('0 3,15 * * *', async () => {
    await runStockCron();
  });
};

module.exports = { runStockCron, initCron };
