# Eda Nur Tarhan'ın Web Frontend Görevleri
**Front-end Test Videosu:** [Buraya eklenecek](#)

## 1. Listelerim (Koleksiyon) Anasayfası
- **API Endpoints:** `GET /lists`, `POST /lists`
- **Görev:** Kullanıcının tüm listelerini (örn: Laptoplarım, Telefonlar) kartlar halinde gördüğü listeleme ekranı ve liste ekleme işlevi.
- **UI Bileşenleri:**
  - Liste önizleme kartları (isim, renk etiketi ve içinde bulunan eşya sayısı/resim kolajı)
  - Yeni Ekle butonu (Floating action button veya kart hizasında "Add New" çerçevesi)
  - Yeni liste oluşturmak için Modal/Form dialogu
  - "Liste İsmi" input alanı
  - "Renk Seçimi" (Radio button picker veya hex color picker)
- **Form Validasyonu:**
  - Liste adı minimum 3, maksimum 30 karakter olmalıdır (HTML5 maxlength)
  - Liste adı zorunlu alandır, girilmeden "Oluştur" butonu aktif olmaz (disabled state)
  - Renk/İkon seçimi zorunlu bir default değer barındırmalı
- **Kullanıcı Deneyimi:**
  - Data yüklenirken Skeleton yükleme barları (Yumuşak geçişli loading ekranı)
  - Modal form'da hata olursa inline hata gösterimi
  - Başarılı liste oluşturma sonrası toast bildirimi (örn: "Liste Eklendi!") ve listenin anında ekranda animasyonla belirmesi
- **Teknik Detaylar:**
  - Framework: Next.js (React)
  - Form Yönetimi: React Hook Form & Zod
  - Optimizasyon modeli: SWR/React Query ile liste verisini ön belleğe alma

## 2. Liste Detayı, Güncelleme ve Listeden Ürün Düzenleme
- **API Endpoints:** `GET /lists/{listId}`, `PUT /lists/{listId}`, `DELETE /lists/{listId}`, `DELETE /lists/{listId}/items/{itemId}`
- **Görev:** Listeye tıklandığında içindeki ürünlerin sunulduğu Dashboard sayfası. Ürünlerin tablosu ve listenin düzenlenme mekanizması.
- **UI Bileşenleri:**
  - Page header: Dynamic Liste Adı, İkon, ve Seçilen Tema Rengi ile header stili
  - Listeden çıkarma görevi yapan "Çöp Kutusu (Trash)" butonu barındıran ürün kartları grid sistemi
  - Ekranın üstünde "Listeyi Düzenle" butonu (Liste adı ve rengini değiştiren ikinci modal)
  - Destructive: Kırmızı renkli "Tüm Listeyi Sil" butonu ve Confirmation Dialog
- **Form Validasyonu:**
  - Güncelleme modunda liste isminin eski ismiyle aynı olup olmadığı veya empty check kontrolleri
  - Değişiklik yoksa "Güncelle" butonu pasif (disabled) kalır
- **Kullanıcı Deneyimi:**
  - Listeyi Sil derken "Bu işlem geri alınamaz, listeyi silmek istediğinize emin misiniz?" çift ekran (double confirmation) onayı
  - Ürün silme (çöp kutusuna basma) tıklandığında ürünün card objesinden fade-out olup sayının düşmesi (Optimistic Update)
  - Listenin boş olması durumunda "Bu listeye henüz ürün eklemediniz, haydi ekleyelim" yönlendirme (Empty State) mesajı
- **Teknik Detaylar:**
  - Nested routing (`/lists/[listId]` üzerinden sayfa yaratımı)
  - Modal state yönetimi (isEditModalOpen vb. hooklar)

## 3. Ürün Sayfasında Listeye Ekleme Modülü
- **API Endpoint:** `POST /lists/{listId}/items`
- **Görev:** Ürün ürünün inceleme sayfasında çıkan "Listeye Kaydet" tetikleyicisini UI katmanında bağlamak.
- **UI Bileşenleri:**
  - Ürün fiyat tablosu yanındaki ikonlu ("Kalp" veya "Bookmark") Buton
  - Tıklandığında mevcut listeleri listeleyen ve kullanıcının önüne seren popup (Popover veya Drawer menü)
  - Liste seçildiğinde listeye atan submit butonu ("Onayla")
- **Form Validasyonu:**
  - Eğer ürün kullanıcının listelerinde halihazırda varsa, o listenin seçilebilirliğinin kapanması (Disabled checkbox) veya uyarı verilmesi
- **Kullanıcı Deneyimi:**
  - "Sepete Eklendi / Listeye Eklendi" yeşil onay (Success) pencereleri
- **Teknik Detaylar:**
  - Ürün sayfasının alt komponenti olarak çalışabilmesi, portal kullanılarak ekranda gösterimi.

## 4. Değerlendirme ve Yorum (Review) Sistemi
- **API Endpoints:** `GET /reviews/{productId}`, `POST /reviews/{productId}`, `PUT /reviews/{reviewId}`, `DELETE /reviews/{reviewId}`
- **Görev:** Kullanıcıların ürünlere yıldız ve metin girdiği, diğerlerinin yorumlarını okuduğu sayfa sekmesi.
- **UI Bileşenleri:**
  - Kullanıcı yorumlarını barındıran dinamik kart düzeni (Kullanıcı Avatarı, İsmi, Yıldız Ratingi, Yorum Metni)
  - Ortalamaya ait ProgressBar veya 5'li Yıldız görseli
  - Yeni yorum girebilmek için Textarea
  - İnteraktif Hover yapılabilen (Rating belirten) 5 yıldız input modülü
  - Yorumu silmeye yarayan üç nokta "..." Dropdown Menu
- **Form Validasyonu:**
  - Derecelendirme (Yıldız) seçimi kesinlikle olmalı (Required, `rating > 0 && rating <= 5`)
  - Yorum metni küfür/argo veya asgari uzunluk kontrolleri (En az 10 karakter vb.)
  - Yazma işlemi sürerken kalan karakter göstergesi
- **Kullanıcı Deneyimi:**
  - Kendi yorumlarının en üstte görünmesi ve Edit/Delete butonlarının sadece o yoruma özel aktif gelmesi
  - Optimistic Submit: Ben enter'a basar basmaz sunucudan yanıt beklenmeden (ama bekleme ikonu atarak) listeye eklendiğini görmek
- **Teknik Detaylar:**
  - State yönetimi (Review submission, edit mode on/off switch)
