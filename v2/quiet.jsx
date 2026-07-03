/* PetrovBit V2 — Direction B: QUIET (responsive)
   Editorial poster. Huge serif. Lots of breathing room.
   Adapts to mobile (375), tablet (768), and desktop (1440).
   Exports: window.PageQuiet
*/

function PageQuiet({ lang = "en", setLang, mobile = false, tablet = false }) {
  const C = PB_CONTENT[lang];
  const ST = (typeof SUGGEST_COPY !== "undefined" ? SUGGEST_COPY[lang] : { cta: "+ suggest yours" });
  const isRu = lang === "ru";
  const [suggest, setSuggest] = React.useState("closed");
  const openSuggest = () => setSuggest("form");

  // — responsive scale tokens —
  const padX     = mobile ? 18 : tablet ? 40 : 80;
  const sectPadV = mobile ? 56 : tablet ? 80 : 120;
  const heroSize = mobile ? 50  : tablet ? 88 : 144;
  const h2Big    = mobile ? 36  : tablet ? 52 : 76;
  const h2Med    = mobile ? 30  : tablet ? 46 : 64;
  const gameH3   = mobile ? 38  : tablet ? 50 : 64;
  const gameH3b  = mobile ? 32  : tablet ? 42 : 56;
  const ruleNum  = mobile ? 30  : tablet ? 38 : 44;
  const ruleH3   = mobile ? 20  : tablet ? 24 : 28;
  const numHero  = mobile ? 80  : tablet ? 110 : 140;
  const numStat  = mobile ? 30  : tablet ? 40  : 52;
  const taglineSz = mobile ? 18 : tablet ? 22 : 26;
  const bodySz    = mobile ? 14 : tablet ? 15 : 15.5;
  const gap       = mobile ? 28 : tablet ? 40 : 64;

  // section with optional ruler / kicker at top
  const Sect = ({ num, kicker, children, last }) => (
    <section style={{
      padding: `${sectPadV}px ${padX}px ${sectPadV}px`,
      borderBottom: last ? "none" : "1px solid var(--v2-rule)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        top: mobile ? 16 : 32,
        left: padX, right: padX,
        display: "flex", justifyContent: "space-between", gap: 12,
        fontFamily: "var(--v2-font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--v2-ink-3)",
      }}>
        <span>—— {num}</span>
        <span>{kicker}</span>
      </div>
      {children}
    </section>
  );

  return (
    <div className="v2" style={{ background: "var(--v2-paper)", color: "var(--v2-ink)", minHeight: "100%" }}>
      {/* ─── MASTHEAD ─── */}
      <header style={{
        display: mobile ? "flex" : "grid",
        gridTemplateColumns: mobile ? undefined : "1fr auto 1fr",
        flexDirection: mobile ? "row" : undefined,
        alignItems: "center", justifyContent: mobile ? "space-between" : undefined,
        padding: mobile ? "16px 18px" : `24px ${padX}px`,
        borderBottom: "1px solid var(--v2-ink)",
      }}>
        {!mobile && (
          <div style={{ fontFamily: "var(--v2-font-mono)", fontSize: 11, color: "var(--v2-ink-2)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {isRu ? "выпуск vol. 02" : "issue vol. 02"} · {isRu ? "лето 2026" : "summer 2026"}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PixelTank size={mobile ? 14 : 16} color="currentColor" treads="var(--v2-accent)" />
          <Logo size={mobile ? 14 : 16} withDot={false} />
        </div>
        <div style={{ justifySelf: mobile ? undefined : "end", display: "flex", alignItems: "center", gap: mobile ? 12 : 18 }}>
          {!mobile && !tablet && (
            <span style={{ fontFamily: "var(--v2-font-mono)", fontSize: 11, color: "var(--v2-ink-2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {isRu ? "тираж 1 шт." : "print run · 1"}
            </span>
          )}
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ padding: `${mobile ? 48 : tablet ? 72 : 100}px ${padX}px ${mobile ? 60 : tablet ? 90 : 120}px`, position: "relative" }}>
        {/* tiny mono caption top */}
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 12,
          marginBottom: mobile ? 36 : tablet ? 56 : 80,
          fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)",
          letterSpacing: "0.18em", textTransform: "uppercase",
        }}>
          <span>—— cover story</span>
          <span>{isRu ? "от первого лица" : "first-person"} ——</span>
        </div>

        <h1 style={{
          fontFamily: "var(--v2-font-display)", fontWeight: 400,
          fontSize: heroSize, lineHeight: 0.9, letterSpacing: "-0.04em",
          marginBottom: mobile ? 32 : tablet ? 44 : 56,
          color: "var(--v2-ink)",
        }}>
          {isRu ? (
            <>
              Пиксели<br/>
              <span style={{ fontStyle: "italic", color: "var(--v2-ink-2)" }}>для кармана.</span>
            </>
          ) : (
            <>
              Pixels<br/>
              <span style={{ fontStyle: "italic", color: "var(--v2-ink-2)" }}>for pocket screens.</span>
            </>
          )}
        </h1>

        {/* video + caption row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1.05fr 0.65fr",
          gap: mobile ? 36 : tablet ? 48 : 72,
          alignItems: mobile ? "stretch" : "end",
        }}>
          <div>
            <div style={{
              aspectRatio: "20/9", background: "#0E0E12",
              border: "1px solid var(--v2-ink)",
              overflow: "hidden",
            }}>
              <GameVideo posterOnly={mobile || tablet} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              <span>fig. 01 — tank 1990, big map mode</span>
              {!mobile && <span>{isRu ? "снято на телефон" : "captured on phone"}</span>}
            </div>
          </div>
          <div style={{ paddingBottom: mobile ? 0 : 8 }}>
            <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: taglineSz, lineHeight: 1.3, color: "var(--v2-ink)", marginBottom: mobile ? 18 : 28, letterSpacing: "-0.01em" }}>
              {C.tagline}
            </p>
            <p style={{ fontSize: bodySz, lineHeight: 1.6, color: "var(--v2-ink-2)", marginBottom: mobile ? 22 : 28 }}>
              {C.intro}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: mobile ? 16 : 22, flexWrap: "wrap" }}>
              <a href="#games" style={{
                fontFamily: "var(--v2-font-mono)", fontSize: 12, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "var(--v2-ink)",
                borderBottom: "2px solid var(--v2-ink)", paddingBottom: 4,
              }}>
                {C.seeGames} →
              </a>
              <span style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)", letterSpacing: "0.14em" }}>
                {C.by}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GAMES — editorial spreads ─── */}
      <Sect num="01" kicker={isRu ? "каталог · 3 / 3" : "catalog · 3 / 3"}>
        <h2 style={{
          fontFamily: "var(--v2-font-display)", fontWeight: 400,
          fontSize: h2Big, letterSpacing: "-0.03em", lineHeight: 0.95,
          marginBottom: mobile ? 40 : tablet ? 56 : 72,
          maxWidth: 900,
        }}>
          {C.games.heading} <span style={{ fontStyle: "italic", color: "var(--v2-ink-3)" }}>{C.games.headingSub}</span>
        </h2>

        {/* Game 1 — Tank 1990 */}
        <article style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1.2fr",
          gap, marginBottom: mobile ? 56 : 100, alignItems: "start",
        }}>
          <div style={{ order: mobile ? 2 : 1 }}>
            <MonoLabel>{C.games.tank.kicker}</MonoLabel>
            <h3 style={{
              fontFamily: "var(--v2-font-display)", fontWeight: 400,
              fontSize: gameH3, letterSpacing: "-0.025em", lineHeight: 0.96,
              marginTop: 16, marginBottom: 6,
            }}>
              {C.games.tank.title}
            </h3>
            <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: mobile ? 18 : 22, color: "var(--v2-ink-2)", marginBottom: 22 }}>
              {C.games.tank.sub}
            </p>
            <p style={{ fontSize: bodySz, lineHeight: 1.65, color: "var(--v2-ink-2)", maxWidth: 460, marginBottom: 26 }}>
              {C.games.tank.body}
            </p>
            <dl style={{
              display: "grid",
              gridTemplateColumns: mobile ? "auto 1fr" : "repeat(2, auto 1fr)",
              rowGap: 8, columnGap: 22,
              fontFamily: "var(--v2-font-mono)", fontSize: 11, color: "var(--v2-ink-2)", marginBottom: 26,
            }}>
              {C.games.tank.meta.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt style={{ color: "var(--v2-ink-3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{k}</dt>
                  <dd style={{ color: "var(--v2-ink)" }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <a href="#" style={{ fontFamily: "var(--v2-font-mono)", fontSize: 12, color: "var(--v2-ink)", borderBottom: "1.5px solid var(--v2-accent)", paddingBottom: 3, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {C.games.tank.store} →
            </a>
          </div>
          <figure style={{ margin: 0, order: mobile ? 1 : 2 }}>
            <div style={{ border: "1px solid var(--v2-ink)" }}>
              <img src="assets/images/tank-1990-hero-poster.png" className="pixelated" alt=""
                style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }} />
            </div>
            <figcaption style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>fig. 02 — big map, "1990" in bricks</span>
              <span>★ 4.3 · google play</span>
            </figcaption>
          </figure>
        </article>

        {/* Game 2 — Pixel Tanks */}
        <article style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1.2fr 1fr",
          gap, marginBottom: mobile ? 56 : 100, alignItems: "start",
        }}>
          <figure style={{ margin: 0 }}>
            <div style={{ border: "1px solid var(--v2-ink)" }}>
              <img src="assets/images/pixel-tanks-keyart.jpeg" alt=""
                style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block", filter: "saturate(0.95)" }} />
            </div>
            <figcaption style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 10 }}>
              fig. 03 — key art, work in progress
            </figcaption>
          </figure>
          <div>
            <MonoLabel color="var(--v2-accent)">{C.games.pix.kicker}</MonoLabel>
            <h3 style={{ fontFamily: "var(--v2-font-display)", fontWeight: 400, fontSize: gameH3b, letterSpacing: "-0.025em", lineHeight: 0.96, marginTop: 16, marginBottom: 6 }}>
              {C.games.pix.title}
            </h3>
            <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: mobile ? 17 : 20, color: "var(--v2-ink-2)", marginBottom: 20 }}>
              {C.games.pix.sub}
            </p>
            <p style={{ fontSize: bodySz, lineHeight: 1.65, color: "var(--v2-ink-2)", marginBottom: 22, maxWidth: 420 }}>
              {C.games.pix.body}
            </p>
            <MonoLabel size={10}>○ {C.games.pix.when}</MonoLabel>
          </div>
        </article>

        {/* Game 3 — Swamp Defense */}
        <article style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1.2fr",
          gap, alignItems: "start",
        }}>
          <div style={{ order: mobile ? 2 : 1 }}>
            <MonoLabel color="var(--v2-accent)">{C.games.swamp.kicker}</MonoLabel>
            <h3 style={{
              fontFamily: "var(--v2-font-display)", fontWeight: 400,
              fontSize: gameH3b, letterSpacing: "-0.025em", lineHeight: 0.96,
              marginTop: 16, marginBottom: 6,
            }}>
              {C.games.swamp.title}
            </h3>
            <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: mobile ? 17 : 20, color: "var(--v2-ink-2)", marginBottom: 20 }}>
              {C.games.swamp.sub}
            </p>
            <p style={{ fontSize: bodySz, lineHeight: 1.65, color: "var(--v2-ink-2)", marginBottom: 22, maxWidth: 420 }}>
              {C.games.swamp.body}
            </p>
            <MonoLabel size={10}>○ {C.games.swamp.when}</MonoLabel>
          </div>
          <figure style={{ margin: 0, order: mobile ? 1 : 2 }}>
            <div style={{ border: "1px solid var(--v2-ink)" }}>
              <img src="assets/images/swamp-defense-concept.jpg" alt=""
                style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }} />
            </div>
            <figcaption style={{ fontFamily: "var(--v2-font-mono)", fontSize: 10, color: "var(--v2-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 10 }}>
              fig. 04 — level layout, bronze age settlement
            </figcaption>
          </figure>
        </article>
      </Sect>

      {/* ─── ROADMAP ─── */}
      <Sect num="02" kicker={isRu ? "ближайшее" : "upcoming"}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          flexWrap: "wrap", gap: 16,
          marginBottom: mobile ? 44 : tablet ? 60 : 80,
        }}>
          <h2 style={{ fontFamily: "var(--v2-font-display)", fontWeight: 400, fontSize: h2Med, letterSpacing: "-0.025em", lineHeight: 1, maxWidth: 900 }}>
            {C.roadmap.heading}
          </h2>
          {!mobile && (
            <button onClick={openSuggest} style={{
              padding: "10px 16px",
              border: "1px solid var(--v2-ink)",
              background: "transparent",
              color: "var(--v2-ink)",
              fontFamily: "var(--v2-font-mono)", fontSize: 12, fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>{ST.cta} →</button>
          )}
        </div>

        {mobile ? (
          /* Vertical timeline for mobile */
          <ol style={{ position: "relative", padding: 0, margin: 0, listStyle: "none" }}>
            <span style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 1, background: "var(--v2-ink)" }} />
            {C.roadmap.items.map((it, i) => {
              const isDone = it.state === "done" || it.state === "готово";
              const color = isDone ? "var(--v2-accent-2)" : i === 1 ? "var(--v2-accent)" : "var(--v2-ink-3)";
              return (
                <li key={i} style={{ position: "relative", paddingLeft: 30, paddingBottom: 28 }}>
                  <span style={{ position: "absolute", left: 0, top: 5, width: 13, height: 13, borderRadius: "50%", background: color, boxShadow: "0 0 0 3px var(--v2-paper)" }} />
                  <MonoLabel color={color}>{it.date} · {it.state}</MonoLabel>
                  <div style={{ fontFamily: "var(--v2-font-display)", fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1.2, marginTop: 6, marginBottom: 6 }}>{it.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--v2-ink-2)" }}>{it.note}</p>
                </li>
              );
            })}
            {/* Third slot — open suggestion */}
            <li style={{ position: "relative", paddingLeft: 30 }}>
              <span style={{ position: "absolute", left: 0, top: 5, width: 13, height: 13, borderRadius: "50%", border: "2px dashed var(--v2-accent)", boxShadow: "0 0 0 3px var(--v2-paper)" }} />
              <button onClick={openSuggest} style={{
                padding: "12px 16px",
                border: "1px dashed var(--v2-accent)", background: "transparent",
                color: "var(--v2-accent)",
                fontFamily: "var(--v2-font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", textAlign: "left",
              }}>{isRu ? "✍ предложи свою идею" : "✍ suggest your idea"} →</button>
            </li>
          </ol>
        ) : (
          <div style={{ position: "relative", paddingTop: 30 }}>
            <span style={{ position: "absolute", left: 0, right: 0, top: 22, height: 1, background: "var(--v2-ink)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tablet ? 32 : 56 }}>
              {C.roadmap.items.map((it, i) => {
                const isDone = it.state === "done" || it.state === "готово";
                const color = isDone ? "var(--v2-accent-2)" : i === 1 ? "var(--v2-accent)" : "var(--v2-ink-3)";
                return (
                  <div key={i} style={{ position: "relative", paddingTop: 30 }}>
                    <span style={{ position: "absolute", left: 0, top: 16, width: 14, height: 14, borderRadius: "50%", background: color, boxShadow: "0 0 0 4px var(--v2-paper)" }} />
                    <MonoLabel color={color}>{it.date} · {it.state}</MonoLabel>
                    <div style={{ fontFamily: "var(--v2-font-display)", fontSize: tablet ? 22 : 26, letterSpacing: "-0.01em", lineHeight: 1.15, marginTop: 12, marginBottom: 8 }}>
                      {it.title}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--v2-ink-2)" }}>{it.note}</p>
                  </div>
                );
              })}
              {/* Third column — open suggestion card */}
              <div style={{ position: "relative", paddingTop: 30 }}>
                <span style={{ position: "absolute", left: 0, top: 16, width: 14, height: 14, borderRadius: "50%", border: "2px dashed var(--v2-accent)", boxShadow: "0 0 0 4px var(--v2-paper)" }} />
                <button onClick={openSuggest} style={{
                  textAlign: "left", cursor: "pointer", padding: 0,
                  background: "transparent", border: 0, color: "inherit",
                  display: "block", width: "100%",
                }}>
                  <MonoLabel color="var(--v2-accent)">{isRu ? "вакантно · ?" : "open · ?"}</MonoLabel>
                  <div style={{
                    fontFamily: "var(--v2-font-display)", fontStyle: "italic",
                    fontSize: tablet ? 22 : 26, letterSpacing: "-0.01em", lineHeight: 1.15,
                    marginTop: 12, marginBottom: 8, color: "var(--v2-ink)",
                  }}>
                    {isRu ? "Твоя идея?" : "Your idea?"}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--v2-ink-2)", marginBottom: 14 }}>
                    {isRu
                      ? "что хотел бы увидеть на этом слоте — расскажи."
                      : "what would you put in this slot — tell me."}
                  </p>
                  <span style={{
                    display: "inline-block",
                    padding: "8px 14px",
                    border: "1px dashed var(--v2-accent)",
                    color: "var(--v2-accent)",
                    fontFamily: "var(--v2-font-mono)", fontSize: 11,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                  }}>{isRu ? "✍ предложи →" : "✍ suggest →"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Sect>

      {/* ─── RULES ─── */}
      <Sect num="03" kicker={isRu ? "принципы" : "principles"}>
        <h2 style={{ fontFamily: "var(--v2-font-display)", fontWeight: 400, fontSize: h2Med, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: mobile ? 36 : tablet ? 56 : 72, maxWidth: 900 }}>
          {C.rules.heading}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 24 : 48,
          columnGap: mobile ? undefined : tablet ? 48 : 80,
        }}>
          {C.rules.items.map(([t, d], i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: mobile ? "44px 1fr" : "60px 1fr",
              gap: mobile ? 14 : 20,
              alignItems: "baseline",
              paddingBottom: 22,
              borderBottom: "1px solid var(--v2-rule)",
            }}>
              <span style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: ruleNum, color: "var(--v2-accent)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                {String(i+1).padStart(2,"0")}
              </span>
              <div>
                <div style={{ fontFamily: "var(--v2-font-display)", fontSize: ruleH3, letterSpacing: "-0.015em", marginBottom: 4 }}>{t}.</div>
                <p style={{ fontSize: mobile ? 13 : 14, lineHeight: 1.55, color: "var(--v2-ink-2)" }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Sect>

      {/* ─── NUMBERS ─── */}
      <Sect num="04" kicker={C.numbers.sect} last>
        <h2 style={{ fontFamily: "var(--v2-font-display)", fontWeight: 400, fontSize: h2Med, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: mobile ? 32 : tablet ? 48 : 64, maxWidth: 900 }}>
          {C.numbers.heading}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "auto 1fr 1fr 1fr",
          gap: mobile ? 24 : tablet ? 36 : 60,
          alignItems: "end",
          paddingBottom: mobile ? 22 : 28,
          borderBottom: "1px solid var(--v2-ink)",
        }}>
          <div>
            <span style={{ fontFamily: "var(--v2-font-display)", fontSize: numHero, letterSpacing: "-0.04em", lineHeight: 0.85, color: "var(--v2-accent)", display: "block" }}>
              {C.numbers.rating}
            </span>
            <div style={{ color: "var(--v2-accent)", fontSize: 18, letterSpacing: "0.16em", marginTop: 6 }}>★ ★ ★ ★ <span style={{ opacity: 0.3 }}>★</span></div>
            <MonoLabel size={10}>{C.numbers.ratingNote}</MonoLabel>
          </div>
          {mobile ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, paddingTop: 14, borderTop: "1px solid var(--v2-rule)" }}>
              {C.numbers.stats.map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: "var(--v2-font-display)", fontSize: numStat, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 6 }}>{v}</div>
                  <MonoLabel size={10}>{k}</MonoLabel>
                </div>
              ))}
            </div>
          ) : (
            C.numbers.stats.slice(0, 3).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: "var(--v2-font-display)", fontSize: numStat, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 8 }}>{v}</div>
                <MonoLabel size={10}>{k}</MonoLabel>
              </div>
            ))
          )}
        </div>
        <p style={{ fontFamily: "var(--v2-font-display)", fontStyle: "italic", fontSize: mobile ? 14 : 16, color: "var(--v2-ink-3)", marginTop: 18 }}>
          * {C.numbers.footnote}
        </p>
      </Sect>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: mobile ? "32px 18px" : `44px ${padX}px`,
        borderTop: "1px solid var(--v2-ink)",
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: mobile ? "flex-start" : "center",
        gap: mobile ? 14 : 18, flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: "var(--v2-font-mono)", fontSize: 11, color: "var(--v2-ink-2)", letterSpacing: "0.14em" }}>
          {C.footer.copy}
        </span>
        <div style={{ display: "flex", gap: mobile ? 16 : 22, alignItems: "center", flexWrap: "wrap", fontFamily: "var(--v2-font-mono)", fontSize: 11, color: "var(--v2-ink-2)", letterSpacing: "0.14em" }}>
          {C.footer.links.map(([t, h]) => <a key={t} href={h} style={{ color: "inherit" }}>{t}</a>)}
        </div>
      </footer>

      {/* ─── Suggestion modal (overlays the artboard) ─── */}
      <SuggestModal state={suggest} setState={setSuggest} lang={lang} mobile={mobile} />
    </div>
  );
}

Object.assign(window, { PageQuiet });
