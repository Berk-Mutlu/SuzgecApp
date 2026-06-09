const { getChannel, NOTIFICATION_QUEUE } = require('../config/rabbitmqClient');

/**
 * Bildirim mesajını RabbitMQ kuyruğuna gönderir (Producer).
 * RabbitMQ kullanılamıyorsa null döner (fallback olarak doğrudan DB'ye yazılmalı).
 * 
 * @param {object} notificationData - Bildirim verisi
 * @param {string} notificationData.userId - Kullanıcı ID
 * @param {string} notificationData.type - Bildirim tipi ('stock' | 'price' | 'system')
 * @param {string} notificationData.title - Bildirim başlığı
 * @param {string} notificationData.message - Bildirim mesajı
 * @param {string} [notificationData.productId] - Ürün ID (opsiyonel)
 * @param {string} [notificationData.productName] - Ürün adı (opsiyonel)
 * @returns {Promise<boolean>} Mesaj kuyruğa gönderildiyse true
 */
const sendNotification = async (notificationData) => {
  try {
    const channel = await getChannel();
    
    if (!channel) {
      console.warn('[Producer] ⚠️ RabbitMQ kullanılamıyor, fallback modunda.');
      return false; // Çağıran fonksiyon doğrudan DB'ye yazmalı
    }

    const message = {
      ...notificationData,
      timestamp: new Date().toISOString(),
    };

    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify(message)),
      { persistent: true } // Mesajın disk'e yazılmasını sağlar
    );

    console.log(`[Producer] 📤 Bildirim kuyruğa gönderildi: ${notificationData.type} → ${notificationData.title}`);
    return true;
  } catch (error) {
    console.error('[Producer] ❌ Mesaj gönderme hatası:', error.message);
    return false;
  }
};

module.exports = { sendNotification };
