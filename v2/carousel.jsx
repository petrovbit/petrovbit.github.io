/* PetrovBit — карусель кадров игры
   Видео + скриншоты в одной стальной рамке. Компонент живёт на верхнем
   уровне файла, а не внутри PageQuiet: там Frame/Sect пересоздаются на
   каждый рендер, и состояние карусели сбрасывалось бы при любом клике.

   Тайминг: скриншот — 5 с (типичный ориентир для автокарусели без текста:
   успеть рассмотреть кадр и не заскучать), видео — до конца ролика.
   Автопрокрутка стоит на паузе, пока курсор/фокус внутри, карусель вне
   экрана или вкладка скрыта; при prefers-reduced-motion её нет вовсе.

   Смена кадра — «занавес» уровня из Tank 1990: новый кадр раскрывается
   от середины вверх и вниз ступенями, а не плавно.

   Снаружи кадр можно переключить событием, если передан eventName
   (сейчас не используется): window.dispatchEvent(new CustomEvent(name, { detail: i }))
   или { detail: "video" } — сразу на ролик.
   Exports: window.ShotCarousel
*/

const PB_SHOT_DWELL = 5000;

function ShotCarousel({ slides, lang = "ru", mobile = false, capPrefix = "fig. 01", capRight, eventName }) {
  const isRu = lang === "ru";
  const n = slides.length;
  const reduced = React.useMemo(
    () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const [index, setIndex] = React.useState(0);
  const [prev, setPrev] = React.useState(-1);
  const [userPaused, setUserPaused] = React.useState(reduced);
  /* Пауза под мышью и под клавиатурным фокусом. Фокус после клика мышью
     не считаем, иначе карусель так и стоит, пока не кликнешь мимо;
     тап на телефоне — тоже не hover. */
  const [hover, setHover] = React.useState(false);
  const [kbFocus, setKbFocus] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [armed, setArmed] = React.useState(false);     /* хоть раз была рядом с экраном — можно грузить */
  const [docVisible, setDocVisible] = React.useState(!document.hidden);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const [seen, setSeen] = React.useState(() => new Set([0, 1]));

  const rootRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const fillRef = React.useRef(null);
  const elapsed = React.useRef(0);
  const touch = React.useRef(null);

  const running = !userPaused && !hover && !kbFocus && inView && docVisible;

  const indexRef = React.useRef(0);
  const go = React.useCallback((to) => {
    const cur = indexRef.current;
    const next = ((to % n) + n) % n;
    if (next === cur) return;
    indexRef.current = next;
    setPrev(cur);
    setIndex(next);
  }, [n]);

  /* Сбрасываем таймер и подгружаем следующий кадр заранее. */
  React.useEffect(() => {
    elapsed.current = 0;
    setSeen(s => (s.has(index) && s.has((index + 1) % n)) ? s : new Set([...s, index, (index + 1) % n]));
    const v = videoRef.current;
    if (v && slides[index].type === "video") { try { v.currentTime = 0; } catch (e) {} }
  }, [index]);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); setArmed(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting && e.intersectionRatio > 0.35);
      if (e.isIntersecting) setArmed(true);
    }, { threshold: [0, 0.35, 0.6] });
    io.observe(el);
    const onVis = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  React.useEffect(() => {
    if (!eventName) return;
    const onGo = (e) => {
      const to = e.detail === "video" ? slides.findIndex(s => s.type === "video") : Number(e.detail) || 0;
      go(to < 0 ? 0 : to);
      setUserPaused(false);
      const el = rootRef.current;
      const r = el && el.getBoundingClientRect();
      if (r && (r.top < 0 || r.bottom > window.innerHeight)) {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      }
    };
    window.addEventListener(eventName, onGo);
    return () => window.removeEventListener(eventName, onGo);
  }, [eventName, go, slides]);

  /* Видео играет только когда оно на экране и карусель не на паузе. */
  const isVideo = slides[index].type === "video" && !videoFailed;
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isVideo && running && armed) {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isVideo, running, armed, index, seen]);

  /* Один rAF-цикл на прогресс: у скриншота — накопленное время,
     у видео — его собственный currentTime, поэтому полоса не убегает
     вперёд ролика, если тот подгружается. */
  React.useEffect(() => {
    let raf = 0, last = performance.now();
    const tick = (t) => {
      const dt = t - last; last = t;
      let p;
      const v = videoRef.current;
      if (isVideo && v) {
        p = v.duration ? v.currentTime / v.duration : 0;
        if (v.ended) p = 1;
      } else {
        if (running) elapsed.current += dt;
        p = elapsed.current / PB_SHOT_DWELL;
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(p, 1)})`;
      if (p >= 1 && running) { go(index + 1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, running, isVideo, go]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); go(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  };
  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    const s = touch.current; touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  };

  const T = isRu
    ? { region: "Кадры Tank 1990", prev: "Предыдущий кадр", next: "Следующий кадр",
        pause: "пауза", play: "листать", slide: "Кадр" }
    : { region: "Tank 1990 screens", prev: "Previous screen", next: "Next screen",
        pause: "pause", play: "play", slide: "Screen" };

  const cur = slides[index];
  const pad = (k) => String(k).padStart(2, "0");

  return (
    <div ref={rootRef} className="pb-shots"
      role="region" aria-roledescription={isRu ? "карусель" : "carousel"} aria-label={T.region}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(false); }}
      onFocus={(e) => { if (e.target.matches(":focus-visible")) setKbFocus(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setKbFocus(false); }}
      onKeyDown={onKeyDown}>

      <div className="pb-frame pb-shots__frame" style={{ aspectRatio: "16/9" }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {slides.map((s, i) => {
          const cls = "pb-shot" + (i === index ? " is-active" : "") + (i === prev ? " is-prev" : "")
            + (reduced ? " is-instant" : "");
          const hidden = i !== index;
          return (
            <div key={i} className={cls} aria-hidden={hidden}
              role="group" aria-roledescription={isRu ? "кадр" : "slide"}
              aria-label={`${T.slide} ${i + 1} / ${n}`}>
              {s.type === "video" ? (
                <video ref={videoRef}
                  src={armed && seen.has(i) ? s.src : undefined} poster={s.poster}
                  muted playsInline preload={armed && seen.has(i) ? "auto" : "none"}
                  onError={() => setVideoFailed(true)}
                  aria-label={s.alt} />
              ) : (
                seen.has(i) || i === index
                  ? <img src={s.src} alt={s.alt} decoding="async" draggable="false" />
                  : null
              )}
            </div>
          );
        })}

        <button type="button" className="pb-shots__nav pb-shots__nav--prev"
          aria-label={T.prev} onClick={() => go(index - 1)}>
          <svg viewBox="0 0 8 8" width="20" height="20" shapeRendering="crispEdges" aria-hidden="true">
            <path d="M5 0h2v2H5zM3 2h2v2H3zM1 3h2v2H1zM3 4h2v2H3zM5 6h2v2H5z" fill="currentColor" />
          </svg>
        </button>
        <button type="button" className="pb-shots__nav pb-shots__nav--next"
          aria-label={T.next} onClick={() => go(index + 1)}>
          <svg viewBox="0 0 8 8" width="20" height="20" shapeRendering="crispEdges" aria-hidden="true">
            <path d="M1 0h2v2H1zM3 2h2v2H3zM5 3h2v2H5zM3 4h2v2H3zM1 6h2v2H1z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Индикатор: кирпичик на кадр, текущий заполняется по мере показа. */}
      <div className="pb-shots__bar">
        <div className="pb-shots__dots">
          {slides.map((s, i) => (
            <button key={i} type="button"
              className={"pb-shots__dot" + (i === index ? " is-active" : "") + (i < index ? " is-done" : "")
                + (s.type === "video" ? " is-video" : "")}
              aria-label={`${T.slide} ${i + 1}: ${s.cap[isRu ? "ru" : "en"]}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}>
              <span className="pb-shots__dot-track">
                {i === index && <span ref={fillRef} className="pb-shots__dot-fill" />}
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="pb-shots__toggle"
          aria-pressed={userPaused} onClick={() => setUserPaused(p => !p)}>
          <svg viewBox="0 0 8 8" width="9" height="9" shapeRendering="crispEdges" aria-hidden="true">
            {userPaused
              ? <path d="M1 0h2v8H1zM3 1h2v6H3zM5 3h2v2H5z" fill="currentColor" />
              : <path d="M1 0h2v8H1zM5 0h2v8H5z" fill="currentColor" />}
          </svg>
          {userPaused ? T.play : T.pause}
        </button>
      </div>

      <div className="pb-shots__cap" aria-live={running ? "off" : "polite"}>
        <span>{capPrefix} — {pad(index + 1)}/{pad(n)} · {cur.cap[isRu ? "ru" : "en"]}</span>
        {capRight && !mobile && <span>{capRight}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { ShotCarousel });
