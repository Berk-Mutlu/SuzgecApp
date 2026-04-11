# Eda Nur Tarhan - Gereksinimler

1. **Liste Oluşturma**
   - **API Metodu:** `POST /lists`
   - **Açıklama:** Kullanıcıların favori veya takip etmek istedikleri ürünleri kendi içlerinde gruplayabilmesi için sisteme yeni bir liste eklemesini sağlar.

2. **Kişisel Listeleri Görüntüleme**
   - **API Metodu:** `GET /lists`
   - **Açıklama:** Kullanıcının daha önceden oluşturduğu tüm listelerini genel bir önizleme ile tek bir ekranda kolayca görmesini sağlar.

3. **Liste İsmi ve Renk Güncelleme**
   - **API Metodu:** `PUT /lists/{listId}`
   - **Açıklama:** Kullanıcının mevcut bir listenin adını veya arayüz detaylarını kendi isteğine göre değiştirmesine olanak tanır.

4. **Liste Silme**
   - **API Metodu:** `DELETE /lists/{listId}`
   - **Açıklama:** Kullanıcının artık ihtiyaç duymadığı veya kullanmak istemediği bir listeyi sistemden tamamen kaldırmasını sağlar.

5. **Listeye Yeni Ürün Ekleme**
   - **API Metodu:** `POST /lists/{listId}/items`
   - **Açıklama:** Kullanıcının incelerken beğendiği veya ilgilendiği bir ürünü, daha önceden oluşturduğu bir listeye sonradan dahil etmesini sağlar.

6. **Liste İçeriğini (Tüm Detaylarıyla) Görüntüleme**
   - **API Metodu:** `GET /lists/{listId}`
   - **Açıklama:** Kullanıcının seçtiği belirli bir listenin özellikleriyle birlikte içine girerek, o listeye eklenmiş olan tüm ürünleri eksiksiz ve detaylı bir şekilde görmesini sağlar.

7. **Listeden Ürün Silme**
   - **API Metodu:** `DELETE /lists/{listId}/items/{itemId}`
   - **Açıklama:** Kullanıcının bir liste içerisinden artık takip etmek istemediği belirli bir ürünü tek başına çıkarmasını sağlar.

8. **Ürün Yorum ve Puan Ekleme**
   - **API Metodu:** `POST /reviews/{productId}`
   - **Açıklama:** Kullanıcıların, satın aldıkları veya ilgilendikleri bir ürün hakkında 5 üzerinden bir yıldız değerlendirmesi yapmasını ve sisteme o ürünle ilgili kişisel metin yorumlarını eklemelerini sağlar. 

9. **Ürün Yorumlarını Görüntüleme**
   - **API Metodu:** `GET /reviews/{productId}`
   - **Açıklama:** Herhangi bir kullanıcının, bir ürünün sayfasına girdiğinde diğer kullanıcıların o ürün hakkında geçmişte yapmış olduğu tüm yorumları ve genel değerlendirme puanını listelemesini sağlar.

10. **Kişisel Yorum Güncelleme**
   - **API Metodu:** `PUT /reviews/{reviewId}`
   - **Açıklama:** Bir kullanıcının önceden yazmış olduğu bir ürün yorumunu düşüncesi değiştiği takdirde kolaylıkla düzenlemesini ve güncel yıldız puanını sisteme tekrar kaydetmesini sağlar.

11. **Yorum Silme**
   - **API Metodu:** `DELETE /reviews/{reviewId}`
   - **Açıklama:** Bir kullanıcının sisteme bıraktığı kendi değerlendirmesini tamamen silip kaldırmasını sağlar.