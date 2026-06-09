# Berra Kırış - Mobil Backend Görevleri

**Proje:** Süz-Geç — Akıllı Fiyat Karşılaştırma ve Stok Takip Platformu  
**Takım:** B²E  
**API Base URL:** `https://suzgecbackend.vercel.app/v1`  
**Gereksinimler:** 12-21, 33

> **Kanıt Videosu:** [Video linki buraya eklenecek](#)

---

## 1. Stok Takip Listesini Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/stock-alerts`
- **Açıklama:** Giriş yapmış kullanıcının stok takibine eklediği ürünleri ve alarm durumlarını listeler.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "alertId": "sa_001",
        "productId": "65ab3b4f9b2e",
        "productName": "Apple MacBook Air M2",
        "inStock": false,
        "createdAt": "2026-06-01T10:00:00Z"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Stok takip listesinin API'den çekilmesi gösterilecek.

---

## 2. Stok Takibine Ürün Ekleme
- **Metot:** `POST`
- **Endpoint:** `/v1/stock-alerts`
- **Açıklama:** Belirtilen ürünü kullanıcının stok takip listesine ekler. Ürün stoğa girdiğinde bildirim gönderilir.
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
    "message": "Ürün stok takibine başarıyla eklendi, alarm kuruldu.",
    "data": {
      "alertId": "sa_002",
      "productId": "65ab3b4f9b2e"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Ürün zaten takipte
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Ürün bulunamadı
- **Demo:** Bir ürünün stok takibine eklenmesi gösterilecek.

---

## 3. Stok Takibinden Ürün Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/stock-alerts/{alertId}`
- **Açıklama:** Belirtilen stok takip alarmını iptal eder ve listeden kaldırır.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `alertId` (string, required) — Silinecek stok takibi/alarmı ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Ürün stok takibinden çıkarıldı, alarm iptal edildi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Alarm bulunamadı
- **Demo:** Stok takibinden bir ürünün çıkarılması gösterilecek.

---

## 4. Fiyat Alarm Listesi Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/price-alerts`
- **Açıklama:** Kullanıcının oluşturduğu tüm fiyat düşüş alarmlarını listeler.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "alertId": "pa_001",
        "productId": "65ab3b4f9b2e",
        "productName": "Apple MacBook Air M2",
        "currentPrice": 42999,
        "targetPrice": 38000,
        "notifyVia": "email",
        "createdAt": "2026-06-01T12:00:00Z"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Aktif fiyat alarmlarının listelenmesi gösterilecek.

---

## 5. Fiyat Düşüş Alarmı Ekleme
- **Metot:** `POST`
- **Endpoint:** `/v1/price-alerts`
- **Açıklama:** Belirtilen ürün için hedef fiyat ve bildirim tercihiyle yeni bir fiyat düşüş alarmı oluşturur.
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "productId": "65ab3b4f9b2e",
    "targetPrice": 5000,
    "notifyVia": "email"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Akıllı fiyat düşüş alarmı oluşturuldu.",
    "data": {
      "alertId": "pa_002",
      "productId": "65ab3b4f9b2e",
      "targetPrice": 5000,
      "notifyVia": "email"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Geçersiz hedef fiyat veya eksik alan
  - `401 Unauthorized` — Token geçersiz
- **Demo:** Yeni bir fiyat düşüş alarmı oluşturulması gösterilecek.

---

## 6. Fiyat Alarm Güncelleme
- **Metot:** `PUT`
- **Endpoint:** `/v1/price-alerts/{alertId}`
- **Açıklama:** Mevcut bir fiyat alarmının hedef fiyatını veya bildirim tercihini günceller.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `alertId` (string, required) — Düzenlenecek alarm ID'si
- **Request Body:**
  ```json
  {
    "targetPrice": 4500,
    "notifyVia": "push_notification"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Alarm özellikleri güncellendi.",
    "data": {
      "alertId": "pa_001",
      "targetPrice": 4500,
      "notifyVia": "push_notification"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Geçersiz veri
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Alarm bulunamadı
- **Demo:** Bir alarmın hedef fiyatının güncellenmesi gösterilecek.

---

## 7. Fiyat Alarmı Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/price-alerts/{alertId}`
- **Açıklama:** Belirtilen fiyat alarmını kalıcı olarak siler ve iptal eder.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `alertId` (string, required) — Silinecek alarmın ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Alarm tamamen iptal edildi ve silindi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Alarm bulunamadı
- **Demo:** Bir fiyat alarmının silinmesi gösterilecek.

---

## 8. Kullanıcı Bildirimlerini Görüntüleme
- **Metot:** `GET`
- **Endpoint:** `/v1/notifications`
- **Açıklama:** Kullanıcıya gelen tüm bildirimleri (stok uyarısı, fiyat düşüşü, sistem bildirimi) listeler.
- **Authentication:** Bearer Token gerekli
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "notif_001",
        "title": "Fiyat Düştü!",
        "message": "Apple MacBook Air M2 fiyatı 38.000₺'ye düştü.",
        "type": "price_alert",
        "isRead": false,
        "createdAt": "2026-06-08T15:00:00Z"
      }
    ]
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token eksik veya geçersiz
- **Demo:** Kullanıcı bildirimlerinin listelenmesi gösterilecek.

---

## 9. Bildirimi Okundu Olarak İşaretleme
- **Metot:** `PUT`
- **Endpoint:** `/v1/notifications/{id}/read`
- **Açıklama:** Belirtilen bildirimi okundu durumuna getirir.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `id` (string, required) — Okundu işaretlenecek bildirimin ID'si
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bildirim başarıyla okundu durumuna alındı."
  }
  ```
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Bildirim bulunamadı
- **Demo:** Bir bildirimin okundu olarak işaretlenmesi gösterilecek.

---

## 10. Bildirim Silme
- **Metot:** `DELETE`
- **Endpoint:** `/v1/notifications/{id}`
- **Açıklama:** Belirtilen bildirimi kalıcı olarak siler.
- **Authentication:** Bearer Token gerekli
- **Path Parameters:**
  - `id` (string, required) — Silinecek bildirimin ID'si
- **Response (204 No Content):**
  - Yanıt gövdesi boş döner. Bildirim kullanıcının posta kutusundan silindi.
- **Hata Durumları:**
  - `401 Unauthorized` — Token geçersiz
  - `404 Not Found` — Bildirim bulunamadı
- **Demo:** Bir bildirimin silinmesi gösterilecek.

---

## 11. AI Ürün Karşılaştırma (Gemini AI)
- **Metot:** `POST`
- **Endpoint:** `/v1/ai/compare`
- **Açıklama:** Seçilen ürünleri Gemini AI yapay zeka modeline göndererek kapsamlı bir karşılaştırma analizi ve tavsiye raporu alır. Yanıt Markdown formatındadır.
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "products": [
      {
        "name": "iPhone 15",
        "price": 45000,
        "specs": {
          "Ekran": "6.1 inç",
          "İşlemci": "A16 Bionic",
          "RAM": "6 GB"
        }
      },
      {
        "name": "Samsung Galaxy S24",
        "price": 43000,
        "specs": {
          "Ekran": "6.2 inç",
          "İşlemci": "Snapdragon 8 Gen 3",
          "RAM": "8 GB"
        }
      }
    ]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "analysis": "## 📊 Ürün Karşılaştırma Raporu\n\n### iPhone 15 vs Samsung Galaxy S24\n\n| Özellik | iPhone 15 | Samsung S24 |\n|---------|-----------|-------------|\n| Fiyat | 45.000₺ | 43.000₺ |\n| İşlemci | A16 Bionic | Snapdragon 8 Gen 3 |\n\n### 🏆 Tavsiye\nFiyat-performans açısından Samsung Galaxy S24 öne çıkmaktadır...",
      "model": "gemini-1.5-flash"
    }
  }
  ```
- **Hata Durumları:**
  - `400 Bad Request` — Minimum 2 ürün gönderilmeli
  - `401 Unauthorized` — Token geçersiz
  - `503 Service Unavailable` — AI servisi geçici olarak kullanılamıyor
- **Demo:** İki ürün seçilerek AI karşılaştırma analizi başlatılması ve Markdown yanıtın gösterilmesi.
