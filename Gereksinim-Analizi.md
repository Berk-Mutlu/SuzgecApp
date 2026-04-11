
# Tüm Gereksinimler 

1. **Giriş Yapma** (Berk Mutlu)
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcıların sisteme giriş yaparak hizmetlere erişmesini sağlar. Email adresi ve şifre ile kimlik doğrulama yapılır. Başarılı giriş sonrası kullanıcıya erişim izni verilir.

2. **Üye Olma** (Berk Mutlu)
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir.

3. **Profil Görüntüleme** (Berk Mutlu)
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının hesap detaylarını ve profil bilgilerini şeffaf bir şekilde görüntülemesini sağlar.

4. **Profil Güncelleme** (Berk Mutlu)
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının, kendi profil bilgilerini (ad, soyad, email vb.) güncellemesini sağlar.

5. **Hesap Silme** (Berk Mutlu)
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının Süz-Geç sistemindeki tüm verilerini ve hesabını veritabanından kalıcı olarak silmesini sağlar.

6. **Arama Geçmişini Kaydetme/Görüntüleme** (Berk Mutlu)
   - **API Metodu:** `GET /users/history/searches`
   - **Açıklama:** Kullanıcıların platform üzerinde daha önceden arattığı kelimeleri algoritma yardımıyla tutan ve bunları listelemesini sağlayan bir geçmiş arama kayıt sistemi sağlar.

7. **Akıllı Ürün Arama Algoritması** (Berk Mutlu)
   - **API Metodu:** `GET /products/search`
   - **Açıklama:** Kullanıcıların istedikleri spesifik ürünü veya anahtar kelimeyi girdiğinde, arka planda farklı veri kaynaklarını tarayarak en alakalı sonuçları dökmesini sağlayan ana arama motoru işlevidir.

8. **Ürün Detayı ve Fiyat Analizi Görüntüleme** (Berk Mutlu)
   - **API Metodu:** `GET /products/{productId}`
   - **Açıklama:** Arama sonucunda çıkan bir ürün kartına tıklandığında, sistemdeki o ürüne ait yüksek çözünürlüklü resim, spesifikasyonlar, güncel fiyat verilerini detaylı listelemesini sağlar.

9. **Karşılaştırma Panosu Görüntüleme** (Berk Mutlu)
   - **API Metodu:** `GET /comparisons`
   - **Açıklama:** Kullanıcının farklı marka veya modelleri teknik düzeyde kıyaslamak için pano görüntülemesini sağlar.

10. **Karşılaştırma Listesine Ürün Ekleme** (Berk Mutlu)
    - **API Metodu:** `POST /comparisons/items`
    - **Açıklama:** İki veya daha fazla ürünün donanımını kıyaslamak isteyen kullanıcının, dilediği ürünü genel karşılaştırma panosuna teknik donanımıyla eklemesini sağlar.

11. **Karşılaştırma Listesinden Ürün Kaldırma** (Berk Mutlu)
    - **API Metodu:** `DELETE /comparisons/items/{itemId}`
    - **Açıklama:** Kullanıcının kıyaslamaktan vazgeçtiği ürünü panodan kaldırmasını sağlar.

12. **Stok Takip Listesini Görüntüleme** (Berra Kırış)
    - **API Metodu:** `GET /stock-alerts`
    - **Açıklama:** Kullanıcının, mağazada tükenmiş olan ancak tekrar stoklara girdiğinde satın almayı planladığı tüm ürünleri tek bir panoda genel bir liste halinde kontrol etmesini sağlar.

13. **Stok Takibine Ürün Ekleme** (Berra Kırış)
    - **API Metodu:** `POST /stock-alerts`
    - **Açıklama:** Kullanıcının, belirli bir mağazada tükenmiş olan bir ürün stoklara girdiğinde haberdar olmak için ürünü takibe almasını sağlar.

14. **Stok Takibinden Ürün Silme** (Berra Kırış)
    - **API Metodu:** `DELETE /stock-alerts/{alertId}`
    - **Açıklama:** Kullanıcının ilgisini kaybettiği ürünü stok alarm listesinden silmesini sağlar.

15. **Fiyat Alarm Listesi Görüntüleme** (Berra Kırış)
    - **API Metodu:** `GET /price-alerts`
    - **Açıklama:** Kullanıcının kurmuş olduğu tüm fiyat düşüş alarmlarını ve belirlediği hedef düşük fiyatları topluca ekranda incelemesini sağlar.

16. **Fiyat Düşüş Alarmı Ekleme** (Berra Kırış)
    - **API Metodu:** `POST /price-alerts`
    - **Açıklama:** Kullanıcının, incelediği bir ürünün fiyatı kendi girdiği bütçe sınırının altına düştüğünde uyarı almak için alarm kurmasını sağlar.

17. **Fiyat Alarm Beklentisini Güncelleme** (Berra Kırış)
    - **API Metodu:** `PUT /price-alerts/{alertId}`
    - **Açıklama:** Kullanıcının var olan bir alarmdaki "Hedef Fiyat" beklentisini veya iletişim tercihlerini sonradan değiştirmesine olanak tanır.

18. **Fiyat Alarmı Silme** (Berra Kırış)
    - **API Metodu:** `DELETE /price-alerts/{alertId}`
    - **Açıklama:** Kullanıcının artık ucuzlamasını beklemediği ürün alarmını iptal edip sistemden kaldırmasını sağlar.

19. **Kullanıcı Bildirimlerini Görüntüleme** (Berra Kırış)
    - **API Metodu:** `GET /notifications`
    - **Açıklama:** Fiyat veya stok alarmları tetiklendiğinde kullanıcının o güne dek gelen sıralanmış tüm mesajlarını bir liste halinde görüntülemesini sağlar.

20. **Bildirimi Okundu Olarak İşaretleme** (Berra Kırış)
    - **API Metodu:** `PUT /notifications/{id}/read`
    - **Açıklama:** Kullanıcının bildirim ekranında yanan uyarılara dokunarak mesajların arka planda okundu (pasif) statüsüne geçmesini sağlamasıdır.

21. **Bildirim Silme** (Berra Kırış)
    - **API Metodu:** `DELETE /notifications/{id}`
    - **Açıklama:** Kullanıcının işe yaramayan eski duyuru ve indirim mesajlarını yok edip bildirim kutusunu tamamen temizlemesini sağlar.

22. **Liste Oluşturma** (Eda Nur Tarhan)
    - **API Metodu:** `POST /lists`
    - **Açıklama:** Kullanıcıların favori veya takip etmek istedikleri ürünleri kendi içlerinde gruplayabilmesi için sisteme yeni bir liste eklemesini sağlar.

23. **Kişisel Listeleri Görüntüleme** (Eda Nur Tarhan)
    - **API Metodu:** `GET /lists`
    - **Açıklama:** Kullanıcının daha önceden oluşturduğu tüm listelerini genel bir önizleme ile tek bir ekranda görmesini sağlar.

24. **Liste İsmi ve Renk Güncelleme** (Eda Nur Tarhan)
    - **API Metodu:** `PUT /lists/{listId}`
    - **Açıklama:** Kullanıcının mevcut bir listenin adını veya arayüz detaylarını kendi isteğine göre değiştirmesine olanak tanır.

25. **Liste Silme** (Eda Nur Tarhan)
    - **API Metodu:** `DELETE /lists/{listId}`
    - **Açıklama:** Kullanıcının artık ihtiyaç duymadığı veya kullanmak istemediği bir listeyi sistemden tamamen kaldırmasını sağlar.

26. **Listeye Yeni Ürün Ekleme** (Eda Nur Tarhan)
    - **API Metodu:** `POST /lists/{listId}/items`
    - **Açıklama:** Kullanıcının incelerken beğendiği veya ilgilendiği bir ürünü, daha önceden oluşturduğu bir listeye sonradan dahil etmesini sağlar.

27. **Liste İçeriğini Görüntüleme** (Eda Nur Tarhan)
    - **API Metodu:** `GET /lists/{listId}`
    - **Açıklama:** Kullanıcının seçtiği belirli bir listenin özellikleriyle birlikte içine girerek, o listeye eklenmiş olan tüm ürünleri detaylı bir şekilde görmesini sağlar.

28. **Listeden Ürün Silme** (Eda Nur Tarhan)
    - **API Metodu:** `DELETE /lists/{listId}/items/{itemId}`
    - **Açıklama:** Kullanıcının bir liste içerisinden artık takip etmek istemediği belirli bir ürünü tek başına çıkarmasını sağlar.

29. **Ürün Yorum ve Puan Ekleme** (Eda Nur Tarhan)
    - **API Metodu:** `POST /reviews/{productId}`
    - **Açıklama:** Kullanıcıların, satın aldıkları veya ilgilendikleri bir ürün hakkında 5 üzerinden bir yıldız değerlendirmesi yapmasını ve o ürünle ilgili kişisel yorumlarını eklemelerini sağlar.

30. **Ürün Yorumlarını Görüntüleme** (Eda Nur Tarhan)
    - **API Metodu:** `GET /reviews/{productId}`
    - **Açıklama:** Herhangi bir kullanıcının, bir ürün sayfasına girdiğinde diğer kullanıcıların o ürün hakkında geçmişte yapmış olduğu tüm yorumları incelemesini sağlar.

31. **Kişisel Yorum Güncelleme** (Eda Nur Tarhan)
    - **API Metodu:** `PUT /reviews/{reviewId}`
    - **Açıklama:** Bir kullanıcının önceden yazmış olduğu bir ürün yorumunu düzenlemesini ve güncel yıldız puanını sisteme tekrar kaydetmesini sağlar.

32. **Yorum Silme** (Eda Nur Tarhan)
    - **API Metodu:** `DELETE /reviews/{reviewId}`
    - **Açıklama:** Bir kullanıcının sisteme bıraktığı kendi değerlendirmesini tamamen silip kaldırmasını sağlar.

33. **Yapay Zeka Ürün Karşılaştırma** (Berra Kırış)
    - **Açıklama:** Kullanıcının ilgilendiği birden fazla ürünü arka planda GenAI (Gemini) API ile kıyaslayarak kullanıcıya tavsiye sunan yapay zeka asistanı.

# Gereksinim Dağılımları

1. [Berk Mutlu'nun Gereksinimleri](Berk-Mutlu/Berk-Mutlu-Gereksinimler.md)
2. [Berra Kırış'ın Gereksinimleri](Berra-Kırış/Berra-Kırış-Gereksinimler.md)
3. [Eda Nur Tarhan'ın Gereksinimleri](Eda-Nur-Tarhan/Eda-Nur-Tarhan-Gereksinimler.md)


