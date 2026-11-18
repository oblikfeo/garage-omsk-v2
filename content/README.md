# Контент SEO-страниц гараж-омск.рф

Здесь лежат все страницы, кроме главной, её админки и посадочных Директа.
**Один файл = одна страница.** Новый файл → после сборки появляется новая страница,
запись в sitemap (если `index: true`), пункт в меню «Услуги» и карточки в хабах. Код править не нужно.

Главную (`/`), админку (`/admin`) и посадочные Директа (`/zamena-masla`, `/maslo-korobka`, `/tormoza`,
`/podveska`, `/shinomontazh`, `/dvigatel-transmissiya`, `/arenda-garazha`) отсюда **не трогаем**.

## Как добавить страницу

1. Скопируйте `_example.md` из нужной папки, назовите файл как slug: `services/zamena-sajlentblokov.md`.
2. Заполните поля. Текст страницы (`seo_text`) — это тело файла под шапкой `---`, в Markdown.
3. Проверьте сборкой (команда ниже). Если что-то не так, сборка остановится и напишет файл и причину.
4. Закоммитьте файл.

Файлы, имя которых начинается с `_`, — образцы, страницами не становятся.

## Сборка

```bash
cd website
npm ci          # один раз или после изменения package.json
npm run build   # проверка контента + сборка
```

Сборка падает с понятной ошибкой, если: нет `slug` или `h1`; slug не латиница/цифры/дефисы;
slug уже занят другим файлом, посадочной Директа или разделом (`uslugi`, `ceny`, `kontakty`,
`svoimi-rukami`, `admin`, `politika-konfidentsialnosti`); ссылка в `related`, `services`, `service`,
`equipment`, `author` или фото ведёт на то, чего нет. Пустые `title` и `description` не ошибка:
подставится автошаблон из `site.json`, сборка только предупредит.

## Папки и адреса

| Шаблон | Адрес | Папка |
| --- | --- | --- |
| Геостраница | `/{slug}` | `geo/` |
| Текстовая страница | `/{slug}` | `text/` |
| Хаб услуг | `/uslugi` | `pages/uslugi.md` |
| Услуга | `/uslugi/{slug}` | `services/` |
| Цены | `/ceny` | `pages/ceny.md` |
| Контакты | `/kontakty` | `pages/kontakty.md` |
| Хаб статей | `/svoimi-rukami`, `/svoimi-rukami/page/{n}` | `pages/svoimi-rukami.md` |
| Статья | `/svoimi-rukami/{slug}` | `articles/` |

Адреса: латиница, строчные, дефисы, без слеша в конце. Геостраницы и текстовые страницы делят корень сайта — slug не должен повторяться между `geo/` и `text/`.

## Поля, общие для всех страниц

| Поле | Обяз. | Что это |
| --- | --- | --- |
| `slug` | да | Адрес страницы, совпадает с именем файла |
| `h1` | да | Заголовок страницы, один на странице |
| `title` | | `<title>`; пусто → автошаблон типа из `site.json` |
| `description` | | meta description; пусто → автошаблон |
| `index` | | `true` (по умолчанию) — индексировать; `false` — `noindex` и нет в sitemap |
| `canonical` | | Свой canonical; по умолчанию — адрес страницы без GET-параметров |
| `og_image` | | id фото из `photos.json` для соцсетей; по умолчанию — фото бокса |
| `updated_at` | | Дата изменения `ГГГГ-ММ-ДД` → `lastmod` в sitemap и заголовок `Last-Modified` |
| `faq` | | Список `{q, a}` — аккордеон и разметка FAQPage (текст слово в слово) |
| тело файла | | `seo_text`: Markdown — H2/H3, списки, таблицы, картинки, ссылки. Выводится целиком |

Хабы, цены, контакты и текстовые страницы дополнительно берут `intro` (Markdown, многострочно через `intro: |`).

## Геостраница (`geo/`)

`subtitle` — подзаголовок первого экрана; `hero_photo` — id фото; `benefits` — `[{icon, title, text}]`,
иконки: `clock`, `timer`, `wrench`, `shield`, `car`, `oil`, `calendar`, `gauge`, `box`;
`comparison` — `{left: {title, price, text}, right: {…}}`; `equipment` — id из `equipment.json`;
`services` — slug услуг из `services/` (карточки); `photo_tag` — тег фото из `photos.json`;
`banner` — `{title, text}`; `blocks` — порядок и видимость блоков (по умолчанию все):
`benefits, comparison, equipment, prices, services, banner, photos, reviews, faq, seo_text, how_to_get`.
Первый экран (H1, подзаголовок, цены поста и подъёмника из `site.json`, фото, «Записаться», «Позвонить») есть всегда.

## Услуга (`services/`)

| Поле | Что это |
| --- | --- |
| `name` (обяз.) | Короткое название: «Замена масла в двигателе» — в меню, карточках, `{name}` |
| `category` | Группа в хабе услуг и фильтре статей |
| `hours_self` (обяз.) | `[min, max]` часов самому |
| `hours_master` | `[min, max]` часов с мастером; нет поля — нет цены «с мастером» |
| `station` (обяз.) | `post`, `lift` или `machine` — какая ставка из `site.json` |
| `complexity` | 1, 2 или 3 |
| `market_price`, `market_checked_at` | Цена в автосервисе и дата проверки; нет — колонка скрыта |
| `equipment`, `bring`, `limitations` | Что есть у нас (id), что взять, ограничения |
| `steps` | `[{title, text}]`; `video` — ссылка YouTube / Rutube / VK Видео |
| `related` | slug других услуг; `photo_tag`, `hero_photo`; `blocks` — порядок блоков: |

`price_compare, what_to_bring, conditions, steps, photos, faq, articles, related, seo_text, how_to_get`.

**Цены считаются сами:** «сами от» = `hours_self.min × rates[station]`;
«с мастером от» = `hours_master.min × (rates[station] + rates.master)` при `master_mode: on_top`
или `hours_master.min × rates.master` при `master_mode: instead`. Меняете ставку в `site.json` —
меняются все цены на сайте и в разметке.

## Статья (`articles/`)

`author` — id из `authors.json`; `published_at`; `service` — slug услуги (из неё полный CTA с ценами
и категория для фильтра); `complexity`, `time`, `tools: []`, `video`, `cover` (id фото);
`steps: [{title, text, photo}]`; `related` — slug статей (иначе «По теме» — 3 статьи той же услуги).
Оглавление строится из H2 в теле статьи.

## Справочники

- `site.json` — адрес, координаты, телефон, режим, мессенджеры, карты, реквизиты, ставки `rates`,
  `master_mode`, прайс `price_list`, ссылка записи YCLIENTS, виджет отзывов, ссылки подвала, автошаблоны
  `templates` (подстановки `{h1}`, `{name}`, `{price_self}`, `{price_post}`).
- `photos.json` — фото: `id`, `src` (файл в `public/`), `alt`, `caption`, `tags`.
- `authors.json` — авторы статей. `equipment.json` — оборудование (`available: false` — «нет»).
- `redirects.json` — ручные 301: `{"from": "/old", "to": "/new"}`.
