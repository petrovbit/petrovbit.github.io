/* PetrovBit — браузерное демо игры поверх страницы
   Демо — отдельная сборка игры (для Tank 1990 — модуль html-demo в репозитории
   игры), выложенная своим GitHub Pages-репозиторием и поэтому живущая на том же
   домене: petrovbit.dev/tank-1990-demo/. Адрес — PB_DEMO_LINKS в shared.jsx.

   Окно открывается событием, а не состоянием PageQuiet: там Sect/Frame
   пересоздаются на каждый рендер, и открытие окна перезапускало бы карусель
   и hero-видео. Кнопке достаточно
     window.dispatchEvent(new CustomEvent("pb-demo:open", { detail: "tank" }))

   Игра грузится только по нажатию (iframe появляется вместе с окном) и
   выгружается при закрытии — звук и цикл игры останавливаются сами.

   Демо сообщает о себе через postMessage ({ source: "tank1990-demo", event }):
   ready — меню отрисовано; full-game — пройден уровень демо или нажат
   закрытый пункт. На full-game подсвечиваем ряд сторов внизу окна.
   Exports: window.DemoHost, window.openDemo
*/

const PB_DEMO_COPY = {
  ru: {
    title: "Tank 1990 · демо в браузере",
    loading: "загружаем игру…",
    full: "на весь экран",
    close: "закрыть",
    note: "В демо только первый уровень. В полной версии — 30 уровней, большие карты-миссии и редактор.",
    done: "Понравилось? Полная версия — бесплатно в сторах:",
    locked: "Это есть только в полной версии — она бесплатная:",
  },
  en: {
    title: "Tank 1990 · browser demo",
    loading: "loading the game…",
    full: "fullscreen",
    close: "close",
    note: "The demo has the first level only. The full game has 30 levels, big-map missions and a level editor.",
    done: "Liked it? The full game is free in the stores:",
    locked: "That's in the full game — it's free:",
  },
};

function openDemo(game) {
  window.dispatchEvent(new CustomEvent("pb-demo:open", { detail: game }));
}

function DemoHost({ lang = "ru", mobile = false }) {
  const T = PB_DEMO_COPY[lang] || PB_DEMO_COPY.en;
  const [game, setGame] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [cta, setCta] = React.useState(null);   /* null | "finished" | "locked" */
  const shellRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const backFocus = React.useRef(null);
  const mobileRef = React.useRef(mobile);
  mobileRef.current = mobile;

  React.useEffect(() => {
    const onOpen = (e) => {
      const g = e.detail || "tank";
      if (!PB_DEMO_LINKS[g]) return;
      backFocus.current = document.activeElement;
      setReady(false); setCta(null); setGame(g);
      /* Телефон: просим весь экран прямо в обработчике клика — позже
         браузер уже не считает это жестом пользователя. */
      if (mobileRef.current) {
        const root = document.documentElement;
        if (root.requestFullscreen) root.requestFullscreen().then(() => {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {});
        }).catch(() => {});
      }
      if (window.ym) try { window.ym(111453148, "reachGoal", "demo_open", { game: g }); } catch (err) {}
    };
    window.addEventListener("pb-demo:open", onOpen);
    return () => window.removeEventListener("pb-demo:open", onOpen);
  }, []);

  const close = React.useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setGame(null);
    const el = backFocus.current;
    if (el && el.focus) setTimeout(() => el.focus(), 0);
  }, []);

  React.useEffect(() => {
    if (!game) return;
    const onMsg = (e) => {
      const f = frameRef.current;
      if (!f || e.source !== f.contentWindow) return;
      const d = e.data || {};
      if (d.source !== "tank1990-demo") return;
      if (d.event === "ready") setReady(true);
      if (d.event === "full-game") setCta(d.reason === "finished" ? "finished" : "locked");
    };
    const onKey = (e) => { if (e.key === "Escape" && !document.fullscreenElement) close(); };
    window.addEventListener("message", onMsg);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", onMsg);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [game, close]);

  /* Весь экран и альбомная ориентация — где это умеет браузер (Android
     Chrome, десктоп). iPhone fullscreen для элементов не даёт, там окно и
     так растянуто на весь экран. */
  const goFull = React.useCallback(() => {
    const el = shellRef.current;
    if (!el || !el.requestFullscreen) return;
    el.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {});
    }).catch(() => {});
  }, []);

  if (!game) return null;
  /* Язык игры — как у сайта, а не как у браузера. */
  const src = `${PB_DEMO_LINKS[game]}?lang=${lang === "ru" ? "ru" : "en"}`;

  return (
    <div className="pb-demo" role="dialog" aria-modal="true" aria-label={T.title}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={shellRef} className={"pb-demo__shell" + (mobile ? " pb-demo__shell--mobile" : "")}>
        <div className="pb-demo__bar">
          <span className="pb-demo__title">{T.title}</span>
          <span className="pb-demo__actions">
            <button type="button" className="pb-demo__btn" onClick={goFull}>
              <svg viewBox="0 0 8 8" width="11" height="11" shapeRendering="crispEdges" aria-hidden="true">
                <path d="M0 0h3v1H1v2H0zM5 0h3v3H7V1H5zM0 5h1v2h2v1H0zM7 5h1v3H5V7h2z" fill="currentColor" />
              </svg>
              {!mobile && T.full}
            </button>
            <button type="button" className="pb-demo__btn" onClick={close} aria-label={T.close}>
              <svg viewBox="0 0 8 8" width="11" height="11" shapeRendering="crispEdges" aria-hidden="true">
                <path d="M0 0h2v2H0zM2 2h2v2H2zM4 4h2v2H4zM6 6h2v2H6zM6 0h2v2H6zM4 2h2v2H4zM2 4h2v2H2zM0 6h2v2H0z" fill="currentColor" />
              </svg>
              {!mobile && T.close}
            </button>
          </span>
        </div>

        <div className="pb-demo__stage">
          {!ready && <div className="pb-demo__loading" aria-hidden="true">{T.loading}</div>}
          <iframe ref={frameRef} src={src} title={T.title}
            allow="fullscreen; autoplay; gamepad"
            allowFullScreen
            onLoad={(e) => { try { e.currentTarget.focus(); } catch (err) {} }} />
        </div>

        <div className={"pb-demo__foot" + (cta ? " is-cta" : "")}>
          <p className="pb-demo__note">{cta === "finished" ? T.done : cta === "locked" ? T.locked : T.note}</p>
          <StoreBadges game={game} lang={lang} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DemoHost, openDemo });
