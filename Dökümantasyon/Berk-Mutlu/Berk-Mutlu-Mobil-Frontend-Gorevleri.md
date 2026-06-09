# Berk Mutlu - Mobil Frontend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**Gereksinimler:** 1-11

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Giriş Ekranı (Login)
- **İlgili Gereksinim:** Gereksinim 1 — Giriş Yapma
- **API Endpoint:** `POST /v1/auth/login`
- **Açıklama:** Kullanıcının email ve şifre bilgileriyle sisteme giriş yapabildiği ekran.
- **Ekran Bileşenleri:**
  - Email input alanı (placeholder: "E-posta adresiniz")
  - Şifre input alanı (gizli karakter gösterimi)
  - Şifre görünürlük toggle (göz ikonu)
  - "Giriş Yap" butonu
  - "Hesabınız yok mu? Kayıt Olun" yönlendirme linki
  - Loading spinner (giriş işlemi sırasında)
- **Form Validasyonu:**
  - Email formatı kontrolü (@ ve domain doğrulaması)
  - Şifre boş olamaz kontrolü
  - Tüm alanlar dolmadan buton disabled
- **Kullanıcı Deneyimi:**
  - Hatalı giriş denemesinde anlamlı hata mesajı (ör: "Email veya şifre hatalı")
  - Başarılı girişte JWT token'ın secure storage'a kaydedilmesi ve ana sayfaya yönlendirme
- **Demo:** Email ve şifre ile giriş yapılarak ana sayfaya ulaşılması gösterilecek.

---

## 2. Kayıt Ekranı (Register)
- **İlgili Gereksinim:** Gereksinim 2 — Üye Olma
- **API Endpoint:** `POST /v1/auth/register`
- **Açıklama:** Yeni kullanıcıların ad, soyad, email ve şifre bilgileriyle hesap oluşturabildiği ekran.
- **Ekran Bileşenleri:**
  - Ad (firstName) input alanı
  - Soyad (lastName) input alanı
  - Email input alanı
  - Şifre input alanı (şifre gücü göstergesi)
  - Şifre tekrar input alanı
  - "Kayıt Ol" butonu
  - "Zaten hesabınız var mı? Giriş Yapın" yönlendirme linki
- **Form Validasyonu:**
  - Ad ve soyad boş olamaz (minimum 2 karakter)
  - Email format doğrulaması
  - Şifre güvenlik kuralları (minimum 6 karakter, harf/rakam kombinasyonu)
  - Şifre eşleşme kontrolü
  - Real-time inline validation (her alan için anında geri bildirim)
- **Kullanıcı Deneyimi:**
  - Başarılı kayıt sonrası toast bildirimi ve giriş ekranına otomatik yönlendirme
  - "Bu email zaten kullanımda" gibi hata durumları
- **Demo:** Yeni kullanıcı kaydı oluşturulup başarılı kayıt akışı gösterilecek.

---

## 3. Profil Ekranı
- **İlgili Gereksinimler:** Gereksinim 3 — Profil Görüntüleme, Gereksinim 4 — Profil Güncelleme, Gereksinim 5 — Hesap Silme
- **API Endpoints:**
  - `GET /v1/users/{userId}` — Profil bilgilerini getirme
  - `PUT /v1/users/{userId}` — Profil güncelleme
  - `DELETE /v1/users/{userId}` — Hesap silme
- **Açıklama:** Kullanıcının profil bilgilerini görüntüleyebildiği, güncelleyebildiği ve hesabını silebildiği ekran.
- **Ekran Bileşenleri:**
  - Kullanıcı avatar/profil resmi alanı
  - Ad, soyad ve email bilgi kartları (görüntüleme modu)
  - "Profili Düzenle" butonu → düzenleme moduna geçiş
  - Düzenleme modunda: Ad, Soyad, Email input alanları (mevcut verilerle dolu)
  - "Değişiklikleri Kaydet" butonu
  - "Çıkış Yap" butonu
  - "Hesabı Sil" butonu (danger style — kırmızı)
  - Hesap silme onay dialog'u ("Emin misiniz?" modal penceresi)
- **Form Validasyonu:**
  - Güncelleme formunda mevcut değerlerle doldurma (pre-fill)
  - Değişiklik yoksa "Kaydet" butonu disabled
  - Email format kontrolü
- **Kullanıcı Deneyimi:**
  - Skeleton loading ekranı (veri yüklenirken)
  - Başarılı güncelleme sonrası toast bildirimi
  - Hesap silme sonrası giriş ekranına yönlendirme ve token temizleme
- **Demo:** Profil görüntüleme, bilgi güncelleme ve hesap silme işlemlerinin ayrı ayrı gösterilmesi.

---

## 4. Ana Sayfa / Ürün Arama Ekranı
- **İlgili Gereksinim:** Gereksinim 7 — Akıllı Ürün Arama
- **API Endpoint:** `GET /v1/products/search?q={arama_kelimesi}`
- **Açıklama:** Kullanıcıların arama çubuğu ile ürün arayabildiği ve sonuçların ürün kartları şeklinde listelendiği ana ekran.
- **Ekran Bileşenleri:**
  - Üst kısımda arama çubuğu (search bar)
  - Arama sonuç listesi — ürün kartları (ürün görseli, isim, fiyat)
  - "Aranıyor..." animasyonu / loading indicator
  - Sonuç bulunamadı durumu için empty state mesajı
  - Ürün kartına tıklanarak detay sayfasına geçiş
- **Arama Özellikleri:**
  - Yazarken 300-500ms debounce ile API isteği gönderme
  - Arama inputu boş geçilemez (minimum 2 karakter)
  - Girdi içindeki gereksiz boşlukları (trim) temizleme
- **Kullanıcı Deneyimi:**
  - Hızlı ve akıcı arama deneyimi
  - Sonuçların kartlar halinde grid/liste görünümünde sunulması
  - Sonuç bulunamazsa "Aramanızla eşleşen ürün bulunamadı" mesajı
- **Demo:** Arama çubuğuna ürün ismi yazılarak sonuçların listelenmesi gösterilecek.

---

## 5. Arama Geçmişi Ekranı
- **İlgili Gereksinim:** Gereksinim 6 — Arama Geçmişi
- **API Endpoint:** `GET /v1/users/history/searches`
- **Açıklama:** Kullanıcının daha önce yaptığı aramaların kronolojik sırayla listelendiği ekran.
- **Ekran Bileşenleri:**
  - Geçmiş aramaların listesi (arama terimi + tarih)
  - Her arama öğesine tıklanarak yeniden arama yapabilme
  - Boş durum mesajı ("Henüz arama yapmadınız")
- **Kullanıcı Deneyimi:**
  - Arama geçmişine hızlı erişim
  - Geçmiş aramadan tekrar arama yapabilme kolaylığı
- **Demo:** Arama geçmişi ekranının açılması ve geçmiş aramalardan birinin tıklanarak tekrar aranması gösterilecek.

---

## 6. Ürün Detay Ekranı
- **İlgili Gereksinim:** Gereksinim 8 — Ürün Detayı
- **API Endpoints:**
  - `GET /v1/products/{productId}` — Ürün detay bilgileri
  - `GET /v1/products/{productId}/sellers` — Satıcı listesi ve fiyatları
- **Açıklama:** Seçilen ürünün detaylı bilgilerinin, farklı satıcılardan gelen fiyatların ve ürün özelliklerinin görüntülendiği ekran.
- **Ekran Bileşenleri:**
  - Ürün görseli (büyük resim)
  - Ürün başlığı ve açıklaması
  - Fiyat bilgisi (en düşük / en yüksek fiyat aralığı)
  - Satıcılar listesi (satıcı adı, fiyat, "Satıcıya Git" butonu)
  - "Karşılaştırmaya Ekle" butonu
  - "Listeye Ekle" butonu
  - Ürün özellikleri tablosu
- **Kullanıcı Deneyimi:**
  - Satıcılar fiyata göre sıralı gösterim
  - Yükleme sırasında skeleton loading
  - Satıcı linklerinin yeni sekmede/tarayıcıda açılması
- **Demo:** Bir ürünün detay sayfası açılarak bilgilerin ve satıcıların gösterilmesi.

---

## 7. Karşılaştırma Ekranı
- **İlgili Gereksinimler:** Gereksinim 9 — Karşılaştırma Panosu, Gereksinim 10 — Karşılaştırma Ekleme, Gereksinim 11 — Karşılaştırma Kaldırma
- **API Endpoints:**
  - `GET /v1/comparisons` — Karşılaştırma panosunu getirme
  - `POST /v1/comparisons/items` — Ürün ekleme
  - `DELETE /v1/comparisons/items/{itemId}` — Ürün kaldırma
- **Açıklama:** Kullanıcının eklediği ürünleri yan yana kıyaslayabildiği karşılaştırma panosu ekranı.
- **Ekran Bileşenleri:**
  - Karşılaştırma tablosu / kartları (ürünler yan yana)
  - Her ürün kartında: ürün görseli, isim, fiyat, özellikler
  - Her ürün için "Kaldır" (X) butonu
  - Boş pano durumunda "Karşılaştırmak için ürün ekleyin" mesajı
  - Ürün ekleme seçeneği (arama yaparak ürün ekleme)
- **Kurallar:**
  - Maksimum 4 ürün karşılaştırılabilir, aşılırsa buton disabled
  - Zaten panoda olan ürün tekrar eklenemez
- **Kullanıcı Deneyimi:**
  - Ürün ekleme/kaldırma işlemlerinde toast bildirimi
  - Pano boşken anlamlı empty state mesajı
  - Ürünlerin özellik bazlı kıyaslanabilmesi
- **Demo:** Karşılaştırma panosuna ürün ekleme, kıyaslama ve kaldırma işlemlerinin gösterilmesi.
