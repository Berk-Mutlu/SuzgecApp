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

  try {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Bildirim kuyruğunu oluştur (yoksa)
    await channel.assertQueue(NOTIFICATION_QUEUE, {
      durable: true, // Sunucu yeniden başlatılsa bile kuyruk korunur
    });

    console.log('[RabbitMQ] ✅ RabbitMQ bağlantısı kuruldu.');
    console.log(`[RabbitMQ] 📬 "${NOTIFICATION_QUEUE}" kuyruğu hazır.`);

    // Bağlantı kapandığında temizle
    connection.on('close', () => {
      console.warn('[RabbitMQ] ⚠️ Bağlantı kapandı.');
      channel = null;
      connection = null;
    });

    connection.on('error', (err) => {
      console.error('[RabbitMQ] ❌ Bağlantı hatası:', err.message);
      channel = null;
      connection = null;
    });

    return channel;
  } catch (error) {
    console.warn('[RabbitMQ] ⚠️ RabbitMQ bağlantısı kurulamadı:', error.message);
    console.warn('[RabbitMQ] ⚠️ Bildirimler doğrudan veritabanına yazılacak.');
    return null;
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
