# Berk Mutlu'nun Web Frontend Görevleri
**Front-end Test Videosu:** [Buraya eklenecek](#)

## 1. Üye Olma (Kayıt) ve Giriş Sayfaları
- **API Endpoints:** `POST /auth/register`, `POST /auth/login`
- **Görev:** Kullanıcı kayıt ve giriş işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive kayıt ve giriş formu (desktop ve mobile uyumlu)
  - Email input alanı (type="email", autocomplete="email")
  - Şifre input alanı (type="password", şifre gücü göstergesi)
  - Şifre tekrar input alanı (kayıt için doğrulama)
  - Ad (firstName) ve Soyad (lastName) input alanı
  - "Kayıt Ol" / "Giriş Yap" butonu (primary button style)
  - Şifre görünürlüğü (göz ikonu) aç/kapat toggle'ı
  - Sayfalar arası geçiş ("Hesabınız var mı? Giriş Yap" linkleri)
  - Loading spinner (işlem sürerken)
- **Form Validasyonu:**
  - HTML5 form validation (required, pattern attributes)
  - JavaScript real-time validation (örneğin email format kontrolü)
  - Şifre güvenlik kuralları (min 6 karakter, harf/rakam kombinasyonu)
  - Şifre eşleşme kontrolü (Kayıt olurken)
  - Ad ve soyad boş olamaz kontrolü
  - Tüm alanlar kurallara uymadan buton disabled durumunda olur
- **Kullanıcı Deneyimi:**
  - Form hatalarının anında input altında kırmızı yazı ile gösterilmesi (inline validation)
  - Başarılı kayıt sonrası success bildirim (toast) ve otomatik giriş sayfasına yönlendirme
  - Hata durumlarında kullanıcı dostu mesajlar (Örn: "Bu email kullanımda" veya "Şifre yanlış")
  - Form submission prevention (arka arkaya defalarca tıklamayı engelleme)
- **Teknik Detaylar:**
  - Framework: Next.js (React)
  - Form library: React Hook Form ve Zod validation
  - LocalStorage / Context API tabanlı JWT token yönetimi
  - Routing işlemleri (Next.js App/Pages Router)

## 2. Kullanıcı Profil Yönetimi (Görüntüleme, Düzenleme ve Silme)
- **API Endpoints:** `GET /users/{userId}`, `PUT /users/{userId}`, `DELETE /users/{userId}`
- **Görev:** Kullanıcı profil bilgilerini görüntüleme, güncelleme ve hesabı silme akışı arayüzü tasarımı
- **UI Bileşenleri:**
  - Responsive profil layout
  - Ad, Soyad, Email input alanları (Profil düzenleme modunda mevcut verilerle dolu)
  - "Değişiklikleri Kaydet" butonu
  - Çıkış (Logout) ve Sayfa alt kısmında "Hesabı Sil" (danger button)
  - Modal dialog (Hesap silme gibi yıkıcı eylemler için "Emin misiniz?" onay penceresi)
  - Loading skeleton screen (veri yüklenirken placeholder çizgiler)
- **Form Validasyonu:**
  - Email format kontrolü ve yeni isim/soyad uzunluk kontrolleri (real-time)
  - Değişiklik yoksa "Kaydet" butonu disabled
  - Real-time validation feedback (örn: geçersiz email ise input kenarı kırmızı olur)
- **Kullanıcı Deneyimi:**
  - Optimistic update (kaydet butonuna basıldığında profil menüsündeki isim anında değişir)
  - Destructive action için görsel uyarılar (Silme ekranında kırmızı warning iconlar)
  - İptal seçeneği her zaman mevcut (modal close)
  - Headless UI üzerinden pürüzsüz geçişler
  - Başarılı silme sonrası login sayfasına yönlendirme
- **Teknik Detaylar:**
  - Caching (Client-side cache, örn SWR)
  - Modal component yönetimi
  - Session storage temizleme (Hesap silindiğinde log out olma mekanizması)

## 3. Akıllı Arama & Arama Geçmişi Sayfası
- **API Endpoints:** `GET /products/search/public`, `GET /products/search`, `GET /users/history/searches`
- **Görev:** Global arama barı ve arama sonuç detayları dökümü sayfası.
- **UI Bileşenleri:**
  - Navbar içerisine entegre dinamik arama çubuğu (input type="search")
  - Yazdıkça beliren autocomplete ve geçmiş aramaları listeleyen dropdown
  - Arama sonuçlarını listeleyen ürün kartları grid arayüzü (Search results page)
  - "Aranıyor..." animasyonu veya loading indicator
- **Form Validasyonu:**
  - Arama inputu boş geçilemez
  - Girdi içindeki gereksiz boşlukları (trim) temizleyerek endpoint'e yollama
- **Kullanıcı Deneyimi:**
  - Yazarken 300-500ms debounce uygulanarak gereksiz API istekleri engellenmeli
  - Dropdown içerisinde arama geçmişini listeleyerek kolay tıklanabilirlik sağlama
  - "Sonuç bulunamadı" (Empty state) güzel tasarımlı hata/bilgi ekranı
- **Teknik Detaylar:**
  - React useEffect ve Debounce hook'ları
  - Dynamic routing (örn: `/search?q=laptop`)

## 4. Ürün Detayı & Karşılaştırma Panosu Görüntüleme
- **API Endpoints:** `GET /products/{productId}`, `GET /products/{productId}/sellers`, `POST /products/{productId}/resolve-url`, `GET /comparisons`, `POST /comparisons/items`, `DELETE /comparisons/items/{itemId}`
- **Görev:** Ürün özellikleri sayfası, satıcı listesi ve ürünlerin birbiriyle kıyaslandığı tablosal panonun geliştirilmesi.
- **UI Bileşenleri:**
  - Karşılaştırma panosu (Tabular layout - masaüstünde yan yana, mobilde akordeon)
  - Ürün detay kartlarında "Karşılaştırmaya Ekle" checkbox veya butonu
  - Çıkarma aksiyonu için çarpı (X) ikonları
- **Form Validasyonu / Kurallar:**
  - Belirli bir adetten (örn 4 adet) fazla ürün karşılaştırmaya eklenemez, aşılırsa buton disabled
  - Zaten panoda olan ürünün butonu "Karşılaştırmadan Çıkar" şekline dönüşmeli
- **Kullanıcı Deneyimi:**
  - Karşılaştırma aksiyonlarının tüm sitede sağ alt/sol alt köşede pop-up (Toast) ile duyurulması (Örn: "Ürün kıyaslamaya atıldı!")
  - Pano boşken anlamlı "Lütfen ürün ekleyin" (Empty State) mesajı gösterimi
- **Teknik Detaylar:**
  - Global State yönetimi (Karşılaştırma listesi app'te her yerden erişilebilir olmalı, Context API kullanılabilir)

## 5. Günün Fırsatları (Deals) Sayfası
- **API Endpoints:** `GET /products/search` (Limitli ve karışık sıralı kullanım)
- **Görev:** Ana ekrandan ulaşılan ve kullanıcılara anlık indirimli/trend ürünlerin sunulduğu keşif arayüzü tasarımı.
- **UI Bileşenleri:**
  - Sayfa başlığı ve interaktif, renkli ikon animasyonları (Flash/Zap ikonu)
  - Tüm fırsatların dinamik grid yapısında listelendiği genel alan (ProductCard listeleme)
  - Yükleme durumunda dönen spinner ve pırıltı efekti barındıran yükleme ekranları
- **Kullanıcı Deneyimi:**
  - Kullanıcı sayfaya geldiğinde `framer-motion` ile kademeli olarak (staggered) ekrana gelen kutular
  - Eğer o an fırsat ürün bulunamazsa özel boş durum (Empty State) grafikli uyarı
- **Teknik Detaylar:**
  - React useEffect ile sayfa açılışında anında API'den veri getirilmesi ve loading state idaresi
