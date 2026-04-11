# Eda Nur Tarhan'ın REST API Metotları

**API Test Videosu:** [Buraya eklenecek](#)

## 1. Liste Oluşturma
- **Endpoint:** `POST /lists`
- **Request Body:** 
  ```json
  {
    "name": "Bilgisayar Toplama Parçaları",
    "color": "#ff0000",
    "icon": "💻"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Yeni liste başarıyla oluşturuldu.

## 2. Kişisel Listeleri Görüntüleme
- **Endpoint:** `GET /lists`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının oluşturduğu tüm listeler getirildi.

## 3. Liste İsmi ve Renk Güncelleme
- **Endpoint:** `PUT /lists/{listId}`
- **Path Parameters:** 
  - `listId` (string, required) - Düzenlenecek liste ID'si
- **Request Body:** 
  ```json
  {
    "name": "Yeni Liste Adı",
    "color": "#00ff00"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Liste başarıyla güncellendi.

## 4. Liste Silme
- **Endpoint:** `DELETE /lists/{listId}`
- **Path Parameters:** 
  - `listId` (string, required) - Silinecek liste ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Liste başarıyla silindi.

## 5. Listeye Yeni Ürün Ekleme
- **Endpoint:** `POST /lists/{listId}/items`
- **Path Parameters:** 
  - `listId` (string, required) - Ürünün ekleneceği liste ID'si
- **Request Body:** 
  ```json
  {
    "productId": "65ab3b4f9b2e"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Ürün ilgili listeye dahil edildi.

## 6. Liste İçeriğini (Detayını) Görüntüleme
- **Endpoint:** `GET /lists/{listId}`
- **Path Parameters:** 
  - `listId` (string, required) - İçeriği görüntülenecek liste ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Listenin kendi detay bilgisi ve içindeki ürün objeleri ile getirildi.

## 6.1 Liste İçerisindeki Ürünleri Çekme
- **Endpoint:** `GET /lists/{listId}/items`
- **Path Parameters:** 
  - `listId` (string, required) - İçeriği görüntülenecek liste ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Doğrudan liste içindeki ürünlerin formatlı (id, isim, fiyat) dökümü getirildi.

## 7. Listeden Ürün Silme
- **Endpoint:** `DELETE /lists/{listId}/items/{itemId}`
- **Path Parameters:** 
  - `listId` (string, required) - Listenin ID'si
  - `itemId` (string, required) - Listeden çıkarılacak spesifik ürünün ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Ürün listeden çıkarıldı.

## 8. Ürün Yorum ve Puan Ekleme
- **Endpoint:** `POST /reviews/{productId}`
- **Path Parameters:** 
  - `productId` (string, required) - Yorum yapılacak ürünün ID'si
- **Request Body:** 
  ```json
  {
    "rating": 5,
    "comment": "Fiyat performans açısından harika bir ürün!"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Yorum ve puan başarıyla eklendi.

## 9. Ürün Yorumlarını Görüntüleme
- **Endpoint:** `GET /reviews/{productId}`
- **Path Parameters:** 
  - `productId` (string, required) - Yorumları okunacak ürün ID'si
- **Response:** `200 OK` - Ürüne ait tüm yorumlar başarıyla listelendi.

## 10. Kişisel Yorum Güncelleme
- **Endpoint:** `PUT /reviews/{reviewId}`
- **Path Parameters:** 
  - `reviewId` (string, required) - Güncellenecek yorumun ID'si
- **Request Body:** 
  ```json
  {
    "rating": 4,
    "comment": "Bir süre kullandıktan sonra fikrim değişti."
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Yorum başarıyla güncellendi.

## 11. Yorum Silme
- **Endpoint:** `DELETE /reviews/{reviewId}`
- **Path Parameters:** 
  - `reviewId` (string, required) - Silinecek yorumun ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Yorum başarıyla silindi.
