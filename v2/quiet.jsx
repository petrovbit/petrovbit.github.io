/* PetrovBit — material language
   Общая оболочка строится на материальном языке Pixel Tanks: сталь,
   текстурный кирпич, поле и карта. У каждой игры внутри каталога остаётся
   собственный диалект; Tank 1990 сохраняет алгоритмический кирпичный шрифт.
   Exports: window.PageQuiet
*/

function PageQuiet({ lang = "en", setLang, mobile = false, tablet = false }) {
  const C = PB_CONTENT[lang];
  const ST = (typeof SUGGEST_COPY !== "undefined" ? SUGGEST_COPY[lang] : { cta: "+ suggest yours" });
  const isRu = lang === "ru";
  const [suggest, setSuggest] = React.useState("closed");
  const openSuggest = () => setSuggest("form");

  /* — масштаб — */
  const padX     = mobile ? 18 : tablet ? 40 : 72;
  const sectPadV = mobile ? 52 : tablet ? 68 : 88;
  /* Кирпичный заголовок меряется не кеглем, а ячейкой кладки: глиф = 8 ячеек,
     буква = 16 кирпичей в высоту. Ячейку подбирает сам BrickText по ширине,
     здесь только потолок — иначе на широком экране заголовок съест первый экран. */
  const h2Size   = mobile ? 24 : tablet ? 30 : 36;
  const h3Size   = mobile ? 22 : tablet ? 28 : 34;
  const bodySz   = mobile ? 14 : tablet ? 15 : 15.5;
  const gap      = mobile ? 28 : tablet ? 36 : 56;
  const narrow   = mobile || tablet;   /* одна колонка */

  /* Каждое предложение слогана — самостоятельная строка/плашка. В отличие
     от Tank 1990 здесь намеренно нет 8-битного BrickText: это голос студии. */
  const heroSentences = (C.tagline.match(/[^.]+\.?/g) || [C.tagline]).map(s => s.trim()).filter(Boolean);

  const mono = (size = 11, color) => ({
    fontFamily: "var(--v2-font-mono)", fontSize: size,
    letterSpacing: "0.14em", textTransform: "uppercase",
    color: color || "var(--v2-ink-3)",
  });

  /* Фактурный разделитель из production-тайла Pixel Tanks.
     thin = короткий материальный шов; полноразмерная полоса на странице одна. */
  const Course = ({ thin }) => (
    <div className={thin ? "pb-course pb-course--thin" : "pb-course"} aria-hidden="true" />
  );

  /* Номер секции как маленькая стальная игровая плитка. */
  const Tile = ({ children }) => <span className="pb-section-tile">{children}</span>;

  const Sect = ({ id, num, kicker, title, sub, aside, children, band }) => (
    <section id={id} className={band ? "pb-section pb-section--band" : "pb-section"} style={{
      padding: `${sectPadV}px ${padX}px`,
      background: band ? "var(--v2-paper-2)" : "transparent",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: mobile ? 18 : 22,
      }}>
        <Tile>{num}</Tile>
        <span style={mono(11)}>{kicker}</span>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        flexWrap: "wrap", gap: 16,
        marginBottom: mobile ? 34 : tablet ? 44 : 56,
      }}>
        <h2 style={{
          fontFamily: "var(--v2-font-display)", fontWeight: 700,
          fontSize: h2Size, lineHeight: 1.1, letterSpacing: "-0.02em",
          maxWidth: 720,
        }}>
          {title}
          {sub && <span style={{ color: "var(--v2-ink-3)" }}> {sub}</span>}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );

  /* Прогресс кирпичами: 6 ячеек, залитые = сделано. */
  const BrickBar = ({ filled, total = 6, dashed = false }) => (
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          flex: 1, height: 10,
          background: dashed ? "transparent" : i < filled ? "var(--v2-brick)" : "var(--v2-brick-deep)",
          border: dashed ? "1px dashed var(--v2-brick)" : "none",
        }} />
      ))}
    </div>
  );

  const btnSolid = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: mobile ? "14px 18px" : "13px 20px",
    background: "var(--v2-brick)", color: "#F2EFE6",
    fontFamily: "var(--v2-font-mono)", fontSize: 12, fontWeight: 500,
    letterSpacing: "0.14em", textTransform: "uppercase",
    border: "2px solid var(--v2-brick)",
  };
  const btnGhost = {
    ...btnSolid,
    background: "transparent", color: "var(--v2-ink)",
    border: "2px solid var(--v2-rule)",
  };

  /* — каталог — */
  const games = [
    {
      key: "tank", g: C.games.tank,
      img: "assets/images/tank-1990-hero-poster.png", pixelated: true,
      alt: "Tank 1990: Big Map Battle — бой на большой карте",
      cap: "fig. 01 — big map",
      capRight: "★ 4.3 · google play",
    },
    {
      key: "pix", g: C.games.pix,
      img: "assets/images/pixel-tanks-keyart.jpeg", pixelated: false,
      alt: "Pixel Tanks: Steel Frontier — key art",
      cap: "fig. 02 — key art",
      capRight: "60 fps",
    },
    {
      key: "swamp", g: C.games.swamp,
      img: "assets/images/swamp-defense-concept.jpg", pixelated: false,
      alt: "Swamp Defense — поселение бронзового века",
      cap: "fig. 03 — level layout",
      capRight: isRu ? "в работе" : "wip",
    },
  ];

  const Frame = ({ src, alt, pixelated, ratio = "16/10", children }) => (
    <div className="pb-frame" style={{ aspectRatio: ratio }}>
      {children || (
        <img src={src} alt={alt} className={pixelated ? "pixelated" : undefined}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}
    </div>
  );

  const Caption = ({ left, right }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", gap: 12,
      marginTop: 12, ...mono(10, "var(--v2-ink-4)"),
    }}>
      <span>{left}</span>
      {/* На 390px правая подпись сталкивается с левой — оставляем только левую. */}
      {right && !mobile && <span>{right}</span>}
    </div>
  );

  /* Герой: текст и кадр как два блока — на телефоне кадр
     поднимается сразу под заголовок, чтобы игру было видно без скролла. */
  const heroCopy = (
    <React.Fragment>
      <p style={{
        fontSize: bodySz, lineHeight: 1.65, color: "var(--v2-ink-2)",
        maxWidth: 460, marginBottom: mobile ? 24 : 28,
      }}>
        {C.intro}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="#games" style={btnSolid}>{C.seeGames} →</a>
        <a href="#plan" style={btnGhost}>{isRu ? "что дальше" : "what's next"}</a>
      </div>
    </React.Fragment>
  );

  const heroFrame = (
    <div>
      <Frame ratio="20/9">
        <GameVideo posterOnly={mobile} />
      </Frame>
      <Caption left="fig. 00 — tank 1990, big map mode"
        right={isRu ? "снято на телефон" : "captured on phone"} />
    </div>
  );

  return (
    <div className="v2" style={{ background: "var(--v2-paper)", color: "var(--v2-ink)", minHeight: "100%" }}>

      {/* ─── ШАПКА ─── */}
      <header className="pb-site-header" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, padding: mobile ? "14px 18px" : `18px ${padX}px`,
        borderBottom: "1px solid var(--v2-rule)",
      }}>
        <a className="pb-brand" href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="pb-brand-mark" aria-hidden="true">
            <img src="assets/images/materials/pixel-tanks/tank-steel.png" alt="" />
          </span>
          <span style={{
            fontFamily: "var(--v2-font-display)", fontWeight: 700,
            fontSize: mobile ? 14 : 16, letterSpacing: "-0.02em",
          }}>petrovbit</span>
        </a>

        {!mobile && !tablet && (
          <nav className="pb-site-nav" style={{ display: "flex", gap: 26 }}>
            {[
              ["#games",   isRu ? "каталог"  : "catalog"],
              ["#plan",    isRu ? "план"     : "plan"],
              ["#rules",   isRu ? "правила"  : "rules"],
              ["#numbers", isRu ? "цифры"    : "numbers"],
            ].map(([h, t]) => (
              <a key={h} href={h} style={mono(11, "var(--v2-ink-2)")}>{t}</a>
            ))}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16 }}>
          <LangToggle lang={lang} setLang={setLang} />
          <ThemeToggle lang={lang} />
        </div>
      </header>

      {/* ─── ГЕРОЙ ─── */}
      <section id="top" className="pb-hero" style={{
        padding: `${mobile ? 34 : tablet ? 48 : 60}px ${padX}px ${mobile ? 44 : tablet ? 60 : 76}px`,
      }}>
        <div style={{ ...mono(10, "var(--v2-ink-4)"), marginBottom: mobile ? 16 : 20 }}>
          {C.by}
        </div>

        <h1 className="pb-hero-title" style={{ margin: 0, marginBottom: mobile ? 26 : 34 }}>
          {heroSentences.map((line, i) => (
            <span className={i === 1 ? "pb-hero-title__line pb-hero-title__line--accent" : "pb-hero-title__line"} key={line}>
              {line}
            </span>
          ))}
        </h1>

        <div className="pb-hero-map" aria-hidden="true">
          <span className="pb-hero-map__track" />
          <img src="assets/images/materials/pixel-tanks/tank-steel.png" alt="" />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : tablet ? "1fr" : "minmax(0, 5fr) minmax(0, 7fr)",
          gap: mobile ? 26 : tablet ? 40 : 56,
          alignItems: "start",
        }}>
          {narrow ? (
            <React.Fragment>
              {heroFrame}
              <div>{heroCopy}</div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>{heroCopy}</div>
              {heroFrame}
            </React.Fragment>
          )}
        </div>
      </section>

      <Course />

      {/* ─── 01 КАТАЛОГ ─── */}
      <Sect id="games" num="01" kicker={C.games.sect}
        title={C.games.heading} sub={C.games.headingSub}>
        {games.map(({ key, g, img, alt, pixelated, cap, capRight }, i) => {
          const flip = i % 2 === 1;
          const text = (
            <div className={`pb-game-copy pb-game-copy--${key}`}>
              <span className="pb-game-kicker" style={{
                display: "inline-block", padding: "4px 8px", marginBottom: 14,
                border: "1px solid var(--v2-rule)", ...mono(10, "var(--v2-ink-2)"),
              }}>{g.kicker}</span>
              {/* Названия игр и пунктов плана — Plex Sans: Unbounded хорош на
                  крупном кегле, а на 18–34px в карточках просто шумит.
                  Исключение — Tank 1990: его название складывается тем же
                  игровым алгоритмом из кирпичей, что прежний hero. */}
              {key === "tank" ? (
                <h3 className="pb-tank-title" style={{ marginBottom: mobile ? 12 : 16 }}>
                  <span className="pb-sr-only">{g.title}</span>
                  <BrickText
                    lines={["TANK", "1990"]}
                    cell={mobile ? 4 : 6}
                    lineGap={1}
                    decorative
                  />
                </h3>
              ) : (
                <h3 className={key === "pix" ? "pb-pixel-title" : "pb-swamp-title"} style={{
                  fontFamily: "var(--v2-font-body)", fontWeight: 600,
                  fontSize: h3Size, lineHeight: 1.1, letterSpacing: "-0.015em",
                  marginBottom: 6,
                }}>{g.title}</h3>
              )}
              <div className="pb-game-subtitle" style={{ ...mono(12, "var(--v2-brick-ink)"), marginBottom: 18 }}>{g.sub}</div>
              <p className="pb-game-description" style={{
                fontSize: bodySz, lineHeight: 1.65, color: "var(--v2-ink-2)",
                maxWidth: 480, marginBottom: 22,
              }}>{g.body}</p>

              {g.meta && (
                <dl className="pb-game-meta" style={{
                  display: "grid",
                  gridTemplateColumns: mobile ? "auto 1fr" : "repeat(2, auto 1fr)",
                  rowGap: 9, columnGap: 20, marginBottom: 24,
                  fontFamily: "var(--v2-font-mono)", fontSize: 11,
                }}>
                  {g.meta.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt style={{ color: "var(--v2-ink-4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{k}</dt>
                      <dd style={{ color: "var(--v2-ink)" }}>{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              )}

              {g.when && (
                <div style={{ ...mono(10, "var(--v2-ink-3)"), marginBottom: 20 }}>
                  ○ {g.when}
                </div>
              )}

              <StoreBadges game={key} lang={lang} />
            </div>
          );
          const figure = (
            <figure className="pb-game-figure" style={{ margin: 0 }}>
              <Frame src={img} alt={alt} pixelated={pixelated} />
              <Caption left={cap} right={capRight} />
            </figure>
          );
          return (
            <article key={key}
              className={`pb-game-card pb-game-card--${key}`}
              style={{
              display: "grid",
              gridTemplateColumns: mobile || tablet ? "1fr" : flip ? "minmax(0, 5fr) minmax(0, 7fr)" : "minmax(0, 7fr) minmax(0, 5fr)",
              gap, alignItems: "start",
              marginBottom: i < games.length - 1 ? (mobile ? 52 : tablet ? 64 : 84) : 0,
            }}>
              {key === "pix" && <img className="pb-game-ornament pb-game-ornament--tank" src="assets/images/materials/pixel-tanks/tank-steel.png" alt="" aria-hidden="true" />}
              {key === "swamp" && <React.Fragment>
                <img className="pb-game-ornament pb-game-ornament--watchtower" src="assets/images/materials/swamp-defense/watchtower.png" alt="" aria-hidden="true" />
                <img className="pb-game-ornament pb-game-ornament--emberwatch" src="assets/images/materials/swamp-defense/emberwatch.png" alt="" aria-hidden="true" />
              </React.Fragment>}
              {mobile || tablet
                ? <React.Fragment>{figure}{text}</React.Fragment>
                : flip
                  ? <React.Fragment>{text}{figure}</React.Fragment>
                  : <React.Fragment>{figure}{text}</React.Fragment>}
            </article>
          );
        })}
      </Sect>

      <Course thin />

      {/* ─── 02 ПЛАН ─── */}
      <Sect id="plan" num="02" kicker={C.roadmap.sect} title={C.roadmap.heading}
        aside={!mobile && (
          <button onClick={openSuggest} style={btnGhost}>{ST.cta} →</button>
        )}>
        <div className="pb-roadmap-grid" style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : tablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: mobile ? 30 : tablet ? 32 : 36,
        }}>
          {C.roadmap.items.map((it, i) => {
            const isDone = it.state === "done" || it.state === "готово";
            const isBeta = it.state === "beta" || it.state === "тест";
            const filled = isDone ? 6 : isBeta ? 4 : 2;
            const color = isDone ? "var(--v2-accent-2)" : isBeta ? "var(--v2-amber)" : "var(--v2-ink-3)";
            return (
              <div className={`pb-roadmap-card pb-roadmap-card--${isDone ? "done" : isBeta ? "beta" : "dev"}`} key={i}>
                <BrickBar filled={filled} />
                <div style={{ ...mono(10, color), marginBottom: 10 }}>{it.date} · {it.state}</div>
                <div style={{
                  fontFamily: "var(--v2-font-body)", fontWeight: 600,
                  fontSize: mobile ? 17 : 18, lineHeight: 1.25, letterSpacing: "-0.01em",
                  marginBottom: 8,
                }}>{it.title}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--v2-ink-2)" }}>{it.note}</p>
              </div>
            );
          })}

          {/* Свободный слот — предложить идею */}
          <div className="pb-roadmap-card pb-roadmap-card--open">
            <BrickBar filled={0} dashed />
            <div style={{ ...mono(10, "var(--v2-brick-ink)"), marginBottom: 10 }}>
              {isRu ? "вакантно · ?" : "open · ?"}
            </div>
            <div style={{
              fontFamily: "var(--v2-font-body)", fontWeight: 600,
              fontSize: mobile ? 17 : 18, lineHeight: 1.25, letterSpacing: "-0.01em",
              marginBottom: 8,
            }}>{isRu ? "Твоя идея?" : "Your idea?"}</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--v2-ink-2)", marginBottom: 14 }}>
              {isRu ? "что хотел бы увидеть на этом слоте — расскажи."
                    : "what would you put in this slot — tell me."}
            </p>
            <button onClick={openSuggest} style={{
              padding: "9px 14px", border: "1px dashed var(--v2-brick)",
              ...mono(11, "var(--v2-brick-ink)"),
            }}>{isRu ? "✍ предложи →" : "✍ suggest →"}</button>
          </div>
        </div>
      </Sect>

      <Course thin />

      {/* ─── 03 ПРАВИЛА ─── */}
      <Sect id="rules" num="03" kicker={C.rules.sect} title={C.rules.heading}>
        <div className="pb-rules-grid" style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)",
          gap: mobile ? 24 : tablet ? 32 : 44,
        }}>
          {C.rules.items.map(([t, d], i) => (
            <div className="pb-rule-card" key={i} style={{
              borderLeft: "3px solid var(--v2-brick)",
              paddingLeft: mobile ? 16 : 20,
            }}>
              <div style={{
                fontFamily: "var(--v2-font-display)", fontWeight: 900,
                fontSize: mobile ? 26 : 32, lineHeight: 1,
                color: "var(--v2-brick)", marginBottom: 12,
              }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{
                fontFamily: "var(--v2-font-display)", fontWeight: 700,
                fontSize: mobile ? 16 : 18, lineHeight: 1.25, letterSpacing: "-0.02em",
                marginBottom: 8,
              }}>{t}</div>
              <p style={{ fontSize: bodySz, lineHeight: 1.6, color: "var(--v2-ink-2)" }}>{d}</p>
            </div>
          ))}
        </div>
      </Sect>

      <Course thin />

      {/* ─── 04 ЦИФРЫ ─── */}
      <Sect id="numbers" num="04" kicker={C.numbers.sect} title={C.numbers.heading} band>
        <div className="pb-numbers-panel" style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "auto repeat(3, 1fr)",
          gap: mobile ? 26 : tablet ? 32 : 48,
          alignItems: "end",
          paddingBottom: mobile ? 22 : 26,
          borderBottom: "2px solid var(--v2-rule)",
        }}>
          <div>
            <span className="pb-brick-text pb-brick-text--xl" style={{
              fontFamily: "var(--v2-font-display)", fontWeight: 900,
              fontSize: mobile ? 52 : tablet ? 60 : 72, lineHeight: 0.9,
              letterSpacing: "-0.05em", display: "block",
            }}>{C.numbers.rating}</span>
            <div style={{ color: "var(--v2-brick)", fontSize: 16, letterSpacing: "0.18em", margin: "10px 0 6px" }}>
              ★ ★ ★ ★ <span style={{ opacity: 0.3 }}>★</span>
            </div>
            <div style={mono(10, "var(--v2-ink-3)")}>{C.numbers.ratingNote}</div>
          </div>

          {mobile ? (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
              paddingTop: 18, borderTop: "1px solid var(--v2-rule)",
            }}>
              {C.numbers.stats.map(([k, v]) => (
                <div key={k}>
                  <div style={{
                    fontFamily: "var(--v2-font-display)", fontWeight: 700,
                    fontSize: 28, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8,
                  }}>{v}</div>
                  <div style={mono(10, "var(--v2-ink-3)")}>{k}</div>
                </div>
              ))}
            </div>
          ) : (
            C.numbers.stats.slice(0, 3).map(([k, v]) => (
              <div key={k}>
                <div style={{
                  fontFamily: "var(--v2-font-display)", fontWeight: 700,
                  fontSize: tablet ? 34 : 42, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 10,
                }}>{v}</div>
                <div style={mono(10, "var(--v2-ink-3)")}>{k}</div>
              </div>
            ))
          )}
        </div>
        <p style={{ fontSize: mobile ? 13 : 14, color: "var(--v2-ink-3)", marginTop: 18 }}>
          * {C.numbers.footnote}
        </p>
      </Sect>

      {/* ─── ПОДВАЛ ─── */}
      <footer className="pb-site-footer" style={{
        padding: mobile ? "30px 18px" : `36px ${padX}px`,
        borderTop: "1px solid var(--v2-rule)",
        display: "flex", flexWrap: "wrap",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: mobile ? "flex-start" : "center",
        gap: mobile ? 16 : 18,
      }}>
        <span style={mono(11, "var(--v2-ink-3)")}>{C.footer.copy}</span>
        <div style={{ display: "flex", gap: mobile ? 16 : 22, flexWrap: "wrap", alignItems: "center" }}>
          {C.footer.links.map(([t, h]) => (
            <a key={t} href={h} style={mono(11, "var(--v2-ink-2)")}>{t}</a>
          ))}
        </div>
      </footer>

      <SuggestModal state={suggest} setState={setSuggest} lang={lang} mobile={mobile} />
    </div>
  );
}

Object.assign(window, { PageQuiet });
