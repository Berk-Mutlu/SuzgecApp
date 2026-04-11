# Berra Kırış'ın Web Frontend Görevleri
**Front-end Test Videosu:** [Frontend Videosu](https://www.youtube.com/watch?v=fjk_xRZZbIU)

## 1. Fiyat Alarmları Paneli ve Formu
- **API Endpoints:** `GET /price-alerts`, `POST /price-alerts`, `PUT /price-alerts/{alertId}`, `DELETE /price-alerts/{alertId}`
- **Görev:** İndirim takip listesinin tablo formatında gösterilmesi ve alarm oluşturma mantığı arayüzü tasarımı.
- **UI Bileşenleri:**
  - "Fiyat Alarmlarım" yönetim ekranı (Tablo: Ürün görseli, Güncel Fiyat, Hedef Fiyat, İşlem butonları)
  - Alarm belirlerken (Örn: Ürün detayı panelinde) açılan Dialog/Modal.
  - Hedef fiyat girmek için "Fiyat (TL)" number input alanı
  - Formda Bildirim tipi seçimi (Dropdown / Radio Box: Email, Push Notification vb.)
  - Listedeki alarmları güncellemek için "Target Değiştir" inline form input'u veya ayrı modal.
  - Silme ("Alarmı İptal Et") danger buton barındıran hücreler.
- **Form Validasyonu:**
  - Hedef fiyat inputu rakam kabul etmeli ve sıfırdan (`price > 0`) büyük olmalıdır
  - Hedef fiyat (HTML5 min/max validation) şu anki fiyatın altında (mantıklı bir tutarda) girilmeye zorlanmalıdır (Güncel Fiyat: 500TL ise Hedef Max 499 girilebilir şeklinde JS realtime check).
  - Boş fiyat formu sumbit edilemez. "Kaydet" butonu disabled durumuna düşer.
- **Kullanıcı Deneyimi:**
  - Girilen hedef fiyata göre ne kadarlık indirim yüzdesi beklendiğinin otomatik hesaplanıp gösterilmesi (Örn: "-%20 İndirim Bekleniyor")
  - Alarm iptalinde çift uyarı diyalog çıkartılması
  - "Henüz hiç alarm kurmadınız" vb boş durumlarda güzel bir (Empty State) mesajı/grafiği tasarımı
- **Teknik Detaylar:**
  - Framework: Next.js (React)
  - UI Library: Tailwind CSS, Headless UI / Radix primitives tabanlı Modal yapısı.
  - Form Handle: React Hook Form ve regex/number validator kombinasyonları.

## 2. Stok Takip Alarmları Paneli
- **API Endpoints:** `GET /stock-alerts`, `POST /stock-alerts`, `DELETE /stock-alerts/{alertId}`
- **Görev:** Tükendiği için takibe alınan ürünlerin listelendiği sayfa ve buton geliştirilmesi.
- **UI Bileşenleri:**
  - Stok Alarmı Takip Listesi grid yapısı (Resim, İsim, Orijinal Satıcı durumu)
  - Ürün detay panelindeki "Gelince Haber Ver" / "Eklendi" (Toggle) Action butonu
- **Form Validasyonu:**
  - Ürün sayfası stok kontrol flag'ini okuyarak, halihazırda stok varsa "Gelince haber ver" butonunu saklar veya (disabled) pasif hale getirir.
- **Kullanıcı Deneyimi:**
  - Tıklandığında bekletmeden (Optimistic UI) buton icon'unun tik'e dönüşmesi.
  - Başarılı/Başarısız işlemler için Toast Notification (Snackbar) bildirim dönmesi.
- **Teknik Detaylar:**
  - State hook'lar ile follow/unfollow toggle mantığı (Boolean değişimi).

## 3. Bildirim Merkezi (Notification Hub)
- **API Endpoints:** `GET /notifications`, `PUT /notifications/{id}/read`, `DELETE /notifications/{id}`
- **Görev:** Sitenin layout/navbar kısmında entegre çalışan bildirim okuma/silme sistemi ve dropdownı.
- **UI Bileşenleri:**
  - Okunmamış bildirim sayısını (badge) gösteren Navbar zil ikonu
  - Tıklandığında yana doğru / ya da menüden aşağı seken Popover (Bildirim Listesi modülü)
  - Bildirim satırları (Başlık, Mesaj, Tarih Timestamp, Küçük bir ikon)
  - Okunmamış mesajlar için kalın fon (Bold text / Renkli arka plan highlight'ı)
  - Temizleme (Swipe to delete veya trash) çarpı ikonları
  - "Tümünü Okundu İşaretle" text linki / butonu
- **Form Validasyonu:**
  - Listede mesaj yoksa Dropdown popover kapanmamalı, içinde "Yeni Bildirim Yok" ibaresi bulunmalı.
- **Kullanıcı Deneyimi:**
  - Real-time hissi yaratmak için (Okunmamış sayaç numaralarının anında silik/eksi olarak yansıması)
  - Okunmayan mesaja tıklandığında (veya scroll yapıldığında) PUT isteği arkada tetiklenerek okundu statüsüne otomatik fallback yapılması.
  - Sola kaydırma animasyonu eklenebiliyorsa (Touch swipe on mobile) çok iyi bir deneyim sunması.
- **Akış Adımları (Flow):**
  1. Zil ikonuna basılır
  2. Dropdown sekmesi loading skeleton içinde açılır
  3. Veriler GET ile dolar
  4. Okunmamışlardan birine basılınca PUT(`/read`) fırlatılır, okundu status render edilir.
  5. Çarpıya basılırsa DELETE(`/id`) gönderilir, satır fade out ile uçar.
- **Teknik Detaylar:**
  - Layout Level Fetching: Navbar'da yer alan bu bileşen tüm sayfalarda bağımsızca güncel state'ini dinlemelidir (Polling vs, belli periyodlarla GET çağrısı)

## 4. Yapay Zeka Karşılaştırma Asistanı (Gemini AI)
- **API Endpoints:** `POST /v1/ai/compare`
- **Görev:** Karşılaştırma sayfasında kullanıcının seçtiği ürünlerin Google Gemini üzerinden yorumlanarak tavsiye sunulması.
- **UI Bileşenleri:**
  - "Karşılaştırma" başlığı yanına "✨ Senin İçin Karşılaştıralım" analiz butonu.
  - Shadcn UI `<Sheet>` bazlı sağ yandan açılan (Slide-in) modern analiz paneli.
  - Bekleme esnasında şık bir Spinner veya Loader animasyonu (Lucide React).
  - Gelen Markdown formatlı sonucu düzgün render etmek için `react-markdown` paketi kullanımı.
