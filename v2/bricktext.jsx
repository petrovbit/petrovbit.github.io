/* Текст, выложенный кирпичами — порт алгоритма из Tank 1990.

   Оригинал: ResourceLoader.createBricksText16() + getTileNumber() +
   Render.drawBrickText(). Суть в трёх шагах:

   1. Глиф пиксельного шрифта (16x16, альфа-маска) читается блоками 2x2 пикселя.
      Каждый блок — одна ячейка кирпича, значит на глиф приходится 8x8 ячеек.
   2. Четыре альфа-бита блока решают, какие ЧЕТВЕРТИ спрайта кирпича рисовать.
      В игре это делает таблица getTileNumber -> menuBrickTiles[]; она заодно
      разворачивает Y под камеру LibGDX. В браузере разворот не нужен, поэтому
      биты кладутся напрямую: левый-верхний пиксель -> левая-верхняя четверть.
   3. Ячейка рисуется тем же спрайтом кирпича, что и стена, — отсюда
      «обкусанные» кирпичи по краям: буква не вырезана из текстуры,
      а сложена из кирпичей.

   Шрифт лежит в v2/brickfont.js (вытащен из assets игры).
   Exports: window.BrickText, window.pbBrickGrid, window.pbBrickHeight,
            window.pbTextCols, window.pbWrap
*/

const PB_CELLS = 8;      /* ячеек кирпича на глиф */
const PB_GLYPH = 16;     /* пикселей в глифе */

/* Глиф -> 16 строк по 16 бит, старший бит = левый пиксель. */
function pbGlyphRows(ch) {
  const F = window.PB_BRICK_FONT;
  if (!F) return null;
  const hex = F.glyphs[ch] || F.glyphs[ch.toUpperCase()];
  if (!hex) return null;
  const rows = [];
  for (let r = 0; r < PB_GLYPH; r++) rows.push(parseInt(hex.slice(r * 4, r * 4 + 4), 16));
  return rows;
}

/* Строка -> сетка ячеек [col][row], значение = битовая маска четвертей
   (8=tl, 4=tr, 2=bl, 1=br). Пустые колонки по краям срезаются, иначе строки
   разъезжаются по левому краю из-за боковых пробелов внутри глифов. */
function pbBrickGrid(text) {
  const cols = text.length * PB_CELLS;
  const grid = [];
  for (let i = 0; i < cols; i++) grid.push(new Array(PB_CELLS).fill(0));

  for (let a = 0; a < text.length; a++) {
    const rows = pbGlyphRows(text[a]);
    if (!rows) continue;                    /* пробел и всё, чего нет в шрифте */
    for (let bx = 0; bx < PB_CELLS; bx++) {
      for (let by = 0; by < PB_CELLS; by++) {
        const on = (x, y) => (rows[y] >> (15 - x)) & 1;
        const tl = on(bx * 2,     by * 2);
        const tr = on(bx * 2 + 1, by * 2);
        const bl = on(bx * 2,     by * 2 + 1);
        const br = on(bx * 2 + 1, by * 2 + 1);
        grid[a * PB_CELLS + bx][by] = (tl << 3) | (tr << 2) | (bl << 1) | br;
      }
    }
  }

  let first = 0, last = cols - 1;
  const empty = (c) => grid[c].every((v) => v === 0);
  while (first <= last && empty(first)) first++;
  while (last >= first && empty(last)) last--;
  return first > last ? [] : grid.slice(first, last + 1);
}

/* Ширина строки в ячейках — нужна снаружи, чтобы разбить текст по строкам
   до отрисовки: длина в символах врёт, глифы имеют разные боковые пробелы. */
function pbTextCols(text) {
  return pbBrickGrid(text).length;
}

/* Перенос по словам: складываем слова, пока строка влезает в maxCols ячеек.
   Нужен на узких экранах — «НОЛЬ МАРКЕТИНГА.» это 124 ячейки, на 390px это
   ячейка в 2px, то есть буква высотой 16px. */
function pbWrap(sentences, maxCols) {
  if (!maxCols) return sentences.slice();
  const out = [];
  sentences.forEach((sent) => {
    let cur = "";
    sent.split(/\s+/).filter(Boolean).forEach((w) => {
      const test = cur ? cur + " " + w : w;
      if (cur && pbTextCols(test) > maxCols) { out.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) out.push(cur);
  });
  return out;
}

/* Высота блока в пикселях — нужна снаружи, чтобы зарезервировать место
   до загрузки текстуры и не дёргать вёрстку. */
function pbBrickHeight(lineCount, cell, lineGap) {
  return lineCount * PB_CELLS * cell + (lineCount - 1) * lineGap * cell;
}

/* Кэш картинки кирпича: один Image на URL, иначе каждая перерисовка
   (смена языка, ресайз) заново дёргает сеть. */
const pbTileCache = {};
function pbTile(src, onReady) {
  let img = pbTileCache[src];
  if (!img) {
    img = new Image();
    img.src = src;
    pbTileCache[src] = img;
  }
  if (img.complete && img.naturalWidth) onReady(img);
  else img.addEventListener("load", () => onReady(img), { once: true });
  return img;
}

/**
 * lines   — массив строк, каждая своя строка кладки
 * cell    — сторона ячейки в CSS-пикселях; высота глифа = 8 ячеек.
 *           Не задан — подбирается по ширине контейнера
 * minCell / maxCell — границы автоподбора
 * lineGap — межстрочный интервал в ячейках
 * tile    — URL спрайта кирпича (квадрат: 2 ряда x 2 кирпича)
 */
function BrickText({ lines, cell, minCell = 2, maxCell = 12, lineGap = 2,
                     tile = "assets/images/brick-tile.png", alt, decorative, style }) {
  const ref = React.useRef(null);
  const boxRef = React.useRef(null);
  const [avail, setAvail] = React.useState(0);

  const grids = React.useMemo(() => lines.map(pbBrickGrid), [lines.join("|")]);
  const cols = grids.reduce((m, g) => Math.max(m, g.length), 0);

  /* Ширину меряем у самого блока: между брейкпоинтами она плывёт, и считать её
     от window.innerWidth значит промахиваться на паддинги и колонки. */
  React.useEffect(() => {
    const box = boxRef.current;
    if (!box || cell) return;
    const read = () => setAvail(box.getBoundingClientRect().width);
    read();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", read, { passive: true });
      return () => window.removeEventListener("resize", read);
    }
    const ro = new ResizeObserver(read);
    ro.observe(box);
    return () => ro.disconnect();
  }, [cell]);

  /* Ячейка только целая: дробная размывает кирпич при масштабировании. */
  const px = cell || (cols && avail
    ? Math.max(minCell, Math.min(maxCell, Math.floor(avail / cols)))
    : minCell);

  const W = cols * px;
  const H = pbBrickHeight(lines.length, px, lineGap);

  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let alive = true;

    const draw = (img) => {
      if (!alive) return;
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;    /* кирпич обязан остаться пиксельным */
      ctx.clearRect(0, 0, W, H);

      const q = img.naturalWidth / 2;       /* четверть спрайта */
      const half = px / 2;

      grids.forEach((grid, li) => {
        const y0 = li * (PB_CELLS + lineGap) * px;
        for (let c = 0; c < grid.length; c++) {
          for (let r = 0; r < PB_CELLS; r++) {
            const m = grid[c][r];
            if (!m) continue;
            const x = c * px, y = y0 + r * px;
            /* каждая четверть берётся из своей четверти спрайта, поэтому
               соседние ячейки складываются в непрерывную кладку */
            if (m & 8) ctx.drawImage(img, 0, 0, q, q, x,        y,        half, half);
            if (m & 4) ctx.drawImage(img, q, 0, q, q, x + half, y,        half, half);
            if (m & 2) ctx.drawImage(img, 0, q, q, q, x,        y + half, half, half);
            if (m & 1) ctx.drawImage(img, q, q, q, q, x + half, y + half, half, half);
          }
        }
      });
    };

    pbTile(tile, draw);
    return () => { alive = false; };
  }, [grids, px, lineGap, tile, W, H]);

  /* decorative — когда текст уже есть рядом в разметке (например, внутри h1
     для поисковиков), второй раз озвучивать его не нужно. */
  const a11y = decorative
    ? { "aria-hidden": "true" }
    : { role: "img", "aria-label": alt || lines.join(" ") };

  return (
    <div ref={boxRef} style={{ width: "100%", ...style }}>
      <canvas
        ref={ref}
        {...a11y}
        style={{ width: W, height: H, display: "block" }}
      />
    </div>
  );
}

Object.assign(window, { BrickText, pbBrickGrid, pbBrickHeight, pbTextCols, pbWrap });
