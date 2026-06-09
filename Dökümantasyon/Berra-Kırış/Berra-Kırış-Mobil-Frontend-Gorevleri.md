# Berra Kırış - Mobil Frontend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**Gereksinimler:** 12-21, 33

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Stok Takibi Ekranı
- **İlgili Gereksinimler:** Gereksinim 12 — Stok Takip Listesi, Gereksinim 13 — Stok Takibine Ekleme, Gereksinim 14 — Stok Takibinden Silme
- **API Endpoints:**
  - `GET /v1/stock-alerts` — Stok takip listesini getirme
  - `POST /v1/stock-alerts` — Ürünü stok takibine ekleme
  - `DELETE /v1/stock-alerts/{alertId}` — Stok takibinden silme
- **Açıklama:** Kullanıcının stokta olmayan veya stok durumu değişebilecek ürünleri takip edebildiği ekran. Ürün stoğa girdiğinde kullanıcıya bildirim gönderilir.
- **Ekran Bileşenleri:**
  - Stok takibindeki ürünlerin listesi (ürün kartı: görsel, isim, stok durumu)
  - Her ürün için stok durumu göstergesi (Stokta / Stok Yok badge'i)
  - "Takipten Çıkar" butonu (her ürün kartında — swipe veya ikon)
  - Ürün detay sayfasında "Stok Takibine Ekle" butonu
  - Boş durum mesajı ("Henüz stok takibi eklemediniz")
  - Pull-to-refresh ile listeyi yenileme
- **Kullanıcı Deneyimi:**
  - Stok takibine ekleme/çıkarma işlemlerinde toast bildirimi
  - Stokta olan ürünler yeşil, stokta olmayanlar kırmızı renk kodu
  - Swipe-to-delete ile hızlı silme
- **Demo:** Bir ürünün stok takibine eklenmesi, listenin görüntülenmesi ve takipten çıkarılması gösterilecek.

---

## 2. Fiyat Takibi Ekranı
- **İlgili Gereksinimler:** Gereksinim 15 — Fiyat Alarm Listesi, Gereksinim 16 — Fiyat Düşüş Alarmı Ekleme, Gereksinim 17 — Fiyat Alarm Güncelleme, Gereksinim 18 — Fiyat Alarmı Silme
- **API Endpoints:**
  - `GET /v1/price-alerts` — Fiyat alarm listesini getirme
  - `POST /v1/price-alerts` — Yeni fiyat alarmı oluşturma
  - `PUT /v1/price-alerts/{alertId}` — Alarm güncelleme
  - `DELETE /v1/price-alerts/{alertId}` — Alarm silme
- **Açıklama:** Kullanıcının ürünlere hedef fiyat belirleyebildiği ve fiyat düştüğünde bildirim alabildiği ekran.
- **Ekran Bileşenleri:**
  - Aktif fiyat alarmlarının listesi (ürün kartı: isim, mevcut fiyat, hedef fiyat)
  - Her alarm kartında mevcut fiyat vs. hedef fiyat gösterimi
  - Fiyat farkı yüzdesi göstergesi
  - "Alarm Ekle" butonu → alarm oluşturma formu (bottom sheet veya modal)
  - Alarm oluşturma formu: ürün seçimi, hedef fiyat input, bildirim tercihi (email/push)
  - "Düzenle" butonu → hedef fiyat ve bildirim tercihini güncelleme
  - "Sil" butonu — silme onay dialog'u
  - Boş durum mesajı ("Henüz fiyat alarmı oluşturmadınız")
- **Form Validasyonu:**
  - Hedef fiyat sayısal ve pozitif olmalı
  - Hedef fiyat mevcut fiyattan düşük olmalı
  - Bildirim tercihi seçilmeli (email veya push_notification)
- **Kullanıcı Deneyimi:**
  - Hedef fiyata yaklaşıldığında görsel uyarı (ilerleme çubuğu)
  - Alarm CRUD işlemlerinde toast bildirimi
  - Silme işlemi için onay dialog'u
- **Demo:** Yeni fiyat alarmı oluşturma, hedef fiyatı güncelleme ve alarmı silme işlemlerinin gösterilmesi.

---

## 3. Bildirimler Ekranı
- **İlgili Gereksinimler:** Gereksinim 19 — Bildirimleri Görüntüleme, Gereksinim 20 — Bildirimi Okundu İşaretleme, Gereksinim 21 — Bildirim Silme
- **API Endpoints:**
  - `GET /v1/notifications` — Bildirimleri listeleme
  - `PUT /v1/notifications/{id}/read` — Okundu işaretleme
  - `DELETE /v1/notifications/{id}` — Bildirim silme
- **Açıklama:** Kullanıcıya gelen tüm bildirimlerin (stok değişikliği, fiyat düşüşü, sistem bildirimleri) listelendiği ekran.
- **Ekran Bileşenleri:**
  - Bildirim listesi (bildirim kartı: başlık, mesaj, tarih, okundu durumu)
  - Okunmamış bildirimler kalın yazı ve renkli gösterge ile vurgulanır
  - Her bildirime tıklama → okundu olarak işaretleme ve ilgili sayfaya yönlendirme
  - Her bildirim kartında "Sil" butonu veya swipe-to-delete
  - Okunmamış bildirim sayısı badge'i (bottom navigation bar üzerinde)
  - Boş durum mesajı ("Bildiriminiz bulunmuyor")
  - Pull-to-refresh ile bildirimleri yenileme
- **Kullanıcı Deneyimi:**
  - Okunmamış/okunmuş bildirimler görsel olarak ayrıştırılır
  - Bildirime tıklandığında otomatik okundu işaretleme
  - Silme işleminde onay dialog'u
  - Bottom navigation bar'da okunmamış bildirim sayısı gösterimi
- **Demo:** Bildirimler listesinin görüntülenmesi, bir bildirimin okundu işaretlenmesi ve silinmesi gösterilecek.

---

## 4. AI Karşılaştırma Ekranı
- **İlgili Gereksinim:** Gereksinim 33 — AI Ürün Karşılaştırma
- **API Endpoint:** `POST /v1/ai/compare`
- **Açıklama:** Kullanıcının karşılaştırma panosundaki ürünleri Gemini AI yapay zeka modeline göndererek detaylı karşılaştırma analizi ve tavsiye alabildiği ekran.
- **Ekran Bileşenleri:**
  - Karşılaştırılacak ürünlerin önizlemesi (seçilen ürünlerin küçük kartları)
  - "AI ile Karşılaştır" butonu (yapay zeka ikonu ile)
  - AI analiz sonuç alanı — Markdown formatında render edilen tavsiye metni
  - Yükleme animasyonu (AI analizi sırasında — "Yapay zeka analiz ediyor..." mesajı)
  - Analiz geçmişi (opsiyonel)
- **Kullanıcı Deneyimi:**
  - AI analizinin yüklenmesi sırasında animasyonlu bekleme ekranı
  - Markdown formatındaki AI yanıtının düzgün render edilmesi (bold, liste, tablo)
  - Analiz sonucunun paylaşılabilmesi
  - Minimum 2 ürün seçilmeden buton disabled
- **Demo:** İki veya daha fazla ürün seçilerek AI karşılaştırma analizi başlatılması ve sonucun gösterilmesi.
