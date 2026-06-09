# Eda Nur Tarhan - Mobil Backend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**API Base URL:** `https://suzgecbackend.vercel.app/v1`  
**Gereksinimler:** 22-32

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Liste Oluşturma
- **Metot:** `POST`
- **Endpoint:** `/v1/lists`
- **Açıklama:** Kullanıcı için yeni bir alışveriş/takip listesi oluşturur. İsim, renk ve ikon bilgileri belirlenebilir.
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "name": "Bilgisayar Toplama Parçaları",
    "color": "#ff0000",
    "icon": "💻"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Yeni liste başarıyla oluşturuldu.",
    "data": {
      "listId": "lst_001",
      "name": "Bilgisayar Toplama Parçaları",
      "color": "#ff0000",
      "icon": "💻",
      "createdAt": "2026-06-08T10:00:00Z"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Liste ismi boş veya eksik alan
  - `401 Unauthorized` — Token geçersiz
- **Demo:** Yeni bir alışveriş listesi oluşturulması gösterilecek.

---

## 2. Kişisel Listeleri Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/lists`
- **Açıklama:** Giriş yapmış kullanıcının oluşturduğu tüm listeleri getirir.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "listId": "lst_001",
        "name": "Bilgisayar Toplama Parçaları",
        "color": "#ff0000",
        "icon": "💻",
        "itemCount": 5,
        "createdAt": "2026-06-08T10:00:00Z"
      },
      {
        "listId": "lst_002",
        "name": "Mutfak Gereçleri",
        "color": "#00ff00",
        "icon": "🍳",
        "itemCount": 3,
        "createdAt": "2026-06-07T14:30:00Z"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Kullanıcının tüm listelerinin getirilmesi gösterilecek.

---

## 3. Liste Güncelleme
- **Metot:** `PUT`
- **Endpoint:** `/v1/lists/{listId}`
- **Açıklama:** Mevcut bir listenin isim, renk veya ikon bilgilerini günceller.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — Düzenlenecek liste ID'si
- **Request Body:**
  ```json
  {
    "name": "Yeni Liste Adı",
    "color": "#00ff00"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Liste başarıyla güncellendi.",
    "data": {
      "listId": "lst_001",
      "name": "Yeni Liste Adı",
      "color": "#00ff00"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Geçersiz veri
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste bulunamadı
- **Demo:** Bir listenin adı ve renginin güncellenmesi gösterilecek.

---

## 4. Liste Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/lists/{listId}`
- **Açıklama:** Belirtilen listeyi ve içindeki tüm ürün bağlantılarını kalıcı olarak siler.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — Silinecek liste ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Liste başarıyla silindi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste bulunamadı
- **Demo:** Bir listenin silinmesi gösterilecek.

---

## 5. Listeye Ürün Ekleme
- **Metot:** `POST`
- **Endpoint:** `/v1/lists/{listId}/items`
- **Açıklama:** Belirtilen listeye bir ürün ekler.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — Ürünün ekleneceği liste ID'si
- **Request Body:**
  ```json
  {
    "productId": "65ab3b4f9b2e"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Ürün ilgili listeye dahil edildi.",
    "data": {
      "itemId": "item_001",
      "listId": "lst_001",
      "productId": "65ab3b4f9b2e"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Ürün zaten listede
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste veya ürün bulunamadı
- **Demo:** Bir ürünün listeye eklenmesi gösterilecek.

---

## 6. Liste İçeriğini (Detayını) Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/lists/{listId}`
- **Açıklama:** Listenin kendi detay bilgisini ve içindeki ürün objelerini getirir.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — İçeriği görüntülenecek liste ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "listId": "lst_001",
      "name": "Bilgisayar Toplama Parçaları",
      "color": "#ff0000",
      "icon": "💻",
      "items": [
        {
          "itemId": "item_001",
          "productId": "65ab3b4f9b2e",
          "name": "Apple MacBook Air M2",
          "price": 42999,
          "image": "https://..."
        }
      ]
    }
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste bulunamadı
- **Demo:** Bir listenin detay bilgisiyle birlikte içindeki ürünlerin getirilmesi gösterilecek.

---

## 7. Liste Ürünlerini Çekme
- **Metot:** `GET`
- **Endpoint:** `/v1/lists/{listId}/items`
- **Açıklama:** Doğrudan liste içindeki ürünlerin formatlı (id, isim, fiyat) dökümünü getirir.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — İçeriği görüntülenecek liste ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "itemId": "item_001",
        "productId": "65ab3b4f9b2e",
        "name": "Apple MacBook Air M2",
        "price": 42999
      },
      {
        "itemId": "item_002",
        "productId": "78cd5e6f1a3b",
        "name": "Logitech MX Master 3",
        "price": 2499
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste bulunamadı
- **Demo:** Bir listenin ürün dökümünün getirilmesi gösterilecek.

---

## 8. Listeden Ürün Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/lists/{listId}/items/{itemId}`
- **Açıklama:** Belirtilen listeden spesifik bir ürünü çıkarır.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `listId` (string, required) — Listenin ID'si
  - `itemId` (string, required) — Listeden çıkarılacak spesifik ürünün ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Ürün listeden çıkarıldı.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Liste veya ürün bulunamadı
- **Demo:** Bir listeden ürünün çıkarılması gösterilecek.

---

## 9. Ürün Yorum ve Puan Ekleme
- **Metot:** `POST`
- **Endpoint:** `/v1/reviews/{productId}`
- **Açıklama:** Belirtilen ürüne yorum ve puan (1-5 yıldız) ekler.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `productId` (string, required) — Yorum yapılacak ürünün ID'si
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Fiyat performans açısından harika bir ürün!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Yorum ve puan başarıyla eklendi.",
    "data": {
      "reviewId": "rev_001",
      "productId": "65ab3b4f9b2e",
      "rating": 5,
      "comment": "Fiyat performans açısından harika bir ürün!",
      "createdAt": "2026-06-08T16:00:00Z"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Puan 1-5 aralığında olmalı veya yorum boş
  - `401 Unauthorized` — Token geçersiz
  - `409 Conflict` — Bu ürüne zaten yorum yapılmış
- **Demo:** Bir ürüne yorum ve puan verilmesi gösterilecek.

---

## 10. Ürün Yorumlarını Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/reviews/{productId}`
- **Açıklama:** Belirtilen ürüne ait tüm yorumları ve puanları listeler.
- **Authentication:** Gerekli değil (herkese açık)
- **Path Parameters:**
  - `productId` (string, required) — Yorumları okunacak ürün ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "averageRating": 4.3,
      "totalReviews": 12,
      "reviews": [
        {
          "reviewId": "rev_001",
          "userId": "6657a3b...",
          "userName": "Eda Nur Tarhan",
          "rating": 5,
          "comment": "Fiyat performans açısından harika bir ürün!",
          "createdAt": "2026-06-08T16:00:00Z"
        },
        {
          "reviewId": "rev_002",
          "userId": "7768b4c...",
          "userName": "Berk Mutlu",
          "rating": 4,
          "comment": "Gayet başarılı bir ürün.",
          "createdAt": "2026-06-07T12:00:00Z"
        }
      ]
    }
  }
  ```
- **Demo:** Bir ürünün tüm yorumlarının listelenmesi gösterilecek.

---

## 11. Yorum Güncelleme
- **Metot:** `PUT`
- **Endpoint:** `/v1/reviews/{reviewId}`
- **Açıklama:** Kullanıcının kendi yazdığı yorumun puan ve/veya metnini günceller.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `reviewId` (string, required) — Güncellenecek yorumun ID'si
- **Request Body:**
  ```json
  {
    "rating": 4,
    "comment": "Bir süre kullandıktan sonra fikrim değişti."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Yorum başarıyla güncellendi.",
    "data": {
      "reviewId": "rev_001",
      "rating": 4,
      "comment": "Bir süre kullandıktan sonra fikrim değişti."
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Geçersiz puan veya boş yorum
  - `401 Unauthorized` — Token geçersiz
  - `403 Forbidden` — Bu yorum size ait değil
  - `404 Not Found` — Yorum bulunamadı
- **Demo:** Mevcut bir yorumun güncellenmesi gösterilecek.

---

## 12. Yorum Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/reviews/{reviewId}`
- **Açıklama:** Kullanıcının kendi yazdığı yorumu kalıcı olarak siler.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `reviewId` (string, required) — Silinecek yorumun ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Yorum başarıyla silindi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `403 Forbidden` — Bu yorum size ait değil
  - `404 Not Found` — Yorum bulunamadı
- **Demo:** Bir yorumun silinmesi gösterilecek.
