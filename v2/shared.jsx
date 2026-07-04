/* PetrovBit V2 — shared atoms + content
   Globals: PB_CONTENT, Logo, LangToggle, VideoFrame, MonoLabel, Stamp,
   PixelTank, Socials
*/

const { useState, useEffect, useRef } = React;

/* ─── Content (RU/EN) ──────────────────────────────────────── */

const PB_CONTENT = {
  en: {
    tagline: "One dev. Three games. Zero marketing budget.",
    intro: "Indie mobile arcades made in a small flat near Moscow. Pixel-art and stylized retro gameplay, fully offline, no ads mid-fight — the kind of games I'd want on my own phone.",
    by: "by mikhail petrov · petrovbit · since 2024",
    seeGames: "see the games",
    games: {
      sect: "the games",
      heading: "Three of them.",
      headingSub: "That's the whole catalog.",
      tank: {
        kicker: "shipped · march 2026",
        title: "Tank 1990",
        sub: "Big Map Battle",
        body: "A classic 8-bit tank arcade with one twist: there is no base to babysit. Maps are 4–8× bigger than the old 13×13 screens — hunt, flank and ambush across a 30-level campaign, build your own maps in the built-in editor, save anywhere. Weighs 11 MB and never asks for internet.",
        meta: [["genre", "8-bit arcade"], ["campaign", "30+ levels + editor"], ["gamepad", "dualshock · xbox · tv"], ["offline", "always"]],
        stores: [
          ["google play", "https://play.google.com/store/apps/details?id=io.battle_city.game"],
          ["rustore", "https://www.rustore.ru/catalog/app/io.battle_city.game"],
        ],
      },
      pix: {
        kicker: "closed beta · summer 2026",
        title: "Pixel Tanks",
        sub: "Steel Frontier",
        body: "The online co-op follow-up: up to four players hold the line together on one big map. Meadows, forests, rivers with wooden bridges, highlands and desert — all destructible, every shot leaves craters and rubble. Steady 60 fps even on old phones and TV boxes. Ships when it's good, not when the calendar says so.",
        when: "target release · august 2026",
      },
      swamp: {
        kicker: "in development · working title",
        title: "Swamp Defense",
        sub: "Bronze Age TD",
        body: "A painterly tower defense set in a Bronze Age swamp settlement under siege by giant insects. Six tower types — archer watchtowers, slingers, harpoons over the water, druid mushroom towers, a beacon sniper and fire braziers — each with seven upgrade tiers.",
        when: "target release · october 2026",
      },
    },
    roadmap: {
      sect: "what's next",
      heading: "Roughly the plan.",
      items: [
        { date: "Q1 26", state: "done",     title: "Tank 1990: Big Map Battle", note: "live on Google Play & RuStore" },
        { date: "Aug 26", state: "beta",    title: "Pixel Tanks: Steel Frontier", note: "closed beta — polishing online co-op and netcode" },
        { date: "Oct 26", state: "dev",     title: "Swamp Defense: Bronze Age", note: "alpha slice: first level, two tower lines playable" },
      ],
    },
    rules: {
      sect: "house rules",
      heading: "Things I refuse to do.",
      items: [
        ["ads stay in the menu","only on menu screens. zero ads while you actually play."],
        ["offline always works","metro tunnel, plane, no signal — same game."],
        ["no forced monetization","no pay-to-win walls, only optional rewarded ads for extra resources."],
        ["gamepad supported",   "any bluetooth controller — dualshock, xbox, generic. zero config."],
      ],
    },
    numbers: {
      sect: "honest numbers",
      heading: "What I have so far.",
      rating: "4.3",
      ratingNote: "40 reviews on Google Play",
      stats: [["installs", "5,000+"], ["games shipped", "1"], ["games in dev", "2"], ["people on team", "1"]],
      footnote: "I'll add press quotes once they exist.",
    },
    footer: {
      copy: "© 2024–2026 PetrovBit · made by Mikhail Petrov",
      links: [["privacy", "privacy-policy.html"], ["telegram", "#"], ["youtube", "#"], ["email", "mailto:contact@petrovbit.dev"]],
    },
  },
  ru: {
    tagline: "Один разраб. Три игры. Ноль маркетинга.",
    intro: "Инди-игры для телефона, которые я делаю в маленькой квартире под Москвой. Пиксельный и стилизованный ретро-геймплей, полный офлайн, без рекламы посреди боя — такие, что и сам бы поставил.",
    by: "михаил петров · petrovbit · с 2024",
    seeGames: "посмотреть игры",
    games: {
      sect: "игры",
      heading: "Их три.",
      headingSub: "Весь каталог.",
      tank: {
        kicker: "вышла · март 2026",
        title: "Tank 1990",
        sub: "Big Map Battle",
        body: "Классическая 8-битная аркада про танчики с одним отличием: базы, которую надо охранять, больше нет. Карты в 4–8 раз больше старых экранов 13×13 — охоться, заходи с флангов, устраивай засады. Кампания на 30+ уровней, встроенный редактор карт, сохранение в любой момент. Весит 11 МБ и не просит интернет.",
        meta: [["жанр", "8-бит аркада"], ["кампания", "30+ уровней + редактор"], ["геймпад", "dualshock · xbox · tv"], ["офлайн", "всегда"]],
        stores: [
          ["google play", "https://play.google.com/store/apps/details?id=io.battle_city.game"],
          ["rustore", "https://www.rustore.ru/catalog/app/io.battle_city.game"],
        ],
      },
      pix: {
        kicker: "закрытая бета · лето 2026",
        title: "Pixel Tanks",
        sub: "Steel Frontier",
        body: "Продолжение с онлайн-кооперативом: до четырёх игроков держат оборону вместе на одной большой карте. Луга, леса, реки с деревянными мостами, нагорья и пустыня — всё разрушается, каждый выстрел оставляет воронки и обломки. Стабильные 60 fps даже на старых телефонах и ТВ-приставках. Выйдет когда будет хорошо, а не когда календарь скажет.",
        when: "ориентир релиза · август 2026",
      },
      swamp: {
        kicker: "в разработке · рабочее название",
        title: "Swamp Defense",
        sub: "Bronze Age TD",
        body: "Живописный Tower Defense в болотном поселении бронзового века, осаждённом гигантскими насекомыми. Шесть типов башен — дозорные лучники, пращники, гарпуны над водой, грибные башни друидов, маяк-снайпер и огненные жаровни — у каждой семь уровней прокачки.",
        when: "ориентир релиза · октябрь 2026",
      },
    },
    roadmap: {
      sect: "что дальше",
      heading: "Примерный план.",
      items: [
        { date: "Q1 26", state: "готово",   title: "Tank 1990: Big Map Battle", note: "в Google Play и RuStore" },
        { date: "Авг 26", state: "тест",    title: "Pixel Tanks: Steel Frontier", note: "закрытая бета — полируем онлайн-кооп и сетевой код" },
        { date: "Окт 26", state: "разработка", title: "Swamp Defense: Bronze Age", note: "альфа-срез: первый уровень, две линейки башен" },
      ],
    },
    rules: {
      sect: "правила дома",
      heading: "Что я не делаю.",
      items: [
        ["реклама только в меню","баннеры есть, но только на экранах меню. во время игры — ноль."],
        ["офлайн всегда работает","в метро, в самолёте — игра та же."],
        ["без донат-стен","никакого pay-to-win, только добровольная реклама за бонусы."],
        ["геймпад работает",     "любой блютус — dualshock, xbox, дженерик. без настройки."],
      ],
    },
    numbers: {
      sect: "честные цифры",
      heading: "Что у меня есть.",
      rating: "4.3",
      ratingNote: "40 отзывов в Google Play",
      stats: [["установок", "5 000+"], ["игр вышло", "1"], ["в разработке", "2"], ["в команде", "1"]],
      footnote: "Цитаты прессы добавлю когда появятся.",
    },
    footer: {
      copy: "© 2024–2026 PetrovBit · михаил петров",
      links: [["конфиденциальность", "privacy-policy.html"], ["telegram", "#"], ["youtube", "#"], ["email", "mailto:contact@petrovbit.dev"]],
    },
  },
};

/* ─── Atoms ────────────────────────────────────────────────── */

function Logo({ size = 18, withDot = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--v2-font-mono)", fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", color: "var(--v2-ink)" }}>
      {withDot && <span style={{ width: size * 0.42, height: size * 0.42, background: "var(--v2-accent)", borderRadius: "50%", display: "inline-block" }} />}
      <span>petrovbit</span>
    </span>
  );
}

function LangToggle({ lang, setLang, size = 11 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--v2-font-mono)", fontSize: size, color: "var(--v2-ink-3)", letterSpacing: "0.06em" }}>
      <button onClick={() => setLang && setLang("en")} style={{ color: lang === "en" ? "var(--v2-ink)" : "inherit", fontWeight: lang === "en" ? 600 : 400, textDecoration: lang === "en" ? "underline" : "none", textUnderlineOffset: 3 }}>EN</button>
      <span style={{ opacity: 0.4 }}>·</span>
      <button onClick={() => setLang && setLang("ru")} style={{ color: lang === "ru" ? "var(--v2-ink)" : "inherit", fontWeight: lang === "ru" ? 600 : 400, textDecoration: lang === "ru" ? "underline" : "none", textUnderlineOffset: 3 }}>RU</button>
    </div>
  );
}

function MonoLabel({ children, color, size = 11 }) {
  return (
    <span style={{ fontFamily: "var(--v2-font-mono)", fontSize: size, color: color || "var(--v2-ink-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

/* Inline gameplay video. Forces muted + autoplay reliably across browsers.
   When `posterOnly` is set, renders a still <img> instead — cheaper for
   secondary artboards (tablet/mobile) so the canvas doesn't load three
   simultaneous video elements. */
function GameVideo({ style, posterOnly = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (posterOnly) return;
    const el = ref.current;
    if (!el) return;
    el.muted = true; el.volume = 0;
    el.setAttribute("muted", "");
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
  }, [posterOnly]);
  if (posterOnly) {
    return (
      <img
        src="assets/images/tank-1990-hero-poster.png"
        alt=""
        className="pixelated"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
      />
    );
  }
  return (
    <video
      ref={ref}
      src="assets/video/tank-1990-hero.webm"
      poster="assets/images/tank-1990-hero-poster.png"
      muted autoPlay loop playsInline preload="auto"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  );
}

/* Pixel-art tank illustration drawn with rects — used as a small mascot */
function PixelTank({ size = 24, color, treads }) {
  const c = color || "var(--v2-ink)";
  const t = treads || "var(--v2-accent)";
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges" style={{ display: "inline-block", verticalAlign: "middle" }}>
      {/* treads */}
      <rect x="1" y="8" width="10" height="2" fill={t} />
      <rect x="1" y="10" width="2" height="1" fill={t} />
      <rect x="5" y="10" width="2" height="1" fill={t} />
      <rect x="9" y="10" width="2" height="1" fill={t} />
      {/* body */}
      <rect x="2" y="5" width="8" height="3" fill={c} />
      {/* turret */}
      <rect x="4" y="3" width="4" height="2" fill={c} />
      {/* barrel */}
      <rect x="5" y="1" width="2" height="3" fill={c} />
    </svg>
  );
}

function Stamp({ children, rotate = -4, color }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "var(--v2-font-mono)", fontWeight: 700, fontSize: 11,
      letterSpacing: "0.2em", textTransform: "uppercase",
      color: color || "var(--v2-stamp)",
      border: `2px solid ${color || "var(--v2-stamp)"}`,
      padding: "4px 9px 3px",
      transform: `rotate(${rotate}deg)`,
      opacity: 0.92,
      borderRadius: 2,
    }}>{children}</span>
  );
}

function Socials({ size = 14, color }) {
  const c = color || "var(--v2-ink-2)";
  const items = [
    { k: "tg", path: "M14.5 2L1.5 7.2c-.7.3-.6.7 0 .9l3.3 1 1.3 3.9c.2.5.3.6.7.6.3 0 .5-.1.7-.4l1.6-1.6 3.3 2.5c.6.3 1 .2 1.2-.6L15.4 2.7c.2-.9-.3-1.3-.9-.7zm-3.7 3.9l-5.5 5-.2 2.3L4 9.7l8-5c.4-.2.7 0 .4.4l-1.6 1.7z" },
    { k: "yt", path: "M14.7 4.5c-.2-.7-.7-1.2-1.4-1.4C12 2.7 8 2.7 8 2.7s-4 0-5.3.4c-.7.2-1.2.7-1.4 1.4C1 5.8 1 8 1 8s0 2.2.3 3.5c.2.7.7 1.2 1.4 1.4C4 13.3 8 13.3 8 13.3s4 0 5.3-.4c.7-.2 1.2-.7 1.4-1.4.3-1.3.3-3.5.3-3.5s0-2.2-.3-3.5zM6.7 10.3v-4.6L10.5 8l-3.8 2.3z" },
    { k: "vk", path: "M8.6 11.7c-3.5 0-5.5-2.4-5.6-6.4h1.7c.1 2.9 1.4 4.2 2.4 4.5V5.3h1.7v2.5c1-.1 2-1.2 2.4-2.5h1.6c-.3 1.6-1.4 2.7-2.2 3.2.8.4 2 1.4 2.5 3.2h-1.7c-.4-1.3-1.4-2.4-2.6-2.5v2.5h-.2z" },
  ];
  return (
    <div style={{ display: "flex", gap: 10, color: c }}>
      {items.map(s => (
        <a key={s.k} href="#" aria-label={s.k} style={{ width: size + 4, height: size + 4, display: "grid", placeItems: "center" }}>
          <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path d={s.path}/></svg>
        </a>
      ))}
    </div>
  );
}

/* ─── Export to window so other Babel scripts can pick them up ─── */
Object.assign(window, {
  PB_CONTENT, Logo, LangToggle, MonoLabel, GameVideo, PixelTank, Stamp, Socials,
});
