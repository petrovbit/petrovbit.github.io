/* PetrovBit V2 — Suggestion modal (mailto version)
   No auth. User fills name / idea / genre → "Send" opens their mail client
   with a pre-addressed, pre-filled email to contact@petrovbit.dev.
   Exports: window.SuggestModal (also: window.SUGGEST_COPY for inline use).
*/

const SUGGEST_EMAIL = "contact@petrovbit.dev";

const SUGGEST_COPY = {
  en: {
    cta: "+ suggest yours",
    title: "What should I make next?",
    subtitle: "I won't promise to build it. I'll read every one.",
    nameLabel: "Game name",
    namePh: "a name or working title (optional)",
    ideaLabel: "The idea",
    ideaPh: "genre, mechanics, inspiration… as much as you want.",
    genreLabel: "Genre",
    genres: ["Arcade", "Puzzle", "Platformer", "Strategy", "RPG", "Sim", "Racing", "Other"],
    submit: "Open email",
    cancel: "Cancel",
    mailNote: "opens your mail app, pre-addressed to",
    subject: "Game idea for PetrovBit",
    bodyName: "Game name",
    bodyGenre: "Genre",
    bodyIdea: "The idea",
    bodySig: "— sent from petrovbit.dev",
  },
  ru: {
    cta: "+ предложи свою идею",
    title: "Какую игру стоит сделать?",
    subtitle: "Сделать обещать не буду. Прочитаю каждую.",
    nameLabel: "Название игры",
    namePh: "название или рабочее имя (необязательно)",
    ideaLabel: "Сама идея",
    ideaPh: "жанр, механики, вдохновение… сколько хочешь.",
    genreLabel: "Жанр",
    genres: ["Аркада", "Головоломка", "Платформер", "Стратегия", "RPG", "Симулятор", "Гонки", "Другое"],
    submit: "Открыть письмо",
    cancel: "Отмена",
    mailNote: "откроется почта, письмо уже адресовано на",
    subject: "Идея игры для PetrovBit",
    bodyName: "Название игры",
    bodyGenre: "Жанр",
    bodyIdea: "Идея",
    bodySig: "— отправлено с petrovbit.dev",
  },
};

function buildMailto(T, { name, idea, genre }) {
  const subject = name ? `${T.subject} — ${name}` : T.subject;
  const lines = [
    `${T.bodyName}: ${name || "—"}`,
    `${T.bodyGenre}: ${genre || "—"}`,
    ``,
    `${T.bodyIdea}:`,
    idea || "",
    ``,
    T.bodySig,
  ];
  const body = lines.join("\n");
  return `mailto:${SUGGEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function SuggestModal({ state, setState, lang = "en", mobile = false }) {
  const T = SUGGEST_COPY[lang];
  const [name, setName] = React.useState("");
  const [idea, setIdea] = React.useState("");
  const [genre, setGenre] = React.useState(null);

  if (state === "closed") return null;

  const overlay = {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(20, 18, 24, 0.55)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "grid", placeItems: "center",
    padding: mobile ? 16 : 32,
    animation: "v2-fade .18s ease",
  };
  const panel = {
    background: "var(--v2-paper)",
    color: "var(--v2-ink)",
    width: "100%", maxWidth: mobile ? "100%" : 520,
    border: "1px solid var(--v2-ink)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
    padding: mobile ? "28px 22px 26px" : "40px 44px 36px",
    position: "relative",
    fontFamily: "var(--v2-font-body)",
    maxHeight: "min(92vh, 760px)",
    overflow: "auto",
  };
  const closeBtn = {
    position: "absolute", top: 14, right: 14,
    width: 32, height: 32, display: "grid", placeItems: "center",
    border: "1px solid var(--v2-rule)", borderRadius: 0,
    fontFamily: "var(--v2-font-mono)", fontSize: 14,
    color: "var(--v2-ink-2)", background: "transparent", cursor: "pointer",
  };
  const labelStyle = {
    fontFamily: "var(--v2-font-mono)", fontSize: 10,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color: "var(--v2-ink-3)",
    display: "block", marginBottom: 8,
  };
  const inputBase = {
    width: "100%",
    background: "transparent",
    border: 0, borderBottom: "1px solid var(--v2-ink)",
    padding: "10px 0 8px",
    fontFamily: "var(--v2-font-body)", fontSize: 15,
    color: "var(--v2-ink)", outline: "none",
  };

  const mailto = buildMailto(T, { name, idea, genre });

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) setState("closed"); }}>
      <style>{`@keyframes v2-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div style={panel}>
        <button style={closeBtn} aria-label="close" onClick={() => setState("closed")}>×</button>

        <div style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--v2-ink-3)", marginBottom: 14 }}>
          —— {lang === "ru" ? "форма предложений" : "submit an idea"}
        </div>
        <h3 style={{
          fontFamily: "var(--v2-font-display)", fontWeight: 400,
          fontSize: mobile ? 28 : 34, letterSpacing: "-0.025em", lineHeight: 1.05,
          marginBottom: 8,
        }}>{T.title}</h3>
        <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: 16, color: "var(--v2-ink-2)", marginBottom: 24, lineHeight: 1.4 }}>
          {T.subtitle}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 20, borderTop: "1px solid var(--v2-rule)" }}>
          <div>
            <label style={labelStyle}>{T.nameLabel}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={T.namePh} style={inputBase} />
          </div>
          <div>
            <label style={labelStyle}>{T.ideaLabel}</label>
            <textarea
              value={idea} onChange={(e) => setIdea(e.target.value)}
              placeholder={T.ideaPh} rows={4}
              style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>
          <div>
            <label style={labelStyle}>{T.genreLabel}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {T.genres.map(g => {
                const active = genre === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(active ? null : g)}
                    style={{
                      fontFamily: "var(--v2-font-mono)", fontSize: 11,
                      letterSpacing: "0.05em",
                      padding: "6px 12px",
                      border: "1px solid var(--v2-rule)",
                      background: active ? "var(--v2-ink)" : "transparent",
                      color: active ? "var(--v2-paper)" : "var(--v2-ink-2)",
                      cursor: "pointer", textTransform: "lowercase",
                    }}
                  >{g}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 26, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <button
            onClick={() => setState("closed")}
            style={{
              fontFamily: "var(--v2-font-mono)", fontSize: 12,
              color: "var(--v2-ink-2)", letterSpacing: "0.08em",
              background: "transparent", border: 0, cursor: "pointer",
            }}
          >{T.cancel}</button>
          <a
            href={mailto}
            onClick={() => setTimeout(() => setState("closed"), 300)}
            style={{
              fontFamily: "var(--v2-font-mono)", fontSize: 12, fontWeight: 600,
              color: "var(--v2-paper)", background: "var(--v2-accent)",
              padding: "12px 22px", letterSpacing: "0.1em", textTransform: "uppercase",
              border: 0, cursor: "pointer", textDecoration: "none",
            }}
          >{T.submit} →</a>
        </div>

        <p style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, letterSpacing: "0.06em", color: "var(--v2-ink-3)", marginTop: 18, lineHeight: 1.5 }}>
          {T.mailNote} <span style={{ color: "var(--v2-accent)" }}>{SUGGEST_EMAIL}</span>
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { SuggestModal, SUGGEST_COPY });
