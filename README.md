# PetrovBit

Indie game studio focused on retro-style mobile games.

Coming soon.

— Mikhail Petrov

## TODO

- [ ] Обновить ссылки на Google Play / RuStore для Tank 1990 (сейчас ведут на старый пакет `io.battle_city.game`), когда зальём новые APK с пакетами `dev.petrovbit.*`. Ссылки прописаны в `v2/shared.jsx` (`PB_STORE_LINKS.tank`).
- [ ] Плашка-уведомление про cookies. Сайт использует Яндекс.Метрику (счётчик в `v2/metrika.js`), в политике конфиденциальности это описано, но уведомления на самих страницах нет. Пока плашки нет — вебвизор держим выключенным (`YM_WEBVISOR = false` в `v2/metrika.js`): запись сессий без явного уведомления включать не стоит. Как появится плашка — можно включить.
