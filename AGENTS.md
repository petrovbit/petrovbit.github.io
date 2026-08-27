# AGENTS.md — petrovbit_website

Сайт студии **PetrovBit** (indie game studio, Mikhail Petrov). Единственная актуальная
директория сайта; **не путать** с соседней `../petrovma.github.io` — это legacy, не трогать.

## Факты

- **Домен:** `petrovbit.dev` (CNAME), хостинг — GitHub Pages
- **Репозиторий:** `petrovbit/petrovbit.github.io`, ветка `main`
- **Стек:** статический сайт; лендинг — React JSX прямо в браузере (без сборки)
- **Контент:** витрина игр — Tank 1990, Pixel Tanks, Swamp Defense (публичное имя
  `tower_defence`); RU/EN

## Что здесь актуально (в git)

| Путь | Роль |
|------|------|
| `index.html` | Живой лендинг — подключает `v2/*.jsx` |
| `v2/shared.jsx` | **Ядро контента**: `PB_CONTENT` (RU/EN тексты, ссылки на сторы), общие компоненты |
| `v2/quiet.jsx`, `v2/suggest.jsx` | Варианты/секции лендинга |
| `v2/shared.css` | Стили |
| `assets/` | Key-art игр (images), иконки сторов (`images/stores/*.svg`) + hero-видео Tank 1990 (video) |
| `privacy-policy.html` | Политика конфиденциальности (нужна для сторов) |
| `docs/index.html` | Публичная страница «Documentation» (legal-доки; внутренние ТЗ с сайта убраны намеренно) |
| `app-ads.txt` | **AdMob-верификация**: `pub-6853341444110473` — критично для рекламы в играх, не ломать |
| `CNAME` | Привязка домена `petrovbit.dev` — не удалять |

## Мусор (не в git, можно игнорировать)

`.idea/`, `.antigravitycli/` — артефакты IDE/инструментов.

## Ссылки на сторы

Единая точка правды — `v2/shared.jsx`: `PB_STORES` (список сторов + иконки) и
`PB_STORE_LINKS` (ссылки по играм). Компонент `StoreBadges` рисует ряд значков под каждой
игрой; стор без ссылки для этой игры показывается серым/пунктиром («планируется»).
Tank 1990 залит во все четыре: Google Play, RuStore, AppGallery, PalmStore.

**TODO:** ссылки Google Play / RuStore для Tank 1990 ведут на старый пакет
`io.battle_city.game`; обновить в `PB_STORE_LINKS.tank`, когда зальются APK с пакетами
`dev.petrovbit.*`.

## Связи с базой знаний

- Реестр приложений и листингов: `../../_knowledge/PORTFOLIO.md`
- Гайды по магазинам: `../../_knowledge/publishing/`
