# ТЕХНИЧЕСКОЕ ЗАДАНИЕ

## Расширенная аналитика: игровые события, rewarded реклама и крэш-трекинг

*Super Tank Big Map Game (io.battle_city.game)*

---

| Параметр | Значение |
|---|---|
| **Проект** | Super Tank Big Map Game |
| **Package ID** | io.battle_city.game |
| **Платформа** | Android |
| **Аналитика** | AppMetrica SDK (уже интегрирован) |
| **Зависимость** | Требует завершённой задачи "Install Source Tracking" (InstallSourceDetector, AdAnalytics) |
| **Приоритет** | Высокий |

---

## 1. Цель задачи

Расширить аналитику приложения, чтобы в AppMetrica можно было видеть:

- Крэши и ошибки с полным контекстом (на каком уровне, в каком режиме)
- Сколько раз каждый пользователь смотрит rewarded рекламу, в каком режиме и на каком уровне
- Какие режимы и уровни самые популярные
- Сколько времени пользователи проводят в игре и в каждом режиме

---

## 2. Контекст

### Игровые режимы

В игре три режима. Все события аналитики должны содержать параметр `game_mode` с одним из этих значений:

| game_mode | Описание |
|---|---|
| `classic` | Классический режим (оригинальные уровни Battle City) |
| `bigmap` | Big Map — расширенная карта |
| `multiplayer` | Мультиплеер |

### Уже реализовано

- AppMetrica SDK инициализирован в `App.java`
- `InstallSourceDetector` — определяет источник установки
- `AdAnalytics` — отправляет события рекламы с параметром `install_source`
- Крэши ловятся AppMetrica SDK автоматически (но без игрового контекста)

---

## 3. Что нужно сделать

### 3.1. Крэш-контекст через Environment (Приоритет 1)

AppMetrica уже автоматически ловит крэши. Но по умолчанию в крэш-репорте нет информации о том, что пользователь делал в момент краша. Нужно добавить контекст.

**Подход:** использовать `AppMetrica.putErrorEnvironmentValue()` для передачи текущего состояния игры. При каждом значимом изменении состояния обновлять environment. Когда произойдёт краш, AppMetrica автоматически приложит эти значения к отчёту.

**Какие значения передавать:**

| Ключ | Пример значения | Когда обновлять |
|---|---|---|
| `current_game_mode` | `"classic"`, `"bigmap"`, `"multiplayer"` | При входе в режим |
| `current_level` | `"5"`, `"12"`, `"lobby"` | При старте уровня |
| `current_screen` | `"main_menu"`, `"gameplay"`, `"settings"`, `"game_over"` | При переходе между экранами |
| `install_source` | `"rustore"`, `"google_play"` | Один раз при запуске |

**Пример псевдокода:**

```kotlin
// Вызывать при каждом переходе между экранами/уровнями
object GameStateTracker {

    fun onEnterGameMode(mode: String) {
        AppMetrica.putErrorEnvironmentValue("current_game_mode", mode)
    }

    fun onStartLevel(level: Int) {
        AppMetrica.putErrorEnvironmentValue("current_level", level.toString())
    }

    fun onScreenChange(screen: String) {
        AppMetrica.putErrorEnvironmentValue("current_screen", screen)
    }

    fun init(installSource: String) {
        AppMetrica.putErrorEnvironmentValue("install_source", installSource)
    }
}
```

**Где вызывать:**

- `GameStateTracker.init()` — в `Application.onCreate()` после определения install_source
- `GameStateTracker.onEnterGameMode()` — при выборе режима игры
- `GameStateTracker.onStartLevel()` — при загрузке уровня
- `GameStateTracker.onScreenChange()` — при переходе между основными экранами

**Результат:** в AppMetrica в разделе "Крэши" каждый краш будет содержать информацию о том, на каком экране, в каком режиме и на каком уровне он произошёл.

---

### 3.2. Трекинг Rewarded рекламы (Приоритет 2)

Расширить существующий `AdAnalytics` для детального трекинга rewarded рекламы с игровым контекстом.

**События:**

#### `rewarded_ad_requested`

Отправлять когда пользователь **нажал кнопку** для просмотра rewarded видео.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Текущий режим |
| `level` | String | `"5"` | Текущий уровень |
| `reward_type` | String | `"extra_life"`, `"power_up"`, `"continue"` | За что смотрит рекламу |
| `install_source` | String | `"rustore"` | Источник установки |

#### `rewarded_ad_completed`

Отправлять когда пользователь **досмотрел видео** и получил награду.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Текущий режим |
| `level` | String | `"5"` | Текущий уровень |
| `reward_type` | String | `"extra_life"` | Тип награды |
| `ad_network` | String | `"yandex_rsy"` | Какая сеть показала рекламу |
| `install_source` | String | `"rustore"` | Источник установки |

#### `rewarded_ad_skipped`

Отправлять когда пользователь **закрыл видео** не досмотрев.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Текущий режим |
| `level` | String | `"5"` | Текущий уровень |
| `reward_type` | String | `"extra_life"` | Тип награды |
| `watch_duration_sec` | Int | `8` | Сколько секунд смотрел до закрытия |
| `install_source` | String | `"rustore"` | Источник установки |

**Пример псевдокода:**

```kotlin
// Расширить существующий AdAnalytics
object AdAnalytics {

    // ... существующие методы ...

    fun trackRewardedRequested(gameMode: String, level: String, rewardType: String) {
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "reward_type" to rewardType,
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("rewarded_ad_requested", params)
    }

    fun trackRewardedCompleted(gameMode: String, level: String, rewardType: String, adNetwork: String) {
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "reward_type" to rewardType,
            "ad_network" to adNetwork,
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("rewarded_ad_completed", params)
    }

    fun trackRewardedSkipped(gameMode: String, level: String, rewardType: String, watchDurationSec: Int) {
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "reward_type" to rewardType,
            "watch_duration_sec" to watchDurationSec.toString(),
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("rewarded_ad_skipped", params)
    }
}
```

**Где вызывать:**

- `trackRewardedRequested()` — в обработчике нажатия на кнопку "Смотреть рекламу"
- `trackRewardedCompleted()` — в callback `onRewarded()` / `onAdRewarded()` рекламного SDK
- `trackRewardedSkipped()` — в callback `onAdClosed()` когда награда НЕ была получена

---

### 3.3. Трекинг популярности уровней и режимов (Приоритет 3)

**События:**

#### `level_start`

Отправлять при **начале** уровня.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Режим |
| `level` | String | `"5"` | Номер уровня |
| `install_source` | String | `"rustore"` | Источник |

#### `level_complete`

Отправлять при **успешном завершении** уровня.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Режим |
| `level` | String | `"5"` | Номер уровня |
| `duration_sec` | Int | `180` | Время прохождения в секундах |
| `lives_remaining` | Int | `2` | Сколько жизней осталось |
| `score` | Int | `15200` | Набранные очки |
| `install_source` | String | `"rustore"` | Источник |

#### `level_fail`

Отправлять при **проигрыше** (game over).

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | Режим |
| `level` | String | `"5"` | Номер уровня |
| `duration_sec` | Int | `45` | Сколько продержался |
| `fail_reason` | String | `"no_lives"`, `"base_destroyed"` | Причина проигрыша |
| `score` | Int | `3200` | Набранные очки |
| `install_source` | String | `"rustore"` | Источник |

#### `game_mode_selected`

Отправлять при **выборе режима** в главном меню.

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"bigmap"` | Какой режим выбрал |
| `install_source` | String | `"rustore"` | Источник |

**Пример псевдокода:**

```kotlin
object GameAnalytics {

    private var levelStartTime: Long = 0

    fun trackModeSelected(gameMode: String) {
        val params = mapOf(
            "game_mode" to gameMode,
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("game_mode_selected", params)
    }

    fun trackLevelStart(gameMode: String, level: String) {
        levelStartTime = System.currentTimeMillis()
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("level_start", params)

        // Обновляем крэш-контекст
        GameStateTracker.onEnterGameMode(gameMode)
        GameStateTracker.onStartLevel(level.toIntOrNull() ?: 0)
    }

    fun trackLevelComplete(gameMode: String, level: String, livesRemaining: Int, score: Int) {
        val duration = ((System.currentTimeMillis() - levelStartTime) / 1000).toInt()
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "duration_sec" to duration.toString(),
            "lives_remaining" to livesRemaining.toString(),
            "score" to score.toString(),
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("level_complete", params)
    }

    fun trackLevelFail(gameMode: String, level: String, failReason: String, score: Int) {
        val duration = ((System.currentTimeMillis() - levelStartTime) / 1000).toInt()
        val params = mapOf(
            "game_mode" to gameMode,
            "level" to level,
            "duration_sec" to duration.toString(),
            "fail_reason" to failReason,
            "score" to score.toString(),
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("level_fail", params)
    }
}
```

---

### 3.4. Трекинг игровых сессий (Приоритет 4)

AppMetrica автоматически считает длительность сессий приложения. Дополнительно трекаем игровые сессии внутри конкретных режимов.

#### `game_session_end`

Отправлять когда пользователь **выходит из режима** обратно в меню (или при сворачивании приложения).

| Параметр | Тип | Пример | Описание |
|---|---|---|---|
| `game_mode` | String | `"classic"` | В каком режиме играл |
| `session_duration_sec` | Int | `600` | Общее время в режиме (секунды) |
| `levels_played` | Int | `4` | Сколько уровней сыграл за сессию |
| `levels_completed` | Int | `3` | Сколько прошёл успешно |
| `rewarded_ads_watched` | Int | `2` | Сколько раз смотрел rewarded |
| `install_source` | String | `"rustore"` | Источник |

**Пример псевдокода:**

```kotlin
object GameSessionTracker {

    private var sessionStartTime: Long = 0
    private var currentMode: String = ""
    private var levelsPlayed: Int = 0
    private var levelsCompleted: Int = 0
    private var rewardedAdsWatched: Int = 0

    fun startSession(gameMode: String) {
        sessionStartTime = System.currentTimeMillis()
        currentMode = gameMode
        levelsPlayed = 0
        levelsCompleted = 0
        rewardedAdsWatched = 0
    }

    fun onLevelPlayed() { levelsPlayed++ }
    fun onLevelCompleted() { levelsCompleted++ }
    fun onRewardedWatched() { rewardedAdsWatched++ }

    fun endSession() {
        if (currentMode.isEmpty()) return
        val duration = ((System.currentTimeMillis() - sessionStartTime) / 1000).toInt()

        val params = mapOf(
            "game_mode" to currentMode,
            "session_duration_sec" to duration.toString(),
            "levels_played" to levelsPlayed.toString(),
            "levels_completed" to levelsCompleted.toString(),
            "rewarded_ads_watched" to rewardedAdsWatched.toString(),
            "install_source" to InstallSourceDetector.cachedSource
        )
        AppMetrica.reportEvent("game_session_end", params)
        currentMode = ""
    }
}
```

**Где вызывать:**

- `startSession()` — при входе в игровой режим
- `endSession()` — при выходе в главное меню, при `onPause()` / `onStop()` Activity

---

## 4. Структура файлов (ожидаемый результат)

```
app/src/main/java/.../analytics/
├── InstallSourceDetector.kt      ← БЕЗ ИЗМЕНЕНИЙ (уже реализован)
├── AdAnalytics.kt                ← ИЗМЕНИТЬ (добавить rewarded-события)
├── GameStateTracker.kt           ← НОВЫЙ (крэш-контекст)
├── GameAnalytics.kt              ← НОВЫЙ (уровни, режимы)
└── GameSessionTracker.kt         ← НОВЫЙ (игровые сессии)
```

Интеграция в существующий код:

```
App.kt / Application              ← ИЗМЕНИТЬ (инициализация GameStateTracker)
GameScreen / LevelManager          ← ИЗМЕНИТЬ (вызовы trackLevelStart/Complete/Fail)
MainMenu / ModeSelector            ← ИЗМЕНИТЬ (вызов trackModeSelected)
AdService / RewardedAdCallback     ← ИЗМЕНИТЬ (вызовы rewarded-событий)
```

---

## 5. Полный список событий (summary)

| Событие | Приоритет | Описание |
|---|---|---|
| *Крэш environment* | **1 — Обязательно** | Автоматический контекст при крашах |
| `rewarded_ad_requested` | **2 — Обязательно** | Нажал кнопку "смотреть рекламу" |
| `rewarded_ad_completed` | **2 — Обязательно** | Досмотрел и получил награду |
| `rewarded_ad_skipped` | **2 — Обязательно** | Закрыл не досмотрев |
| `game_mode_selected` | **3 — Обязательно** | Выбрал режим в меню |
| `level_start` | **3 — Обязательно** | Начал уровень |
| `level_complete` | **3 — Обязательно** | Прошёл уровень |
| `level_fail` | **3 — Обязательно** | Проиграл |
| `game_session_end` | **4 — Желательно** | Завершил игровую сессию в режиме |

---

## 6. Требования к реализации

| # | Требование | Приоритет |
|---|---|---|
| 1 | Все события содержат `install_source` из InstallSourceDetector | **Обязательно** |
| 2 | `GameStateTracker` обновляет error environment при каждом переходе | **Обязательно** |
| 3 | Rewarded-события вызываются в правильных callback-ах SDK | **Обязательно** |
| 4 | `level_start` замеряет время для расчёта `duration_sec` в `level_complete`/`level_fail` | **Обязательно** |
| 5 | `game_session_end` отправляется при `onPause()`/`onStop()` чтобы не терять данные | **Обязательно** |
| 6 | Не отправлять дублирующие события (защита от двойного вызова) | **Обязательно** |
| 7 | Все строковые значения game_mode в нижнем регистре без пробелов | **Обязательно** |
| 8 | Debug-логирование всех отправляемых событий | Желательно |

---

## 7. Как проверить

### Тестирование событий

1. Запустить приложение в debug-режиме
2. Выбрать режим Classic → проверить в логах событие `game_mode_selected`
3. Начать уровень → проверить `level_start`
4. Пройти уровень → проверить `level_complete` с `duration_sec`
5. Проиграть уровень → проверить `level_fail` с `fail_reason`
6. Нажать "Смотреть рекламу" → проверить `rewarded_ad_requested`
7. Досмотреть рекламу → проверить `rewarded_ad_completed`
8. Выйти в меню → проверить `game_session_end`

### Проверка крэш-контекста

1. Искусственно вызвать краш во время игры (например, `throw RuntimeException("test")`)
2. Открыть AppMetrica → Крэши → проверить что в environment есть `current_game_mode`, `current_level`, `current_screen`

### Проверка в AppMetrica Console

1. Раздел "События" → убедиться что все новые события появились
2. Каждое событие раскрыть → проверить наличие параметров
3. Построить отчёт по `game_mode_selected` с группировкой по `game_mode` → увидеть распределение
4. Построить отчёт по `rewarded_ad_completed` с группировкой по `game_mode` и `level`

---

## 8. Зависимости

Новых зависимостей не требуется. Используется только AppMetrica SDK (уже подключен).

---

## 9. Вне скоупа

- Настройка дашборда / виджетов в AppMetrica Console (делается вручную в веб-интерфейсе)
- Push-уведомления
- Revenue tracking (покрыто в предыдущем ТЗ)
- A/B тестирование
- Воронки конверсий (настраиваются в AppMetrica Console после накопления данных)
