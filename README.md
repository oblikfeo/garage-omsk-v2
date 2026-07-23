# Гараж самообслуживания — сайт (Омск)

Лендинг СТО самообслуживания на **Next.js 16** + **Tailwind CSS 4**. Готов к деплою на [Vercel](https://vercel.com).

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
npm start
```

## Деплой на Vercel

1. Импортируйте репозиторий на [vercel.com/new](https://vercel.com/new).
2. Framework Preset: **Next.js** (определяется автоматически).
3. Root Directory: оставьте корень репозитория (если репозиторий содержит только папку `website`).
4. Build Command: `npm run build`
5. Output: стандартный для Next.js.

### Переменные окружения

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Продакшен-домен для SEO, sitemap и Open Graph. Пример: `https://garage-omsk.ru` |

На Vercel, если переменная не задана, используется автоматический домен деплоя (`VERCEL_URL`).

## Структура

- `src/app/` — страницы (App Router)
- `src/components/` — UI-компоненты
- `src/lib/data.ts` — контент сайта (телефон, адрес, услуги, цены)
- `public/` — статические файлы

## SEO-страницы

- `/` — главная
- `/sto-samoobsluzhivaniya-omsk`
- `/garazh-na-chas-omsk`
- `/arenda-podyomnika-omsk`
- `/politika-konfidentsialnosti`
