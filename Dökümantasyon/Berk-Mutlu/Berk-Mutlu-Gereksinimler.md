# Berk Mutlu - Gereksinimler

1. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcıların sisteme giriş yaparak hizmetlere erişmesini sağlar. Email adresi ve şifre ile kimlik doğrulama yapılır. Başarılı giriş sonrası kullanıcıya erişim izni (JWT Token) verilir.

2. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir.

3. **Profil Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının hesap detaylarını ve profil bilgilerini şeffaf bir şekilde görüntülemesini sağlar. Kişisel bilgiler ve hesap durumu yetkilendirme kontrolüyle getirilir.

4. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının, kendi profil bilgilerini (ad, soyad, email vb.) güncellemesini sağlar. Kullanıcılar yalnızca kendi hesap bilgileri üzerinde değişiklik yapma hakkına sahiptir.

5. **Hesap Silme**
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının Süz-Geç sistemindeki tüm verilerini ve hesabını veritabanından kalıcı olarak silmesini sağlar. Veri güvenliği gereği yetkilendirme kontrolü yapılır ve işlem geri alınamaz.

6. **Arama Geçmişini Kaydetme/Görüntüleme**
   - **API Metodu:** `GET /users/history/searches`
   - **Açıklama:** Kullanıcıların platform üzerinde daha önceden arattığı kelimeleri algoritma yardımıyla tutan ve bunları listelemesini sağlayan bir geçmiş arama kayıt sistemi sağlar.

7. **Akıllı Ürün Arama Algoritması (Gerçek Zamanlı)**
   - **API Metodu:** `GET /products/search`
   - **Açıklama:** (Yapay Zeka Destekli/Akıllı Arama): Kullanıcıların istedikleri spesifik ürünü veya anahtar kelimeyi girdiğinde, arka planda farklı veri kaynaklarını tarayarak (DataForSEO vs.) en alakalı, canlı ürün sonuçlarını algoritmik bir biçimde dökmesini sağlayan ana arama motoru işlevi.

8. **Ürün Detayı ve Fiyat Analizi Görüntüleme**
   - **API Metodu:** `GET /products/{productId}`
   - **Açıklama:** Arama sonucunda çıkan bir ürün kartına tıklandığında, sistemdeki o ürüne ait yüksek çözünürlüklü resim, spesifikasyonlar, güncel canlı fiyat verilerini listelemesini sağlar.

9. **Karşılaştırma Panosu Görüntüleme**
   - **API Metodu:** `GET /comparisons`
   - **Açıklama:** Kullanıcının farklı marka veya modelleri teknik düzeyde kıyaslamak için boş bir çalışma alanı/pano (Karşılaştırma sepeti) görüntülemesini sağlar.

10. **Karşılaştırma Listesine Ürün Ekleme**
   - **API Metodu:** `POST /comparisons/items`
   - **Açıklama:** İki veya daha fazla ürünün teknik spec ve fiyatlarını kıyaslamak isteyen kullanıcının, dilediği ürünü genel karşılaştırma panosuna teknik donanımıyla eklemesini sağlar.

11. **Karşılaştırma Listesinden Ürün Kaldırma**
   - **API Metodu:** `DELETE /comparisons/items/{itemId}`
   - **Açıklama:** Kullanıcının teknik donanımını veya fiyat avantajlarını kıyaslamaktan vazgeçtiği, veya panoda yer kalmadığı için sepetinden çıkartmak istediği ürünü kaldırmasını sağlar.
