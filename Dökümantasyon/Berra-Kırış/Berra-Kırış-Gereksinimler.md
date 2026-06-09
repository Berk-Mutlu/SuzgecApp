# Berra Kırış - Gereksinimler

1. **Stok Takip Listesini Görüntüleme**
   - **API Metodu:** `GET /stock-alerts`
   - **Açıklama:** Kullanıcının, mağazada tükenmiş olan ancak tekrar stoklara girdiğinde satın almayı planladığı tüm ürünleri tek bir panoda genel bir liste halinde görmesini ve güncel durumlarını kontrol etmesini sağlar.

2. **Stok Takibine Ürün Ekleme**
   - **API Metodu:** `POST /stock-alerts`
   - **Açıklama:** Kullanıcının, belirli bir mağazada tükenmiş olan bir ürünün stok veritabanlarına yeniden düşmesi (satışa çıkması) durumunda email/push ile anında haberdar olmak için ürünü takibe almasını sağlayan arka plan kayıt sistemidir.

3. **Stok Takibinden Ürün Silme**
   - **API Metodu:** `DELETE /stock-alerts/{alertId}`
   - **Açıklama:** Kullanıcının ilgisini kaybettiği, veya o ürünü başka bir platformdan manuel olarak satın aldığı için stoğa girmesini beklemesinin bir anlamı kalmaması üzerine ürünün alarmını sistemden kaldırmasını sağlar.

4. **Fiyat Alarm Listesi Görüntüleme**
   - **API Metodu:** `GET /price-alerts`
   - **Açıklama:** Kullanıcının indirim günleri yaklaşırken veya bütçe yönetimi yaparken kurmuş olduğu tüm "ucuzladığında haber ver" alarmlarını ve belirlediği hedef düşük fiyatları topluca ekranda incelemesini sağlar.

5. **Fiyat Düşüş Alarmı Ekleme**
   - **API Metodu:** `POST /price-alerts`
   - **Açıklama:** Kullanıcının, incelediği bir ürünün fiyatı kendi girdiği bütçe sınırının altına bir oranda (scraping sonrasında) düştüğünde sistemden uyarı mesajı veya maili almak için akıllı alarm kurmasını sağlar.

6. **Fiyat Alarm Beklentisini Güncelleme**
   - **API Metodu:** `PUT /price-alerts/{alertId}`
   - **Açıklama:** Kullanıcının piyasa koşullarına göre var olan bir alarmdaki "Hedef Fiyat" beklentisini veya o alarmın ilgili ürün için ne şekilde bildirim göndereceği (mail, push vb.) tercihlerini sonradan değiştirmesine olanak tanır.

7. **Fiyat Alarmı Silme**
   - **API Metodu:** `DELETE /price-alerts/{alertId}`
   - **Açıklama:** Bütçenin başka bir harcamaya aktarılması veya ürünün çok pahalılaşmasından ötürü kullanıcının artık ucuzlamasını beklemediği ürün alarmını iptal edip sistemden sessizce kaldırmasını sağlar.

8. **Kullanıcı Bildirimlerini Görüntüleme**
   - **API Metodu:** `GET /notifications`
   - **Açıklama:** Fiyat veya stok alarmları tetiklendiğinde ya da farklı uyarılar gerçekleştiğinde kullanıcının sisteme düştüğü günden itibaren sıralanmış olan tüm iletişim ve uyarı mesajlarını bir liste halinde karşısına getirir.

9. **Bildirimi Okundu Olarak İşaretleme**
   - **API Metodu:** `PUT /notifications/{id}/read`
   - **Açıklama:** Kullanıcının, fiyat düştü paneli veya bildirim ekranında "Yeni" olarak yanan bildirim baloncuğuna tıkladığında, o bildirimin arka planda "Okundu" statüsüne geçerek pasifleşmesini ve bildirim yığılmasının önüne geçilmesini sağlar.

10. **Bildirim Silme**
    - **API Metodu:** `DELETE /notifications/{id}`
    - **Açıklama:** Kullanıcının kendisine gelen eski stok uyarıları, fiyat indirimleri ya da sistem duyuruları gibi mesajlardan okuduklarını veya saklamak istemediklerini posta kutusunu temizler gibi panelinden tamamen yok etmesini sağlar.

11. **Yapay Zeka Destekli Ürün Karşılaştırma**
    - **API Metodu:** `POST /v1/ai/compare`
    - **Açıklama:** Kullanıcının ilgilendiği ürünleri fiyat/performans açısından analiz edip, arkadaş canlısı bir dille tavsiye veren Süz-Geç asistan özelliğidir.
