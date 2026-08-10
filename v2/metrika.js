/* Yandex Metrica — shared loader for every page of petrovbit.dev.
   This file is the single place the counter id lives; set YM_COUNTER_ID back
   to null to switch analytics off everywhere (nothing is loaded or sent).

   Webvisor (session recording) is deliberately off: it records what visitors
   do on the page, which needs an explicit cookie/consent notice we don't show
   yet. Flip YM_WEBVISOR once that notice exists. */
(function () {
  var YM_COUNTER_ID = 111453148;
  var YM_WEBVISOR = false;
  if (!YM_COUNTER_ID) return;

  var SRC = "https://mc.yandex.ru/metrika/tag.js?id=" + YM_COUNTER_ID;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    /* Guard against a double include (three pages share this file). */
    for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) { return; } }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, "script", SRC, "ym");

  ym(YM_COUNTER_ID, "init", {
    ssr: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: YM_WEBVISOR,
    referrer: document.referrer,
    url: location.href
  });
})();
