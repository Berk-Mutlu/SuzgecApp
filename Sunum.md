# Video Sunum

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E (Berk Mutlu, Berra Kırış, Eda Nur Tarhan)

## Son Video Sunum Linki

> **Video Linki:** [Son sunum videosu buraya eklenecek](#)

---

## Sunum Yapısı

### 1. Grup Lideri - Açılış Konuşması (1-2 dakika)

**Konuşma İçeriği:**
- Grup adının tanıtılması (B²E)
- Projenin genel tanıtımı (Süz-Geç)
- Projenin amacı ve kapsamı
- Sunumun yapısının kısaca açıklanması

**Örnek Konuşma:**
> "Merhaba, ben Berk Mutlu. B²E ekibi olarak Süz-Geç projesini geliştirdik. Bu proje, kullanıcıların farklı e-ticaret sitelerindeki ürün fiyatlarını karşılaştırabildiği, stok takibi yapabildiği ve yapay zeka destekli ürün analizi alabildiği akıllı bir fiyat karşılaştırma platformudur. Bugün sizlere projemizi ve ekibimizin çalışmalarını sunacağız. Her ekip üyesi kendini tanıtacak ve sorumlu olduğu gereksinimleri gösterecek."

---

### 2. Ekip Üyeleri - Kişisel Tanıtım ve Gereksinim Sunumu

Her ekip üyesi için aşağıdaki yapı takip edilecektir:

#### Format (Her üye için 4-6 dakika)

**A) Kişisel Tanıtım (30-45 saniye)**
- Yüz görünecek şekilde kamera karşısında
- İsim ve soyisim
- Ekipteki rolü
- Sorumlu olduğu alan (Backend/Frontend/Mobil vb.)

**B) Gereksinim Sunumu (3.5-5 dakika)**
- Sorumlu olduğu gereksinimlerin listesi
- Her gereksinimin kısa açıklaması
- Canlı demo (ekran kaydı ile)
- Her gereksinimin çalışır durumda olduğunun detaylı gösterilmesi
- Her gereksinim için yeterli süre ayrılmalı (yaklaşık 1-1.5 dakika/gereksinim)

---

### 3. Ekip Üyeleri Sunum Sırası

#### Berk Mutlu (Gereksinimler 1-11)
**Kişisel Tanıtım:**
- İsim: Berk Mutlu
- Rol: Takım Lideri / Full-Stack Geliştirici
- Alan: Kimlik Doğrulama, Kullanıcı Yönetimi, Ürün Arama ve Karşılaştırma

**Gereksinimler:**
1. **Giriş Yapma**
   - API Metodu: `POST /v1/auth/login`
   - Demo: Email ve şifre ile giriş yapma işleminin gösterilmesi

2. **Üye Olma**
   - API Metodu: `POST /v1/auth/register`
   - Demo: Yeni kullanıcı kayıt işleminin gösterilmesi

3. **Profil Görüntüleme**
   - API Metodu: `GET /v1/users/{userId}`
   - Demo: Kullanıcı profil bilgilerinin görüntülenmesi

4. **Profil Güncelleme**
   - API Metodu: `PUT /v1/users/{userId}`
   - Demo: Profil bilgilerinin güncellenmesi

5. **Hesap Silme**
   - API Metodu: `DELETE /v1/users/{userId}`
   - Demo: Hesap silme işleminin gösterilmesi

6. **Arama Geçmişi**
   - API Metodu: `GET /v1/users/history/searches`
   - Demo: Kullanıcının geçmiş aramalarının listelenmesi

7. **Akıllı Ürün Arama**
   - API Metodu: `GET /v1/products/search`
   - Demo: Arama çubuğu ile ürün arama ve sonuçların listelenmesi

8. **Ürün Detayı**
   - API Metodu: `GET /v1/products/{productId}`, `GET /v1/products/{productId}/sellers`
   - Demo: Ürün bilgileri, fiyat analizi ve satıcıların gösterilmesi

9. **Karşılaştırma Panosu Görüntüleme**
   - API Metodu: `GET /v1/comparisons`
   - Demo: Karşılaştırma panosunun görüntülenmesi

10. **Karşılaştırma Listesine Ürün Ekleme**
    - API Metodu: `POST /v1/comparisons/items`
    - Demo: Ürünün karşılaştırma panosuna eklenmesi

11. **Karşılaştırma Listesinden Ürün Kaldırma**
    - API Metodu: `DELETE /v1/comparisons/items/{itemId}`
    - Demo: Ürünün karşılaştırma panosundan kaldırılması

---

#### Berra Kırış (Gereksinimler 12-21, 33)
**Kişisel Tanıtım:**
- İsim: Berra Kırış
- Rol: Full-Stack Geliştirici
- Alan: Stok Takip, Fiyat Alarm Sistemi, Bildirimler ve AI Karşılaştırma

**Gereksinimler:**
12. **Stok Takip Listesi Görüntüleme**
    - API Metodu: `GET /v1/stock-alerts`
    - Demo: Stok takibi yapılan ürünlerin listelenmesi

13. **Stok Takibine Ürün Ekleme**
    - API Metodu: `POST /v1/stock-alerts`
    - Demo: Bir ürünün stok takibine eklenmesi

14. **Stok Takibinden Ürün Silme**
    - API Metodu: `DELETE /v1/stock-alerts/{alertId}`
    - Demo: Stok takibinden ürün çıkarılması

15. **Fiyat Alarm Listesi Görüntüleme**
    - API Metodu: `GET /v1/price-alerts`
    - Demo: Aktif fiyat alarmlarının listelenmesi

16. **Fiyat Düşüş Alarmı Ekleme**
    - API Metodu: `POST /v1/price-alerts`
    - Demo: Hedef fiyat belirleyerek alarm oluşturulması

17. **Fiyat Alarm Güncelleme**
    - API Metodu: `PUT /v1/price-alerts/{alertId}`
    - Demo: Alarm hedef fiyat ve bildirim tercihinin güncellenmesi

18. **Fiyat Alarmı Silme**
    - API Metodu: `DELETE /v1/price-alerts/{alertId}`
    - Demo: Fiyat alarmının silinmesi

19. **Bildirimleri Görüntüleme**
    - API Metodu: `GET /v1/notifications`
    - Demo: Kullanıcı bildirimlerinin listelenmesi

20. **Bildirimi Okundu İşaretleme**
    - API Metodu: `PUT /v1/notifications/{id}/read`
    - Demo: Bir bildirimin okundu olarak işaretlenmesi

21. **Bildirim Silme**
    - API Metodu: `DELETE /v1/notifications/{id}`
    - Demo: Bildirimin silinmesi

33. **AI Ürün Karşılaştırma**
    - API Metodu: `POST /v1/ai/compare`
    - Demo: Gemini AI ile ürün karşılaştırma analizinin gösterilmesi

---

#### Eda Nur Tarhan (Gereksinimler 22-32)
**Kişisel Tanıtım:**
- İsim: Eda Nur Tarhan
- Rol: Full-Stack Geliştirici
- Alan: Liste Yönetimi, Ürün Listeleme ve Yorum/Puan Sistemi

**Gereksinimler:**
22. **Liste Oluşturma**
    - API Metodu: `POST /v1/lists`
    - Demo: Yeni bir alışveriş listesi oluşturulması

23. **Listeleri Görüntüleme**
    - API Metodu: `GET /v1/lists`
    - Demo: Kullanıcının oluşturduğu tüm listelerin görüntülenmesi

24. **Liste Güncelleme**
    - API Metodu: `PUT /v1/lists/{listId}`
    - Demo: Liste adı ve renginin güncellenmesi

25. **Liste Silme**
    - API Metodu: `DELETE /v1/lists/{listId}`
    - Demo: Listenin silinmesi

26. **Listeye Ürün Ekleme**
    - API Metodu: `POST /v1/lists/{listId}/items`
    - Demo: Bir ürünün listeye eklenmesi

27. **Liste İçeriği Görüntüleme**
    - API Metodu: `GET /v1/lists/{listId}`, `GET /v1/lists/{listId}/items`
    - Demo: Liste detayı ve içindeki ürünlerin görüntülenmesi

28. **Listeden Ürün Silme**
    - API Metodu: `DELETE /v1/lists/{listId}/items/{itemId}`
    - Demo: Listeden ürün çıkarılması

29. **Yorum/Puan Ekleme**
    - API Metodu: `POST /v1/reviews/{productId}`
    - Demo: Ürüne yorum ve puan verilmesi

30. **Yorumları Görüntüleme**
    - API Metodu: `GET /v1/reviews/{productId}`
    - Demo: Ürüne ait tüm yorumların listelenmesi

31. **Yorum Güncelleme**
    - API Metodu: `PUT /v1/reviews/{reviewId}`
    - Demo: Mevcut yorumun güncellenmesi

32. **Yorum Silme**
    - API Metodu: `DELETE /v1/reviews/{reviewId}`
    - Demo: Yorumun silinmesi

---

### 4. Grup Lideri - Kapanış Konuşması (1 dakika)

**Konuşma İçeriği:**
- Tüm gereksinimlerin tamamlandığının özeti
- Projenin başarıyla tamamlandığının vurgulanması

**Örnek Konuşma:**
> "Bugün sizlere Süz-Geç projemizi sunduk. B²E ekibi olarak tüm 33 gereksinimi başarıyla tamamladık ve çalışır durumda gösterdik. Projemiz, kullanıcıların akıllı fiyat karşılaştırması yapmasını, stok ve fiyat takibi oluşturmasını ve yapay zeka ile ürün analizi almasını sağlayan kapsamlı bir platform. Teşekkürler!"

---

## RabbitMQ Kanıt Videoları

Her ekip üyesinin RabbitMQ entegrasyonunu gösteren bireysel kanıt videoları:

| # | Ekip Üyesi | Video Linki |
|---|-----------|-------------|
| 1 | Berk Mutlu | [RabbitMQ kanıt videosu buraya eklenecek](#) |
| 2 | Berra Kırış | [RabbitMQ kanıt videosu buraya eklenecek](#) |
| 3 | Eda Nur Tarhan | [RabbitMQ kanıt videosu buraya eklenecek](#) |

---

## Redis Kanıt Videoları

Her ekip üyesinin Redis entegrasyonunu gösteren bireysel kanıt videoları:

| # | Ekip Üyesi | Video Linki |
|---|-----------|-------------|
| 1 | Berk Mutlu | [Redis kanıt videosu buraya eklenecek](#) |
| 2 | Berra Kırış | [Redis kanıt videosu buraya eklenecek](#) |
| 3 | Eda Nur Tarhan | [Redis kanıt videosu buraya eklenecek](#) |

---

## Docker + CI/CD Kanıt Videosu

Tüm ekibin birlikte hazırladığı Docker containerization ve CI/CD pipeline kanıt videosu:

> **Video Linki:** [Docker + CI/CD kanıt videosu buraya eklenecek](#)

**Video İçeriği:**
- Dockerfile ve docker-compose.yml yapısının gösterilmesi
- Container'ların ayağa kaldırılması
- CI/CD pipeline'ının çalışma akışı
- Otomatik deployment süreci

---

## Sunum Hazırlık Kontrol Listesi

### Genel Hazırlık
- [ ] Grup lideri açılış konuşmasını hazırladı
- [ ] Her ekip üyesi kendi sunumunu hazırladı
- [ ] Tüm 33 gereksinim çalışır durumda
- [ ] Demo senaryoları hazırlandı
- [ ] Test verileri ve hesaplar hazırlandı
- [ ] RabbitMQ kanıt videoları çekildi (3 adet)
- [ ] Redis kanıt videoları çekildi (3 adet)
- [ ] Docker + CI/CD kanıt videosu çekildi (1 adet)

### Teknik Hazırlık
- [ ] Video kayıt cihazı/kamera hazır
- [ ] Mikrofon kalitesi test edildi
- [ ] Işıklandırma uygun
- [ ] Arka plan düzenlendi
- [ ] Ekran kayıt yazılımı hazır (demo için)

### Kişisel Hazırlık
- [ ] Her ekip üyesi kendi bölümünü prova etti
- [ ] Konuşma süreleri kontrol edildi
- [ ] Gereksinimler ezberlendi veya notlar hazırlandı
- [ ] Demo akışı prova edildi

---

## Video Çekim Teknikleri

### Kişisel Tanıtım Bölümü
- **Kamera Açısı:** Yüz net görünecek şekilde
- **Işık:** Yüzün iyi aydınlatıldığından emin olun
- **Arka Plan:** Temiz ve profesyonel görünüm
- **Görüntü:** Omuz üstü çekim
- **Göz Teması:** Kameraya bakarak konuşun

### Demo Bölümü
- **Ekran Kaydı:** Net ve yüksek çözünürlükte
- **Ses:** Demo sırasında açıklama yapın
- **Hız:** Yavaş ve anlaşılır hareket edin
- **Vurgu:** Önemli noktaları işaret edin

---

## Zaman Yönetimi

- **Grup Lideri Açılış:** 1-2 dakika
- **Her Ekip Üyesi:** 4-6 dakika
  - Kişisel tanıtım: 30-45 saniye
  - Gereksinim sunumu: 3.5-5 dakika
    - Her gereksinim için: yaklaşık 1-1.5 dakika
- **Grup Lideri Kapanış:** 1-2 dakika
- **Toplam Süre:** Yaklaşık 15-20 dakika (3 kişilik ekip için)