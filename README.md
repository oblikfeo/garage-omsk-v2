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
| `ADMIN_PASSWORD` | Пароль для входа в `/admin`. Пока не задан — вход невозможен. |
| `ADMIN_SESSION_SECRET` | Необязательно. Ключ подписи сессионной куки. По умолчанию выводится из пароля, поэтому смена пароля разлогинивает всех. |
| `CONTENT_DIR` | Необязательно. Каталог с `content.json`. По умолчанию `./data`. |
| `UPLOAD_DIR` | Необязательно. Каталог для загруженных фото. По умолчанию `./public/uploads`. |

На Vercel, если переменная не задана, используется автоматический домен деплоя (`VERCEL_URL`).

## Админка

Панель находится по адресу `/admin` и закрыта паролем. Через неё редактируются
контакты, услуги, прайс, галерея (с загрузкой фото), шаги «как это работает»,
правила безопасности, отзывы, FAQ и дополнительные услуги.

Как это устроено:

- правки пишутся в `content.json` в каталоге `CONTENT_DIR` (по умолчанию `./data`);
- файл накладывается поверх значений из `src/lib/data.ts`, поэтому неполный или
  повреждённый JSON не может уронить сайт — недостающие поля берутся из кода;
- после сохранения вызывается `revalidatePath`, и страницы перерисовываются сразу;
  плюс работает ISR с интервалом 60 секунд — после нового билда правки
  подхватятся, даже если в панель никто не заходил;
- загруженные фото складываются в `UPLOAD_DIR` (по умолчанию `./public/uploads`).

Каталоги `data`, `public/uploads` и `.next/cache` должны быть доступны на запись
пользователю, от которого работает сервис (на VPS обычно `www-data`).

Сброс к исходному контенту — кнопка внизу панели или просто удаление
`content.json`.

## Деплой на VPS

Боевая машина: `/var/www/garage`, systemd-юнит `garage`, nginx как reverse proxy
на `127.0.0.1:3000`. Домен — `гараж-омск.рф`.

Порядок: развернуть новый релиз в отдельный каталог, собрать его там и только
потом подменить рабочий — так простой сокращается до пары секунд.

```bash
rm -rf /var/www/garage-new && mkdir -p /var/www/garage-new
tar -xzf garage-src.tgz -C /var/www/garage-new
cp -a /var/www/garage/public       /var/www/garage-new/public
cp -a /var/www/garage/node_modules /var/www/garage-new/node_modules   # если зависимости не менялись
cp -a /var/www/garage/data         /var/www/garage-new/data           # правки из админки
printf 'NEXT_PUBLIC_SITE_URL=https://xn----7sbakrznpop.xn--p1ai\n' > /var/www/garage-new/.env.production
chown -R www-data:www-data /var/www/garage-new
cd /var/www/garage-new && sudo -u www-data env HOME=/var/www/garage-new npm run build

systemctl stop garage
mv /var/www/garage /var/www/garage-prev-$(date +%Y%m%d-%H%M%S)
mv /var/www/garage-new /var/www/garage
systemctl start garage
```

**Важно.** `NEXT_PUBLIC_SITE_URL` подставляется на этапе сборки, а не запуска.
Значения в systemd-юните для неё недостаточно: без `.env.production` (или без
переменной в окружении сборки) `robots.txt`, `sitemap.xml` и Open Graph уедут на
фолбэк `garage-omsk.example`. Перенос `data/` между релизами обязателен — иначе
правки из админки потеряются.

Каталог с предыдущим релизом остаётся на диске: откат — обратная подмена
каталогов и `systemctl restart garage`.

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
- `/admin` — панель управления (закрыта от индексации в robots.txt)
