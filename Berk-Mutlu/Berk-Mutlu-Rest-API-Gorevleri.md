# Berk Mutlu'nun REST API Metotları

**API Test Videosu:** [Buraya eklenecek](#)

## 1. Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:** 
  ```json
  {
    "email": "kullanici@suzgec.com",
    "password": "Guvenli123!"
  }
  ```
- **Response:** `200 OK` - Giriş başarılı, döndürülen veri içinde JWT token içerir.

## 2. Üye Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:** 
  ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
    "firstName": "Berk",
    "lastName": "Mutlu"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu.

## 3. Profil Görüntüleme
- **Endpoint:** `GET /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı bilgileri başarıyla getirildi.

## 4. Profil Güncelleme
- **Endpoint:** `PUT /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Request Body:** 
  ```json
  {
    "firstName": "Berk",
    "lastName": "Mutlu",
    "email": "yeniemail@suzgec.com"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı profil bilgileri başarıyla güncellendi.

## 5. Hesap Silme
- **Endpoint:** `DELETE /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Kullanıcı başarıyla silindi.

## 6. Arama Geçmişini Kaydetme/Görüntüleme
- **Endpoint:** `GET /users/history/searches`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının geçmiş aramaları listelendi.

## 7. Akıllı Ürün Arama Algoritması
- **Endpoint:** `GET /products/search`
- **Query Parameters:**
  - `q` (string, required) - Aranacak kelime
- **Response:** `200 OK` - Arama sonuçları getirildi.

## 8. Ürün Detayı ve Fiyat Analizi Görüntüleme
- **Endpoint:** `GET /products/{productId}`
- **Path Parameters:** 
  - `productId` (string, required) - Ürün ID'si
- **Response:** `200 OK` - Ürün detayı ve canlı fiyat verileri başarıyla getirildi.

## 9. Karşılaştırma Panosu Görüntüleme
- **Endpoint:** `GET /comparisons`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının karşılaştırma panosu listelendi.

## 10. Karşılaştırma Listesine Ürün Ekleme
- **Endpoint:** `POST /comparisons/items`
- **Request Body:** 
  ```json
  {
    "productId": "65ab3b4f9b2e"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Ürün karşılaştırma panosuna başarıyla eklendi.

## 11. Karşılaştırma Listesinden Ürün Kaldırma
- **Endpoint:** `DELETE /comparisons/items/{itemId}`
- **Path Parameters:** 
  - `itemId` (string, required) - Panodan silinecek ürünün ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Ürün karşılaştırma panosundan başarıyla kaldırıldı.
