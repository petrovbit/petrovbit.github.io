# ТЕХНИЧЕСКОЕ ЗАДАНИЕ

## GitHub Pages: сайт разработчика, app-ads.txt и документация проекта

*Super Tank Big Map Game (io.battle_city.game)*

---

| Параметр | Значение |
|---|---|
| **Проект** | Super Tank Big Map Game |
| **Package ID** | io.battle_city.game |
| **Репозиторий** | github.com/petrovMA (основной аккаунт) |
| **Текущий Privacy Policy** | github.com/petrovMA/game_policy_1 |
| **Приоритет** | Высокий (блокирует верификацию AdMob) |

---

## 1. Цель задачи

Создать структуру GitHub Pages сайта разработчика (`petrovma.github.io`), который решает три задачи:

1. **Верификация AdMob** — файл `app-ads.txt` в корне домена для прохождения проверки
2. **Сайт разработчика** — презентабельная лендинг-страница для Google Play Store Listing
3. **Документация проекта** — внутренняя документация (ТЗ, walkthrough) доступна из отдельной поддиректории, со ссылкой с основного сайта

---

## 2. Контекст

### Проблема

- AdMob не может верифицировать приложение — нет URL сайта разработчика в Google Play
- Без `app-ads.txt` рекламодатели не покупают инвентарь → доход ниже на 20-40%
- Privacy Policy сейчас в отдельном репозитории `game_policy_1` — нужно консолидировать
- Внутренняя документация (ТЗ, walkthrough) лежит в `docs/` проекта, но не структурирована

### Целевая структура доменов

| URL | Что отдаёт |
|---|---|
| `petrovma.github.io` | Лендинг-страница (сайт разработчика) |
| `petrovma.github.io/app-ads.txt` | Файл верификации AdMob |
| `petrovma.github.io/privacy-policy.html` | Privacy Policy |
| `petrovma.github.io/docs/` | Индекс внутренней документации проекта |
| `petrovma.github.io/docs/TZ_*.md` | Конкретные ТЗ |

---

## 3. Что нужно сделать

### 3.1. Создать репозиторий `petrovma.github.io`

Создать новый публичный репозиторий на GitHub с именем **точно** `petrovma.github.io`. GitHub автоматически включит GitHub Pages для репозитория с таким именем.

---

### 3.2. Структура файлов в репозитории

```
petrovma.github.io/
├── index.html                  ← Лендинг-страница (сайт разработчика)
├── app-ads.txt                 ← Верификация AdMob
├── privacy-policy.html         ← Privacy Policy (перенести из game_policy_1)
├── assets/
│   ├── style.css               ← Стили для лендинга
│   ├── favicon.ico             ← Иконка вкладки (опционально)
│   └── images/
│       ├── hero-screenshot.png ← Скриншот игры для лендинга (placeholder)
│       ├── icon-classic.png    ← Иконка режима Classic (placeholder)
│       ├── icon-bigmap.png     ← Иконка режима Big Map (placeholder)
│       └── icon-multi.png      ← Иконка режима Multiplayer (placeholder)
└── docs/
    ├── index.html              ← Индекс документации (список всех ТЗ)
    ├── TZ_Install_Source_Tracking.md
    ├── TZ_Extended_Analytics.md
    └── ... (будущие ТЗ)
```

---

### 3.3. Файл `app-ads.txt`

Содержимое — одна строка:

```
google.com, pub-6853341444110473, DIRECT, f08c47fec0942fa0
```

> **Важно:** файл должен быть plain text (UTF-8, без BOM), без HTML-обёрток, доступен по `https://petrovma.github.io/app-ads.txt`.

---

### 3.4. Лендинг-страница `index.html`

Презентабельная одностраничная страница сайта разработчика. Должна выглядеть профессионально, но лаконично — это инди-студия, не корпорация.

#### Структура страницы (сверху вниз):

**Hero-секция:**
- Название: "Tank 1990: Battle City — Big Map Edition"
- Подзаголовок: "Classic retro tank arcade game with expanded maps and multiplayer"
- Кнопки: Google Play (ссылка: `https://play.google.com/store/apps/details?id=io.battle_city.game`), RuStore (ссылка: `https://apps.rustore.ru/app/io.battle_city.game`)
- Скриншот игры (placeholder изображение, заменится позже)

**Секция "Game Modes" (3 карточки):**
- Classic — Original 35 levels from Battle City, NES nostalgia
- Big Map — Expanded battlefield, new challenges
- Multiplayer — Play with friends on the same device

**Секция "Features" (краткий список):**
- Retro 8-bit pixel art style
- Gamepad support
- Offline play — no internet required
- Rewarded ads only — no forced interruptions

**Footer:**
- "Developed by Mikhail Petrov"
- Ссылки: Privacy Policy (`/privacy-policy.html`), Contact (`mailto:petrovma92@gmail.com`), Documentation (`/docs/`)
- Год: 2025–2026

#### Требования к дизайну:

- **Один HTML файл + один CSS файл** (без JS-фреймворков)
- Тёмная тема (подходит для ретро-игры) — тёмный фон (#1a1a2e или подобный), яркие акценты
- Ретро-пиксельный стиль оформления (можно использовать Google Font "Press Start 2P" для заголовков)
- Responsive — корректно выглядит на мобильных
- Минималистично, быстро загружается
- Изображения: подготовить placeholder-блоки с указанием размеров, чтобы потом заменить на реальные скриншоты
- Язык страницы: **английский** (глобальная аудитория)

---

### 3.5. Privacy Policy (`privacy-policy.html`)

Перенести содержимое Privacy Policy из репозитория `game_policy_1` в HTML-страницу.

**Исправления при переносе:**
- Заменить пустое `__________` в названии компании на "Mikhail Petrov"
- Оставить один email: `petrovma92@gmail.com` (убрать `gnation29test@gmail.com`)
- Проверить актуальность адреса
- Оформить в том же стиле (тёмная тема), что и лендинг
- Добавить ссылку "← Back to home" наверху

---

### 3.6. Документация (`docs/`)

#### `docs/index.html`

Простая страница-индекс со списком всех документов проекта. Та же тёмная тема.

**Содержимое:**

- Заголовок: "Project Documentation — Tank 1990"
- Список документов (ссылки на .md файлы, GitHub Pages отрендерит их через Jekyll):
  - TZ: Install Source Tracking
  - TZ: Extended Analytics
  - (будущие документы добавляются сюда)
- Ссылка "← Back to home"

> **Примечание:** .md файлы в GitHub Pages рендерятся через Jekyll автоматически. Если Jekyll не включён или не нужен — можно конвертировать в .html.

#### Документы для переноса в `docs/`:

Скопировать из проекта (директория `docs/`) следующие файлы:
- `TZ_Install_Source_Tracking.md`
- `TZ_Extended_Analytics.md`
- Любые другие существующие ТЗ и walkthrough из `docs/`

---

## 4. Требования к реализации

| # | Требование | Приоритет |
|---|---|---|
| 1 | `app-ads.txt` доступен по `petrovma.github.io/app-ads.txt` (plain text) | **Обязательно** |
| 2 | `index.html` загружается быстро, выглядит профессионально | **Обязательно** |
| 3 | Responsive дизайн (мобильный + десктоп) | **Обязательно** |
| 4 | Privacy Policy перенесена и исправлена | **Обязательно** |
| 5 | Документация доступна по `/docs/` со ссылкой с лендинга | **Обязательно** |
| 6 | Тёмная ретро-тема, шрифт "Press Start 2P" для заголовков | Желательно |
| 7 | Placeholder-блоки для изображений с указанием размеров | Желательно |
| 8 | Favicon | Желательно |

---

## 5. Как проверить

1. Запушить репозиторий на GitHub
2. Подождать 1-2 минуты, зайти на `https://petrovma.github.io` — должна открыться лендинг-страница
3. Проверить `https://petrovma.github.io/app-ads.txt` — должен вернуть plain text с одной строкой
4. Проверить `https://petrovma.github.io/privacy-policy.html` — должна открыться Privacy Policy
5. Проверить `https://petrovma.github.io/docs/` — должен открыться индекс документации
6. Проверить responsive на мобильном (Chrome DevTools → Toggle Device Toolbar)
7. В Google Play Console → Store Listing → Developer Website → вписать `https://petrovma.github.io`
8. В AdMob → Проверить изменения → подождать до 24 часов → статус должен стать "Verified"

---

## 6. После выполнения (ручные шаги, вне скоупа кодинга)

- Обновить Developer Website в Google Play Console на `https://petrovma.github.io`
- Обновить Privacy Policy URL в Google Play Console на `https://petrovma.github.io/privacy-policy.html`
- Обновить Privacy Policy URL в RuStore и APKPure на тот же адрес
- Нажать "Проверить изменения" в AdMob
- Заменить placeholder-изображения на реальные скриншоты игры
