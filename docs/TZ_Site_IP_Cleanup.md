# ТЗ: Очистка сайта petrovbit.dev от рисков по авторским правам и репозиционирование

## Контекст

`petrovbit.dev` — это сайт **гейм-дев студии PetrovBit** (владелец — Mikhail Petrov). Студия выпускает мобильные ретро-игры. Сейчас на сайте опубликована одна игра — мобильная игра в жанре танковой аркады.

**Текущая проблема:**

1. **Концептуальная:** сайт студии оформлен как лендинг одной конкретной игры. Заголовки, title, privacy policy — всё называет сайт по имени игры, а не по имени студии. Это смешивает бренд студии с конкретным продуктом.

2. **Юридическая:** на сайте многократно встречается фраза **"Battle City"** — это зарегистрированный товарный знак компании **Bandai Namco** (правопреемник Namco, которая выпустила оригинальную Battle City в 1985 году). Прямое использование чужого товарного знака на сайте разработчика создаёт риски:
   - Сайт может быть использован Bandai Namco как доказательство умышленного нарушения IP при подаче DMCA-жалобы в Google Play
   - Privacy Policy с указанием "Tank 1990: Battle City" — это юридический документ, официально привязывающий разработчика к чужому товарному знаку
   - Описание режима игры со словами "inspired by Battle City" — задокументированное признание производности от бренда Namco
   - В июне 2025 года игра-аналог "Tank 1990 - Battle City" от Bravestars Publishing была удалена из Google Play при 3.6M загрузок именно по этим основаниям

**Цель этого ТЗ:** превратить сайт из "лендинга игры с упоминаниями Battle City" в **сайт студии PetrovBit**, где конкретная игра присутствует как один из проектов, описана нейтрально, без упоминаний чужих товарных знаков.

---

## Технические данные

- **Домен:** petrovbit.dev
- **Хостинг:** GitHub Pages (вероятно — нужно подтвердить через CNAME файл или git remote)
- **Репозиторий:** скорее всего `github.com/petrovMA/petrovbit.dev` или аналогичный (нужно найти через git remote)
- **Стек:** статический HTML/CSS, возможно Jekyll (проверить наличие `_config.yml`, `_layouts/`, `_includes/`)
- **Существующие страницы:**
  - `/` (index.html)
  - `/privacy-policy.html`
  - `/docs/` (index.html)
  - `/docs/TZ_Install_Source_Tracking.md`
  - `/docs/TZ_Extended_Analytics.md`
  - `/docs/TZ_GitHub_Pages_Developer_Site.md`
- **Ассеты:**
  - `/assets/images/screen-gameplay.png`
  - `/assets/images/icon-classic.png`
  - `/assets/images/icon-bigmap.png`

---

## Задача 1: Полный аудит репозитория на упоминания "Battle City" и связанных терминов

### Что искать

В **каждом файле** репозитория (включая скрытые) найти упоминания следующих терминов:

**Критические термины (обязательно убрать):**
- `Battle City` (в любом регистре)
- `BattleCity`
- `battle_city` (если встречается вне `package_id` приложения — package id в URL Google Play менять нельзя, но из текстов можно убрать)
- `battle-city`

**Терминам средней важности (желательно переформулировать):**
- `Tank 1990` (само по себе менее опасно — это народное название из СНГ, не зарегистрированный TM, но в сочетании с другими элементами усиливает риск)
- `NES` (товарный знак Nintendo)
- `Famicom` (товарный знак Nintendo)
- `Nintendo`
- `Namco`
- `Bandai Namco`
- `Junko Ozawa` (композитор оригинала)

**Что проверить отдельно:**
- EXIF-метаданные в изображениях (`/assets/images/*.png`) — могут содержать названия в полях Title/Description/Keywords
- Имя репозитория и описание на GitHub
- Файлы `.git/config`, `.git/description`
- Файлы `package.json`, `package-lock.json`, `composer.json`, `Gemfile` если есть
- `_config.yml` (Jekyll конфиг)
- `README.md`, `LICENSE`
- `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`
- Любые `.md` файлы в `/docs/`
- Все HTML файлы — включая `<meta>` теги (description, keywords, og:*, twitter:*), `<title>`, `alt` атрибуты изображений

### Что вернуть в отчёте

Структурированный список:
```
Файл: <path>
  Строка <N>: <текущее содержимое>
  Категория: [критическая / средняя / низкая]
  Предлагаемая замена: <новый текст>
```

---

## Задача 2: Репозиционирование главной страницы — из лендинга игры в сайт студии

### Текущее состояние (изучить и подтвердить)

Сейчас `index.html` имеет структуру:
- `<title>Tank 1990: Battle City — Big Map Edition</title>`
- H1: "Tank 1990: Battle City Big Map Edition"
- Подзаголовок: "Classic retro tank arcade game with expanded maps and multiplayer"
- Кнопки: Google Play, RuStore
- Секция "Game Modes" с описанием режимов
- Секция "Features"

### Что должно стать

Структура **сайта студии PetrovBit**:

```
Hero-секция (студия):
  Title (HTML <title>): PetrovBit — Indie Game Studio
  H1: PetrovBit
  Подзаголовок: Indie game studio crafting retro-inspired arcade games for mobile
  (опционально: маленький логотип/эмблема студии — placeholder если нет)

About-секция:
  Краткое описание студии (2-3 предложения):
  "We design pixel-art games that blend classic 8-bit aesthetics with modern
  mobile conveniences. Our focus: simple to start, deep to master, fun to
  return to."

Our Games-секция:
  Заголовок: Our Games
  Карточка игры (одна, пока что):
    - Название игры (использовать ТЕКУЩЕЕ название из Google Play, без
      добавлений "Battle City" из лендинга. Если в Play Store сейчас
      "Tank 1990: Battle City Big Map" — оставить так, потому что
      название на витрине Play Store будет меняться отдельно. На сайте
      студии писать ровно то, что сейчас в магазине)
    - Краткое описание (1-2 предложения, нейтрально, БЕЗ упоминания
      "Battle City" в качестве источника вдохновения):
      "A retro-style 8-bit tank arcade with expanded battlefields,
      multiple game modes, and offline play."
    - Изображение (текущее screen-gameplay.png — оставить если оно НЕ
      содержит UI оригинальной Battle City от Namco; иначе заменить на
      placeholder с пометкой "Screenshot coming soon")
    - Кнопки: Google Play, RuStore (ссылки сохранить)

Features-секция (если оставлять — переформулировать как студийные принципы):
  Заголовок: What We Build
  - Pixel art aesthetics
  - Offline-first design
  - Gamepad and touch support
  - Rewarded ads only — no forced interruptions

Footer:
  - Privacy Policy (ссылка)
  - Contact: petrovma92@gmail.com
  - Documentation (ссылка на /docs/)
  - "© 2025–2026 PetrovBit. Independent game studio."
```

### Что УДАЛИТЬ из текущего index.html

1. **Полностью убрать секцию "Game Modes"** в текущем виде. Особенно текст:
   - "Dozens of huge campaign maps inspired by **Battle City** classic. Retro vibes, epic scale." — содержит упоминание Battle City
   - Карточки "Classic", "Big Map", "Multiplayer" — это детали конкретной игры, которые на сайте студии не нужны
2. Любые упоминания "Battle City" в alt-атрибутах изображений
3. Любые упоминания "Battle City" в meta-тегах (description, keywords, og:title, og:description, twitter:title, twitter:description)

### SEO-метаданные для новой главной

```html
<title>PetrovBit — Indie Game Studio</title>
<meta name="description" content="PetrovBit is an indie game studio crafting retro-inspired pixel-art arcade games for mobile. Offline-first, pixel-perfect, gamepad-ready.">
<meta property="og:title" content="PetrovBit — Indie Game Studio">
<meta property="og:description" content="Retro-inspired pixel-art arcade games for mobile.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://petrovbit.dev/">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="PetrovBit — Indie Game Studio">
<meta name="twitter:description" content="Retro-inspired pixel-art arcade games for mobile.">
```

---

## Задача 3: Переписать Privacy Policy

### Текущее состояние

Сейчас `privacy-policy.html`:
- Title: "Privacy Policy — Tank 1990: Battle City"
- В тексте: "the mobile application **Tank 1990: Battle City — Big Map Edition** (package: `io.battle_city.game`)"
- Multiple references to specific game name

### Что должно стать

Привести Privacy Policy к **студийному формату**, описывающему правила для всех приложений PetrovBit. Конкретные имена игр упоминать минимально и нейтрально.

### Конкретные изменения

1. **Title и H1:**
   - Было: `Privacy Policy — Tank 1990: Battle City`
   - Стало: `Privacy Policy — PetrovBit`

2. **Раздел "1. Introduction":**
   - Было: *"Mikhail Petrov ("we", "our", or "us") operates the mobile application **Tank 1990: Battle City — Big Map Edition** (package: `io.battle_city.game`). This Privacy Policy explains how we collect, use, and protect information when you use our application."*
   - Стало:
     ```
     Mikhail Petrov, operating under the brand PetrovBit ("we", "our", or
     "us"), develops mobile games and applications. This Privacy Policy
     explains how we collect, use, and protect information when you use
     applications published by PetrovBit on Google Play, RuStore, and
     other distribution platforms.

     This policy applies to all current and future PetrovBit applications
     unless a specific application provides its own privacy policy that
     supersedes this one.
     ```

3. **Все остальные упоминания** конкретного названия игры — убрать или заменить на нейтральные:
   - "this game" → "our applications" / "the application"
   - "Tank 1990: Battle City" → удалить упоминание полностью
   - Package ID `io.battle_city.game` — **не упоминать в privacy policy студии**. Если для конкретного приложения нужен package ID в политике — это должна быть отдельная privacy policy на отдельной странице

4. **В разделе Contact** в конце:
   - Было: только email
   - Стало:
     ```
     - Brand: PetrovBit
     - Developer: Mikhail Petrov
     - Email: petrovma92@gmail.com
     - Website: https://petrovbit.dev
     ```

### SEO-метаданные

```html
<title>Privacy Policy — PetrovBit</title>
<meta name="description" content="Privacy Policy for PetrovBit games and applications.">
<meta name="robots" content="noindex, follow">  <!-- privacy policy не должна индексироваться отдельно от сайта -->
```

---

## Задача 4: Обновить documentation page

### Текущее состояние

`/docs/index.html`:
- Title: "Project Documentation — Tank 1990"
- H1: "Project Documentation"
- Подзаголовок: "Technical specifications and design documents for Tank 1990: Battle City."
- Список ссылок на TZ файлы

### Что должно стать

```html
<title>Documentation — PetrovBit</title>
H1: PetrovBit Documentation
Подзаголовок: Technical specifications, design documents, and development notes.
```

Из подзаголовка убрать упоминание "Tank 1990: Battle City". Список ссылок на документы оставить как есть (имена файлов нейтральные).

### Внутри .md файлов документации

Проверить содержимое файлов:
- `TZ_Install_Source_Tracking.md`
- `TZ_Extended_Analytics.md`
- `TZ_GitHub_Pages_Developer_Site.md`

Если в этих файлах есть упоминания "Battle City" — заменить на нейтральные ("the game", "the application", "PetrovBit's tank arcade game"). НЕ убирать технические детали (package_id `io.battle_city.game` оставить, потому что это реальный технический идентификатор приложения, и в технической документации он нужен).

**Важное различие:**
- В пользовательских документах (Privacy Policy, лендинг) — НЕ упоминать `io.battle_city.game`
- В технической документации (TZ файлы) — упоминать можно, потому что это рабочий технический реквизит

---

## Задача 5: Проверить и очистить ассеты

### Изображения

Для каждого файла в `/assets/images/`:

1. **Проверить EXIF/PNG метаданные** через `exiftool` или аналог:
   ```bash
   exiftool /assets/images/screen-gameplay.png
   exiftool /assets/images/icon-classic.png
   exiftool /assets/images/icon-bigmap.png
   ```
   Если в полях `Title`, `Description`, `Keywords`, `Comment`, `XMP-dc:Title`, `XMP-dc:Description` — есть упоминания "Battle City", "Tank 1990", "Namco" — **очистить метаданные**:
   ```bash
   exiftool -all= /assets/images/screen-gameplay.png
   ```

2. **Визуально проверить содержимое** скриншота `screen-gameplay.png`:
   - Если на скриншоте виден стартовый экран оригинальной Battle City от Namco (надпись "BATTLE CITY", характерное меню "1 PLAYER / 2 PLAYERS / CONSTRUCTION", шрифт Namco) — **флагнуть для замены пользователем**, НЕ публиковать
   - Если на скриншоте только геймплей (танки, стены, базы) с пиксельной графикой — это допустимо для текущего этапа, но в отчёте отметить "требуется замена при обновлении игровых ассетов"

3. **alt-атрибуты** изображений в HTML:
   - Было: `alt="Tank 1990 gameplay screenshot"`
   - Стало: `alt="PetrovBit game screenshot"` или `alt="Retro tank arcade gameplay"`

### Иконки режимов (icon-classic.png, icon-bigmap.png)

Поскольку секция "Game Modes" удаляется с главной — эти иконки больше не нужны на сайте. Можно:
- Удалить файлы из репозитория
- Или оставить в `/assets/images/` для возможного использования в будущем (но не ссылаться с главной)

---

## Задача 6: Скрытые файлы и git-метаданные

### `.git/config`

Проверить и при необходимости — сообщить пользователю, что нужно вручную:
- Переименовать репозиторий на GitHub если он называется `battle-city-website` или похоже. Целевое имя: `petrovbit.dev` или `petrovbit-website`
- Обновить description репозитория на GitHub: убрать упоминания "Battle City", написать "PetrovBit indie game studio website"

### `package.json` (если есть)

```json
{
  "name": "petrovbit-dev",
  "description": "PetrovBit — indie game studio website",
  ...
}
```

Заменить любые упоминания "battle_city", "battle-city", "tank-1990" в полях `name`, `description`, `keywords`, `repository.url`.

### `_config.yml` (Jekyll, если есть)

```yaml
title: PetrovBit
description: Indie game studio crafting retro-inspired arcade games for mobile
url: https://petrovbit.dev
```

Заменить любые упоминания игры на студийные.

### `README.md`

Если в репозитории есть README, переписать в формате:
```markdown
# PetrovBit Website

Source code for [petrovbit.dev](https://petrovbit.dev) — the official
website of PetrovBit, an indie game studio.

## Stack

- Static HTML/CSS
- Hosted on GitHub Pages

## Local Development

[инструкции если есть]
```

### `CNAME`

Должен содержать только: `petrovbit.dev`. Не трогать если уже корректный.

### `robots.txt` и `sitemap.xml`

Если есть — обновить URL и убрать упоминания "Battle City".

---

## Задача 7: Создать `app-ads.txt` и подтвердить домен

### Контекст

Если на сайте используется AdMob (упомянут в Privacy Policy), Google требует наличия файла `app-ads.txt` на домене разработчика. Это критично для монетизации мобильного приложения.

### Что сделать

1. **Проверить наличие файла** `https://petrovbit.dev/app-ads.txt`
2. Если файла **нет** — создать в корне репозитория с содержимым (точные данные нужно взять из настроек AdMob аккаунта пользователя):
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
   Поле `pub-XXXXXXXXXXXXXXXX` — Publisher ID из AdMob. Если у агента нет доступа к этому значению, **флагнуть для пользователя** с просьбой предоставить.

3. **Не добавлять Yandex Mobile Ads** в `app-ads.txt` — это делается в отдельном файле или через консоль Yandex.

4. Файл должен быть **plain text, UTF-8, без BOM**, без HTML-обёрток.

---

## Задача 8: Финальная валидация

После всех изменений выполнить проверку:

### Поиск по всему репозиторию

```bash
grep -ri "battle.city\|battlecity\|battle_city" . --exclude-dir=.git
grep -ri "namco\|bandai\|junko ozawa" . --exclude-dir=.git
grep -ri "nintendo\|famicom" . --exclude-dir=.git --include="*.html" --include="*.md" --include="*.yml" --include="*.json"
```

**Ожидаемый результат:** ноль совпадений за исключением:
- `io.battle_city.game` в технической документации в `/docs/TZ_*.md` (можно оставить как технический идентификатор)
- Возможно, `io.battle_city.game` в ссылках на Google Play / RuStore (это URL приложения, **необходим**, не убирать)

### Проверка title всех страниц

```bash
grep -l "<title>" . -r --include="*.html" | xargs grep "<title>"
```

Все title должны соответствовать новому брендингу:
- `index.html` → `PetrovBit — Indie Game Studio`
- `privacy-policy.html` → `Privacy Policy — PetrovBit`
- `docs/index.html` → `Documentation — PetrovBit`

### Live-проверка через curl

После деплоя на GitHub Pages:
```bash
curl -s https://petrovbit.dev/ | grep -i "battle.city" || echo "✓ Main page clean"
curl -s https://petrovbit.dev/privacy-policy.html | grep -i "battle.city" || echo "✓ Privacy clean"
curl -s https://petrovbit.dev/docs/ | grep -i "battle.city" || echo "✓ Docs clean"
curl -s https://petrovbit.dev/app-ads.txt
```

---

## Что НЕ делать (важные ограничения)

1. **НЕ менять package_id** `io.battle_city.game` в ссылках на Google Play и RuStore. Это технический идентификатор приложения, его нельзя поменять без перепубликации игры. На уровне сайта мы его оставляем в URL ссылок.

2. **НЕ удалять страницу Privacy Policy полностью** — она требуется для AdMob и для размещения в Google Play Console. Только переписать содержимое в студийный формат.

3. **НЕ менять домен** — оставить `petrovbit.dev`. Все изменения только на уровне контента.

4. **НЕ удалять текущую игру с сайта** — оставить карточку в секции "Our Games", только убрать прямые упоминания "Battle City" и переформулировать описание.

5. **НЕ переписывать имена файлов** в `/docs/` (TZ_Install_Source_Tracking.md и т.п.) — только их содержимое при необходимости.

6. **НЕ кэшировать изменения слишком агрессивно** — если в HTML есть `<meta http-equiv="cache-control">` теги, оставить разумные значения (max-age 1-2 часа), чтобы изменения быстро доходили до пользователей.

---

## Финальный deliverable

После выполнения задач 1-8, агент должен предоставить:

1. **Pull request / коммит** со всеми изменениями
2. **Отчёт по задаче 1** — список всех найденных и заменённых упоминаний с указанием файла и строки
3. **Скриншот / preview** обновлённой главной страницы (как она будет выглядеть)
4. **Список флагов** для пользователя — что требует ручного действия:
   - Подтвердить новое описание студии в About-секции
   - Предоставить Publisher ID из AdMob для app-ads.txt
   - Подтвердить, что текущий screenshot игры допустим, или загрузить новый
   - Возможно, переименовать репозиторий и обновить description на GitHub (это нельзя сделать через код)
5. **Финальный grep-отчёт** показывающий, что упоминания "Battle City", "Namco", "Bandai" вычищены везде, кроме допустимых технических идентификаторов

---

## Приоритет задач

1. **🔴 Критично (сделать первым):**
   - Задача 1 (полный аудит)
   - Задача 2 (главная страница)
   - Задача 3 (Privacy Policy)

2. **🟡 Важно (сделать вторым):**
   - Задача 4 (documentation)
   - Задача 5 (ассеты — особенно EXIF метаданные)

3. **🟢 Желательно (сделать в любой момент):**
   - Задача 6 (скрытые файлы)
   - Задача 7 (app-ads.txt — если ещё нет)
   - Задача 8 (финальная валидация)
