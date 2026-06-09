# Berk Mutlu - Mobil Backend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**API Base URL:** `https://suzgecbackend.vercel.app/v1`  
**Gereksinimler:** 1-11

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Kullanıcı Kayıt (Üye Olma)
- **Metot:** `POST`
- **Endpoint:** `/v1/auth/register`
- **Açıklama:** Yeni kullanıcı hesabı oluşturur. Email, şifre, ad ve soyad bilgileri gereklidir.
- **Authentication:** Gerekli değil
- **Request Body:**
  ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
    "firstName": "Berk",
    "lastName": "Mutlu"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla oluşturuldu.",
    "data": {
      "userId": "6657a3b...",
      "email": "kullanici@example.com",
      "firstName": "Berk",
      "lastName": "Mutlu"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Eksik veya hatalı form verileri
  - `409 Conflict` — Email zaten kullanımda
- **Demo:** Postman veya mobil uygulama üzerinden yeni kullanıcı kaydı oluşturularak response gösterilecek.

---

## 2. Kullanıcı Girişi (Login)
- **Metot:** `POST`
- **Endpoint:** `/v1/auth/login`
- **Açıklama:** Mevcut kullanıcının email ve şifre ile giriş yapmasını sağlar. Başarılı girişte JWT token döner.
- **Authentication:** Gerekli değil
- **Request Body:**
  ```json
  {
    "email": "kullanici@suzgec.com",
    "password": "Guvenli123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Giriş başarılı.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "userId": "6657a3b...",
        "email": "kullanici@suzgec.com",
        "firstName": "Berk",
        "lastName": "Mutlu"
      }
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Eksik email veya şifre
  - `401 Unauthorized` — Email veya şifre hatalı
- **Demo:** Geçerli ve geçersiz bilgilerle giriş denemesi yapılarak her iki durumun response'u gösterilecek.

---

## 3. Profil Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/users/{userId}`
- **Açıklama:** Belirtilen kullanıcının profil bilgilerini getirir.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `userId` (string, required) — Kullanıcı ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "userId": "6657a3b...",
      "email": "kullanici@suzgec.com",
      "firstName": "Berk",
      "lastName": "Mutlu",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
  - `404 Not Found` — Kullanıcı bulunamadı
- **Demo:** Giriş yapıldıktan sonra profil bilgilerinin API'den çekilmesi gösterilecek.

---

## 4. Profil Güncelleme
- **Metot:** `PUT`
- **Endpoint:** `/v1/users/{userId}`
- **Açıklama:** Kullanıcının profil bilgilerini (ad, soyad, email) günceller.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `userId` (string, required) — Kullanıcı ID'si
- **Request Body:**
  ```json
  {
    "firstName": "Berk",
    "lastName": "Mutlu",
    "email": "yeniemail@suzgec.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı profil bilgileri başarıyla güncellendi.",
    "data": {
      "userId": "6657a3b...",
      "email": "yeniemail@suzgec.com",
      "firstName": "Berk",
      "lastName": "Mutlu"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Geçersiz veri formatı
  - `401 Unauthorized` — Token geçersiz
  - `409 Conflict` — Yeni email zaten kullanımda
- **Demo:** Profil bilgilerinin güncellenmesi ve güncel verilerin response'ta döndüğünün gösterilmesi.

---

## 5. Hesap Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/users/{userId}`
- **Açıklama:** Kullanıcı hesabını kalıcı olarak siler. İlişkili tüm veriler (listeler, alarmlar, yorumlar) temizlenir.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `userId` (string, required) — Kullanıcı ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Kullanıcı başarıyla silindi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
  - `404 Not Found` — Kullanıcı bulunamadı
- **Demo:** Hesap silme işlemi gerçekleştirilerek 204 yanıtının gösterilmesi.

---

## 6. Arama Geçmişi Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/users/history/searches`
- **Açıklama:** Giriş yapmış kullanıcının geçmiş aramalarını kronolojik sırayla listeler.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "query": "iPhone 15",
        "searchedAt": "2026-06-08T14:20:00Z"
      },
      {
        "query": "Samsung Galaxy S24",
        "searchedAt": "2026-06-07T09:15:00Z"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Birkaç arama yapıldıktan sonra arama geçmişinin API'den çekilmesi gösterilecek.

---

## 7. Akıllı Ürün Arama
- **Metot:** `GET`
- **Endpoint:** `/v1/products/search`
- **Açıklama:** Anahtar kelimeye göre ürün araması yapar. Farklı e-ticaret sitelerinden toplanan ürünleri döndürür.
- **Authentication:** Opsiyonel (giriş yapılmışsa arama geçmişine kaydedilir)
- **Query Parameters:**
  - `q` (string, required) — Aranacak kelime
- **Örnek İstek:** `GET /v1/products/search?q=laptop`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "productId": "65ab3b4f9b2e",
        "name": "Apple MacBook Air M2",
        "price": 42999,
        "image": "https://...",
        "seller": "Trendyol"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Arama kelimesi boş
- **Demo:** Farklı arama terimleriyle ürün araması yapılarak sonuçların gösterilmesi.

---

## 8. Ürün Detayı Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/products/{productId}`
- **Açıklama:** Belirtilen ürünün detaylı bilgilerini (isim, açıklama, fiyat, özellikler) getirir.
- **Authentication:** Gerekli değil
- **Path Parameters:**
  - `productId` (string, required) — Ürün ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "productId": "65ab3b4f9b2e",
      "name": "Apple MacBook Air M2",
      "description": "Apple M2 çipli MacBook Air",
      "price": 42999,
      "image": "https://...",
      "specs": {
        "İşlemci": "Apple M2",
        "RAM": "8 GB",
        "Depolama": "256 GB SSD"
      }
    }
  }
  ```
- **Demo:** Bir ürün ID'si ile detay bilgilerinin getirilmesi gösterilecek.

---

## 9. Ürün Satıcılarını Listeleme
- **Metot:** `GET`
- **Endpoint:** `/v1/products/{productId}/sellers`
- **Açıklama:** Belirtilen ürünü satan farklı e-ticaret sitelerini ve fiyatlarını listeler.
- **Authentication:** Gerekli değil
- **Path Parameters:**
  - `productId` (string, required) — Ürün ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "sellerName": "Trendyol",
        "price": 42999,
        "url": "https://trendyol.com/...",
        "inStock": true
      },
      {
        "sellerName": "Hepsiburada",
        "price": 44500,
        "url": "https://hepsiburada.com/...",
        "inStock": true
      }
    ]
  }
  ```
- **Demo:** Bir ürünün farklı satıcılarının fiyatlarıyla birlikte listelenmesi gösterilecek.

---

## 10. Karşılaştırma Panosu Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/comparisons`
- **Açıklama:** Kullanıcının karşılaştırma panosundaki ürünleri listeler.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "itemId": "abc123",
          "productId": "65ab3b4f9b2e",
          "name": "Apple MacBook Air M2",
          "price": 42999,
          "addedAt": "2026-06-08T10:00:00Z"
        }
      ]
    }
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Karşılaştırma panosundaki ürünlerin listelenmesi gösterilecek.

---

## 11. Karşılaştırma Panosuna Ürün Ekleme
- **Metot:** `POST`
- **Endpoint:** `/v1/comparisons/items`
- **Açıklama:** Belirtilen ürünü kullanıcının karşılaştırma panosuna ekler.
- **Authentication:** Bearer Token gerekli
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
    "message": "Ürün karşılaştırma panosuna başarıyla eklendi.",
    "data": {
      "itemId": "abc123",
      "productId": "65ab3b4f9b2e"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Ürün zaten panoda veya maksimum sınıra ulaşıldı
  - `401 Unauthorized` — Token geçersiz
- **Demo:** Bir ürünün karşılaştırma panosuna eklenmesi gösterilecek.

---

## 12. Karşılaştırma Panosundan Ürün Kaldırma
- **Metot:** `DELETE`
- **Endpoint:** `/v1/comparisons/items/{itemId}`
- **Açıklama:** Karşılaştırma panosundan belirtilen ürünü kaldırır.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `itemId` (string, required) — Panodan silinecek ürünün ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Ürün başarıyla kaldırıldı.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Ürün panoda bulunamadı
- **Demo:** Karşılaştırma panosundan bir ürünün kaldırılması gösterilecek.
