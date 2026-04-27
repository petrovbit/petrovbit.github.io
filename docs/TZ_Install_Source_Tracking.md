# ТЕХНИЧЕСКОЕ ЗАДАНИЕ

## Трекинг источника установки и сегментация рекламного дохода по платформам

*Super Tank Big Map Game (io.battle_city.game)*

---

| Параметр | Значение |
|---|---|
| **Проект** | Super Tank Big Map Game |
| **Package ID** | io.battle_city.game |
| **Платформа** | Android |
| **Язык проекта** | Kotlin / Java (уточнить) |
| **Приоритет** | **Высокий** |

---

## 1. Цель задачи

Реализовать систему трекинга, которая автоматически определяет из какого магазина приложений было установлено приложение, передаёт эту информацию в аналитику и рекламные SDK, чтобы можно было видеть рекламный доход в разрезе каждой платформы дистрибуции.

### Ожидаемый результат

Дашборд в AppMetrica (и/или Firebase), где видно:

- RuStore — X показов рекламы — Y рублей дохода
- Google Play — X показов — Y рублей
- APKPure — X показов — Y рублей
- Huawei AppGallery — X показов — Y рублей
- Другие / unknown — X показов — Y рублей

---

## 2. Контекст проекта

Приложение дистрибутируется через несколько магазинов одновременно. Монетизация — реклама (баннеры, интерстишлы, rewarded video). Сейчас невозможно определить, какая платформа приносит больше дохода.

### Текущий стек

| Компонент | Значение |
|---|---|
| **Рекламная сеть** | Yandex RSY (активна) |
| **Планируется** | Google AdMob (медиация) |
| **Аналитика** | AppMetrica (Yandex) — основная; Firebase — опционально |
| **Магазины** | RuStore (лайв), Google Play (пендинг), APKPure, Huawei, Samsung, Amazon |

---

## 3. Что нужно сделать

### 3.1. Определение источника установки (InstallSourceDetector)

Создать утилитный класс, который определяет из какого магазина было установлено приложение.

**Логика:**

1. Вызвать `packageManager.getInstallerPackageName(packageName)` или `getInstallSourceInfo()` (API 30+)
2. Сопоставить результат с таблицей известных installer package names
3. Вернуть читаемое имя источника (String): `"rustore"`, `"google_play"`, `"apkpure"` и т.д.
4. Если источник не определён — вернуть `"unknown"`
5. Закешировать результат в SharedPreferences (installer source не меняется)

**Таблица маппинга installer → source name:**

| Installer Package Name | Source ID | Магазин |
|---|---|---|
| `com.android.vending` | google_play | Google Play |
| `ru.vk.store` | rustore | RuStore |
| `com.apkpure.aegon` | apkpure | APKPure |
| `com.huawei.appmarket` | huawei | Huawei AppGallery |
| `com.sec.android.app.samsungapps` | samsung | Samsung Galaxy Store |
| `com.amazon.venezia` | amazon | Amazon Appstore |
| `null / неизвестный` | unknown | Сайдлоад / другое |

> **Важно:** таблица должна быть легко расширяемой (`Map<String, String>`).

**Пример псевдокода (Kotlin):**

```kotlin
object InstallSourceDetector {
  private val STORE_MAP = mapOf(
    "com.android.vending" to "google_play",
    "ru.vk.store" to "rustore",
    // ... остальные магазины
  )

  fun detect(context: Context): String {
    val cached = prefs.getString(KEY, null)
    if (cached != null) return cached

    val installer = context.packageManager
      .getInstallerPackageName(context.packageName)
    val source = STORE_MAP[installer] ?: "unknown"
    prefs.edit().putString(KEY, source).apply()
    return source
  }
}
```

---

### 3.2. Передача в AppMetrica как user profile attribute

При первом запуске приложения передать install_source как кастомный атрибут пользователя.

- Создать кастомный атрибут `"install_source"` (String) в AppMetrica
- Передать значение через UserProfile API при инициализации
- Убедиться, что атрибут ставится **ДО** первого рекламного запроса

**Пример:**

```kotlin
val source = InstallSourceDetector.detect(context)

val userProfile = UserProfile.newBuilder()
  .apply(Attribute.customString("install_source")
    .withValue(source))
  .build()

AppMetrica.reportUserProfile(userProfile)
```

---

### 3.3. Передача в Firebase Analytics (опционально, для AdMob)

Если подключается AdMob медиация — передать install_source как user property.

- Установить user property `"install_source"` через `FirebaseAnalytics.setUserProperty()`
- Зарегистрировать свойство в Firebase Console → Custom Definitions
- Это позволит сегментировать `ad_impression` / `ad_click` по платформе

**Пример:**

```kotlin
FirebaseAnalytics.getInstance(context)
  .setUserProperty("install_source", source)
```

---

### 3.4. Отправка кастомных событий рекламы с параметром install_source

При каждом рекламном событии отправлять событие в аналитику с параметром install_source.

**События для трекинга:**

| Событие | Когда | Параметры |
|---|---|---|
| `ad_impression` | Показ рекламы | install_source, ad_type, ad_network |
| `ad_click` | Клик по рекламе | install_source, ad_type, ad_network |
| `ad_revenue` | Получен доход (callback) | install_source, revenue, currency, ad_network |

- **ad_type:** `"banner"`, `"interstitial"`, `"rewarded"`
- **ad_network:** `"yandex_rsy"`, `"admob"` (или конкретная сеть из медиации)

---

### 3.5. Интеграция в жизненный цикл приложения

Порядок вызовов в `Application.onCreate()`:

```
Application.onCreate():
  1. Инициализация AppMetrica SDK
  2. InstallSourceDetector.detect(this)
  3. Передаём install_source в AppMetrica UserProfile
  4. (Опц.) Передаём в Firebase user property
  5. Инициализация рекламных SDK (ПОСЛЕ пп. 3-4!)
```

> **⚠️ Критично:** install_source должен быть установлен **ДО** первого рекламного запроса, иначе первые показы не будут атрибутированы.

---

## 4. Структура файлов (ожидаемый результат)

```
app/src/main/java/.../
├── analytics/
│   ├── InstallSourceDetector.kt   ← НОВЫЙ
│   └── AdAnalytics.kt            ← НОВЫЙ
├── App.kt                        ← ИЗМЕНИТЬ (onCreate)
└── ads/ (существующие)            ← ИЗМЕНИТЬ (добавить трекинг)
```

---

## 5. Требования к реализации

| # | Требование | Приоритет |
|---|---|---|
| 1 | Определение источника один раз, результат кешируется в SharedPreferences | **Обязательно** |
| 2 | Не влиять на время запуска (синхронный, но мгновенный вызов) | **Обязательно** |
| 3 | Таблица маппинга легко расширяется (Map, не when/if) | **Обязательно** |
| 4 | Обработка null / неизвестных installer без крашей | **Обязательно** |
| 5 | Логирование определённого источника в debug-режиме | Желательно |
| 6 | `getInstallSourceInfo()` для API 30+ с фолбэком | Желательно |

---

## 6. Как проверить

### Тестирование через adb:

```bash
# Эмуляция установки из разных сторов:
adb install -i com.android.vending app.apk  # Google Play
adb install -i ru.vk.store app.apk          # RuStore
adb install app.apk                         # unknown
```

### Чек-лист:

- [ ] Источник определяется корректно в логах
- [ ] User profile attribute приходит в AppMetrica консоль
- [ ] ad_impression события содержат install_source
- [ ] Неизвестный installer → приходит как `"unknown"` (не краш)

---

## 7. Зависимости

Новых зависимостей не требуется. Используются только уже подключённые инструменты:

- Android PackageManager API (встроенный)
- AppMetrica SDK (уже подключен)
- Firebase Analytics SDK (опционально, при подключении AdMob)

---

## 8. Вне скоупа этой задачи

- Настройка AdMob медиации (отдельное ТЗ)
- Создание дашборда в AppMetrica / Firebase Console (настраивается вручную)
- UTM-метки, диплинки, атрибуция кампаний
- A/B тестирование рекламных форматов
