# ===================================
# SuzgecApp Frontend - Docker İmajı
# Next.js 16 Çok Aşamalı Derleme
# ===================================

# ----- Aşama 1: Bağımlılık Yükleme -----
FROM node:20-alpine AS deps

# libc6-compat bazı native modüller için gerekli
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Bağımlılık dosyalarını kopyala (önbellek optimizasyonu)
COPY package.json package-lock.json* ./

# Tüm bağımlılıkları yükle (derleme için devDependencies da gerekli)
RUN npm ci


# ----- Aşama 2: Derleme -----
FROM node:20-alpine AS builder

WORKDIR /app

# Bağımlılıkları önceki aşamadan kopyala
COPY --from=deps /app/node_modules ./node_modules

# Kaynak kodunu kopyala
COPY . .

# Next.js telemetriyi devre dışı bırak
ENV NEXT_TELEMETRY_DISABLED=1

# Üretim derlemesi oluştur
RUN npm run build


# ----- Aşama 3: Çalıştırma -----
FROM node:20-alpine AS runner

WORKDIR /app

# Üretim ortamını ayarla
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Güvenlik: root olmayan kullanıcı oluştur
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Gerekli dosyaları kopyala
# public dizini (statik dosyalar)
COPY --from=builder /app/public ./public

# Next.js standalone çıktısını kopyala
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Root olmayan kullanıcıya geç
USER nextjs

# Portu aç
EXPOSE 3000

# Ortam değişkenleri
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sağlık kontrolü
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Next.js standalone sunucusunu başlat
CMD ["node", "server.js"]
