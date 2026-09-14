# Meyeka Finans

Şirket gelir, gider, ödeme, personel maliyeti ve aboneliklerini sade bir panelde yöneten responsive finans uygulaması.

## Kurulum

```bash
npm install
copy .env.example .env
```

`.env` içinde PostgreSQL bağlantısını ve güçlü bir `AUTH_SECRET` değerini düzenleyin.

## Veritabanı

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

## Geliştirme ve production

```bash
npm run dev
npm run build
npm start
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır. Arayüzdeki başlangıç verileri ürün deneyimini göstermek içindir; API katmanı PostgreSQL ve Prisma üzerinden kalıcı veri kullanır.

## Ortam değişkenleri

- `DATABASE_URL`: PostgreSQL bağlantı adresi
- `AUTH_SECRET`: Oturum imzalama anahtarı
- `AUTH_URL`: Uygulamanın dış adresi

## Mimari

- `src/app`: App Router sayfaları ve API uçları
- `src/components`: Tekrar kullanılabilir panel bileşenleri
- `src/lib`: Veri erişimi, doğrulama ve formatlama
- `prisma/schema.prisma`: İlişkisel finans veri modeli
