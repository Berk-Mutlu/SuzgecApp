const amqp = require('amqplib');

let connection = null;
let channel = null;

const NOTIFICATION_QUEUE = 'notification_queue';

/**
 * RabbitMQ bağlantısını oluşturur ve kanalı döndürür.
 * @returns {Promise<object|null>} RabbitMQ kanalı
 */
const getChannel = async () => {
  if (channel) return channel;

  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      connection = await amqp.connect(rabbitmqUrl);
      channel = await connection.createChannel();

      // Bildirim kuyruğunu oluştur (yoksa)
      await channel.assertQueue(NOTIFICATION_QUEUE, {
        durable: true, // Sunucu yeniden başlatılsa bile kuyruk korunur
      });

      console.log('[RabbitMQ] ✅ RabbitMQ bağlantısı kuruldu.');
      console.log(`[RabbitMQ] 📬 "${NOTIFICATION_QUEUE}" kuyruğu hazır.`);

      // Bağlantı kapandığında temizle ve yeniden bağlan
      connection.on('close', () => {
        console.warn('[RabbitMQ] ⚠️ Bağlantı kapandı. Yeniden bağlanılıyor...');
        channel = null;
        connection = null;
        setTimeout(() => getChannel(), 5000);
      });

      connection.on('error', (err) => {
        console.error('[RabbitMQ] ❌ Bağlantı hatası:', err.message);
        channel = null;
        connection = null;
      });

      return channel;
    } catch (error) {
      console.warn(`[RabbitMQ] ⚠️ Bağlantı denemesi ${attempt}/${maxRetries} başarısız: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`[RabbitMQ] ⏳ ${5} saniye sonra tekrar denenecek...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.warn('[RabbitMQ] ⚠️ Tüm denemeler başarısız. Bildirimler doğrudan veritabanına yazılacak.');
        return null;
      }
    }
  }
};

/**
 * RabbitMQ bağlantısını kapat (graceful shutdown)
 */
const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('[RabbitMQ] 🔒 Bağlantı kapatıldı.');
  } catch (err) {
    console.error('[RabbitMQ] Kapatma hatası:', err.message);
  }
};

module.exports = {
  getChannel,
  closeConnection,
  NOTIFICATION_QUEUE,
};
