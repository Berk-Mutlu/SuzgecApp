# Berra Kırış'ın REST API Metotları

**API Test Videosu:** [Rest API Videosu](https://www.youtube.com/watch?v=azIHvRLaA7s)

## 1. Stok Takip Listesini Görüntüleme
- **Endpoint:** `GET /stock-alerts`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İlgili kullanıcının stok takip verileri başarıyla getirildi.

## 2. Stok Takibine Ürün Ekleme
- **Endpoint:** `POST /stock-alerts`
- **Request Body:** 
  ```json
  {
    "productId": "65ab3b4f9b2e"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Ürün stok takibine başarıyla eklendi, alarm kuruldu.

## 3. Stok Takibinden Ürün Silme
- **Endpoint:** `DELETE /stock-alerts/{alertId}`
- **Path Parameters:** 
  - `alertId` (string, required) - Silinecek stok takibi/alarmı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Ürün stok takibinden çıkarıldı, alarm iptal edildi.

## 4. Fiyat Alarm Listesi Görüntüleme
- **Endpoint:** `GET /price-alerts`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Tüm fiyat indirim alarmları listelendi.

## 5. Fiyat Düşüş Alarmı Ekleme
- **Endpoint:** `POST /price-alerts`
- **Request Body:** 
  ```json
  {
    "productId": "65ab3b4f9b2e",
    "targetPrice": 5000,
    "notifyVia": "email"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Akıllı fiyat düşüş alarmı oluşturuldu.

## 6. Fiyat Alarm Beklentisini Güncelleme
- **Endpoint:** `PUT /price-alerts/{alertId}`
- **Path Parameters:** 
  - `alertId` (string, required) - Düzenlenecek alarm ID'si
- **Request Body:** 
  ```json
  {
    "targetPrice": 4500,
    "notifyVia": "push_notification"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Alarm özellikleri güncellendi.

## 7. Fiyat Alarmı Silme
- **Endpoint:** `DELETE /price-alerts/{alertId}`
- **Path Parameters:** 
  - `alertId` (string, required) - Silinecek alarmın ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Alarm tamamen iptal edildi ve silindi.

## 8. Kullanıcı Bildirimlerini Görüntüleme
- **Endpoint:** `GET /notifications`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı uyarıları başarıyla listelendi.

## 9. Bildirimi Okundu Olarak İşaretleme
- **Endpoint:** `PUT /notifications/{id}/read`
- **Path Parameters:** 
  - `id` (string, required) - Okundu işaretlenecek bildirimin ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Bildirim başarıyla okundu durumuna alındı.

## 10. Bildirim Silme
- **Endpoint:** `DELETE /notifications/{id}`
- **Path Parameters:** 
  - `id` (string, required) - Silinecek bildirimin ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Bildirim kullanıcının posta kutusundan silindi.

## 11. Stok Zamanlayıcısını (Cron) Manuel Tetikleme
- **Endpoint:** `GET /stock-alerts/trigger-cron`
- **Query Parameters:** 
  - `secret` (string, required) - Cron tetikleme yetki şifresi
- **Authentication:** Secret query parametresi ile yetkilendirme (Cron Job yetkisi)
- **Response:** `200 OK` - Arka plandaki stok kontrol görevleri çalıştırıldı ve sonuçları döndü.

## 12. Yapay Zeka Karşılaştırma Analizi (Gemini AI)
- **Endpoint:** `POST /v1/ai/compare`
- **Request Body:** 
  ```json
  {
    "products": [
      { "name": "iPhone 15", "price": 45000, "specs": {} },
      { "name": "Samsung S24", "price": 43000, "specs": {} }
    ]
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Gemini asistanının Markdown formatında ürün tavsiyesi başarıyla alındı.
