const { getChannel, NOTIFICATION_QUEUE } = require('../config/rabbitmqClient');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

/**
 * RabbitMQ kuyruğundan bildirim mesajlarını tüketir (Consumer).
 * Kuyruktan gelen her mesajı MongoDB'ye kaydeder.
 */
const startConsumer = async () => {
  try {
    const channel = await getChannel();
    
    if (!channel) {
      console.warn('[Consumer] ⚠️ RabbitMQ kullanılamıyor, consumer başlatılamadı.');
      return;
    }

    // Aynı anda işlenecek mesaj sayısını sınırla
    await channel.prefetch(5);

    console.log(`[Consumer] 👂 "${NOTIFICATION_QUEUE}" kuyruğu dinleniyor...`);

    channel.consume(NOTIFICATION_QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        
        console.log(`[Consumer] 📥 Mesaj alındı: ${data.type} → ${data.title}`);

        // Veritabanı bağlantısını sağla
        await connectDB();

        // Bildirimi MongoDB'ye kaydet
        await Notification.create({
          user: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          productId: data.productId || null,
          productName: data.productName || null,
          read: false,
        });

        // Mesajı onay ver (acknowledge)
        channel.ack(msg);
        console.log(`[Consumer] ✅ Bildirim veritabanına kaydedildi: ${data.title}`);
      } catch (error) {
        console.error('[Consumer] ❌ Mesaj işleme hatası:', error.message);
        // Mesajı tekrar kuyruğa koy (requeue)
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.error('[Consumer] ❌ Consumer başlatma hatası:', error.message);
  }
};

module.exports = { startConsumer };
