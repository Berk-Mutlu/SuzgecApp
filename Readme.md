# Süz-Geç

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![React Native](https://img.shields.io/badge/React_Native-Expo_54-61DAFB?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-green?style=flat&logo=vercel)

---

## Proje Hakkında

![Ürün Tanıtım Görseli](Product.png)

**Proje Tanımı:** 

Akıllı fiyat karşılaştırma ve stok takip platformumuz Süzgeç, alışveriş deneyimini tamamen optimize etmek ve kullanıcıların en doğru kararı vermesini sağlamak amacıyla tasarlanmış modern bir dijital asistandır. Sistem; onlarca farklı e-ticaret sitesinden ürün verilerini anlık olarak analiz ederek, kullanıcıya gerçek zamanlı bir fiyat haritası sunar.

Süzgeç, yalnızca bir arama motoru olmanın ötesine geçerek; kullanıcıların bütçe hedeflerine, takip listelerine ve kişisel tercihlerine göre özelleştirilmiş bir süreç yönetimi sağlar. Uygulama, karmaşık fiyat dalgalanmalarını takip etmek zorunda kalan kullanıcılar için fiyat geçmişi grafiklerini, stok alarmlarını ve hedef fiyat bildirimlerini tek bir merkezden sunar. Ayrıca kullanıcı dostu arayüzü sayesinde ürünleri teknik özelliklerine ve fiyat/performans dengesine göre kolayca karşılaştırma imkanı tanır.

Bu bütünleşik yapı sayesinde kullanıcılar; zaman kaybetmeden, bütçelerine en uygun ürüne, en güvenilir satıcıdan ulaşabilirler. Süzgeç; dinamik, hızlı ve güvenilir altyapısıyla alışverişin her anında kullanıcının yanında olan kapsamlı bir ekosistemdir

**Proje Kategorisi:** 
> Alışveriş

**Referans Uygulama:** 
> 

---

## Proje Linkleri

- **REST API Adresi:** [suzgecbackend.vercel.app](https://suzgecbackend.vercel.app/)
- **Web Frontend Adresi:** [suzgec.vercel.app](https://suzgec.vercel.app/)

---

## Proje Ekibi

**B²E** 


**Ekip Üyeleri:** 
- Berk Mutlu
- Berra Kırış
- Eda Nur Tarhan

---

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| **Web Frontend** | Next.js 16, React 19, Tailwind CSS, shadcn/ui, Framer Motion |
| **Mobil Uygulama** | React Native (Expo 54), TypeScript |
| **Backend API** | Node.js, Express.js |
| **Veritabanı** | MongoDB Atlas (Mongoose ODM) |
| **Önbellek** | Redis (ioredis) — API sonuç önbellekleme, JWT kara listeleme |
| **Mesaj Kuyruğu** | RabbitMQ (amqplib) — Asenkron bildirim işleme |
| **Konteynerizasyon** | Docker, Docker Compose |
| **CI/CD** | Jenkins Pipeline |
| **Deployment** | Vercel (Production), Docker (Lokal) |
| **Yapay Zeka** | Google Gemini API (ürün karşılaştırma) |

---

## Docker ile Çalıştırma

Projeyi Docker ile lokalde çalıştırmak için:

```bash
# Tüm servisleri başlat (MongoDB, Redis, RabbitMQ, Backend, Frontend)
docker-compose up -d

# Servislerin durumunu kontrol et
docker-compose ps

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

**Servis Adresleri (Docker):**
| Servis | Adres |
|--------|-------|
| Backend API | http://localhost:5000 |
| Web Frontend | http://localhost:3000 |
| RabbitMQ Yönetim Paneli | http://localhost:15672 (guest/guest) |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

---

## Dokümantasyon

Proje dokümantasyonuna aşağıdaki linklerden erişebilirsiniz:

1. [Gereksinim Analizi](Gereksinim-Analizi.md)
2. [REST API Tasarımı](API-Tasarimi.md)
3. [REST API](Rest-API.md)
4. [Web Front-End](WebFrontEnd.md)
5. [Mobil Front-End](MobilFrontEnd.md)
6. [Mobil Backend](MobilBackEnd.md)
7. [Video Sunum](Sunum.md)
---