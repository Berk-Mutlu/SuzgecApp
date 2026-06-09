# Eda Nur Tarhan - Mobil Frontend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**Gereksinimler:** 22-32

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Listelerim Ekranı
- **İlgili Gereksinimler:** Gereksinim 22 — Liste Oluşturma, Gereksinim 23 — Listeleri Görüntüleme, Gereksinim 24 — Liste Güncelleme, Gereksinim 25 — Liste Silme
- **API Endpoints:**
  - `GET /v1/lists` — Kullanıcının listelerini getirme
  - `POST /v1/lists` — Yeni liste oluşturma
  - `PUT /v1/lists/{listId}` — Liste güncelleme
  - `DELETE /v1/lists/{listId}` — Liste silme
- **Açıklama:** Kullanıcının kişisel alışveriş listelerini oluşturabildiği, görüntüleyebildiği, düzenleyebildiği ve silebildiği ana liste yönetim ekranı.
- **Ekran Bileşenleri:**
  - Listelerin grid veya liste görünümünde sunulması (liste kartı: isim, renk, ikon, ürün sayısı)
  - Her liste kartında özelleştirilmiş renk ve emoji ikonu
  - Floating Action Button (FAB) — "Yeni Liste Oluştur" 
  - Liste oluşturma bottom sheet/modal: isim, renk seçici, ikon seçici
  - Her liste kartında long-press veya menü ile "Düzenle" ve "Sil" seçenekleri
  - Düzenleme modu: isim ve renk güncelleme formu
  - Silme onay dialog'u ("Bu listeyi silmek istediğinize emin misiniz?")
  - Boş durum mesajı ("Henüz liste oluşturmadınız. İlk listenizi oluşturun!")
- **Form Validasyonu:**
  - Liste ismi boş olamaz (minimum 1 karakter)
  - Renk seçimi zorunlu (varsayılan renk atanır)
  - Aynı isimli liste oluşturma uyarısı (opsiyonel)
- **Kullanıcı Deneyimi:**
  - Renkli ve görsel liste kartları
  - Liste oluşturma/güncelleme/silme işlemlerinde toast bildirimi
  - Silme işleminde onay dialog'u
  - Pull-to-refresh ile listeleri yenileme
  - Liste kartına tıklayarak liste detay ekranına geçiş
- **Demo:** Yeni liste oluşturma, mevcut listeyi güncelleme, liste silme ve tüm listelerin görüntülenmesi gösterilecek.

---

## 2. Liste Detay Ekranı
- **İlgili Gereksinimler:** Gereksinim 26 — Listeye Ürün Ekleme, Gereksinim 27 — Liste İçeriği Görüntüleme, Gereksinim 28 — Listeden Ürün Silme
- **API Endpoints:**
  - `GET /v1/lists/{listId}` — Liste detay bilgilerini getirme
  - `GET /v1/lists/{listId}/items` — Liste içindeki ürünleri getirme
  - `POST /v1/lists/{listId}/items` — Listeye ürün ekleme
  - `DELETE /v1/lists/{listId}/items/{itemId}` — Listeden ürün silme
- **Açıklama:** Seçilen listenin detayını ve içindeki ürünleri görüntüleyebildiği, yeni ürün ekleyebildiği ve mevcut ürünleri silebildiği ekran.
- **Ekran Bileşenleri:**
  - Liste başlığı ve bilgileri (isim, renk, oluşturulma tarihi)
  - Listedeki ürünlerin listesi (ürün kartı: görsel, isim, fiyat)
  - "Ürün Ekle" butonu → ürün arama ve seçim ekranına yönlendirme
  - Her ürün kartında "Kaldır" butonu veya swipe-to-delete
  - Ürün kartına tıklama → ürün detay sayfasına yönlendirme
  - Boş liste durumunda mesaj ("Bu listede henüz ürün yok. Ürün ekleyin!")
  - Liste toplam fiyat özeti (tüm ürünlerin toplam fiyatı)
- **Kullanıcı Deneyimi:**
  - Ürün ekleme/silme işlemlerinde toast bildirimi
  - Swipe-to-delete ile hızlı ürün silme
  - Ürün eklendikçe toplam fiyatın otomatik güncellenmesi
  - Liste boşken anlamlı empty state gösterimi
- **Demo:** Bir listeye ürün ekleme, liste içeriğini görüntüleme ve listeden ürün silme işlemlerinin gösterilmesi.

---

## 3. Yorumlar Ekranı
- **İlgili Gereksinimler:** Gereksinim 29 — Yorum/Puan Ekleme, Gereksinim 30 — Yorumları Görüntüleme, Gereksinim 31 — Yorum Güncelleme, Gereksinim 32 — Yorum Silme
- **API Endpoints:**
  - `GET /v1/reviews/{productId}` — Ürün yorumlarını listeleme
  - `POST /v1/reviews/{productId}` — Yorum ve puan ekleme
  - `PUT /v1/reviews/{reviewId}` — Yorum güncelleme
  - `DELETE /v1/reviews/{reviewId}` — Yorum silme
- **Açıklama:** Ürün detay sayfası içinde kullanıcıların yorum ve puan verebildiği, diğer kullanıcıların yorumlarını okuyabildiği, kendi yorumlarını düzenleyebildiği ve silebildiği bölüm.
- **Ekran Bileşenleri:**
  - Ürün detay sayfasının alt kısmında yorum bölümü
  - Yorum listesi (yorum kartı: kullanıcı adı, puan yıldızları, yorum metni, tarih)
  - Yıldız rating sistemi (1-5 yıldız — tıklanabilir)
  - Ortalama puan göstergesi (tüm yorumların ortalaması)
  - "Yorum Yaz" butonu → yorum oluşturma formu (bottom sheet veya ayrı ekran)
  - Yorum formu: yıldız seçimi + yorum metni textarea
  - Kendi yorumlarında "Düzenle" ve "Sil" butonları
  - Düzenleme modu: mevcut puan ve metin ile doldurulmuş form
  - Silme onay dialog'u
  - Boş yorum durumunda mesaj ("Henüz yorum yapılmamış. İlk yorumu siz yazın!")
- **Form Validasyonu:**
  - Puan seçimi zorunlu (1-5 yıldız)
  - Yorum metni boş olamaz (minimum 10 karakter)
  - Aynı ürüne birden fazla yorum engelleme (güncelleme önerisi)
- **Kullanıcı Deneyimi:**
  - Yıldız animasyonu (puan seçerken parlama efekti)
  - Yorum ekleme/güncelleme/silme sonrası listeyi otomatik yenileme
  - Kendi yorumlarını düzenleme ve silme kolaylığı
  - Toast bildirimleri
  - Başka kullanıcıların yorumlarını düzenleyememe/silememe (yetki kontrolü)
- **Demo:** Bir ürüne yorum ve puan ekleme, mevcut yorumu güncelleme, yorumu silme ve tüm yorumların görüntülenmesi gösterilecek.
