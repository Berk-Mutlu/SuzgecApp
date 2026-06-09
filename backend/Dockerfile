# ===================================
# SuzgecApp Backend - Docker İmajı
# Node.js + Express API Sunucusu
# ===================================

FROM node:20-alpine

# Güvenlik: root olmayan kullanıcı oluştur
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressuser

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılık dosyalarını kopyala (önbellek optimizasyonu için ayrı katman)
COPY package*.json ./

# Sadece üretim bağımlılıklarını yükle
RUN npm ci --only=production

# Uygulama kaynak kodunu kopyala
COPY . .

# Root olmayan kullanıcıya geç
USER expressuser

# API portunu aç
EXPOSE 9000

# Ortam değişkenlerini ayarla
ENV PORT=9000
ENV NODE_ENV=production

# Sağlık kontrolü ekle
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9000/ || exit 1

# Uygulamayı başlat
CMD ["node", "api/index.js"]
