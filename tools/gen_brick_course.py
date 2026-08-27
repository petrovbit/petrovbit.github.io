"""Собирает assets/images/materials/pixel-tanks/brick-course.png — полосу стены
   ровно по алгоритму игры (client/.../shaders/wall_fill.frag + RenderSystem.java).

   Модель стены в Pixel Tanks: одна WALL-клетка занимает по вертикали 1.75 тайла —
   светлый ВЕРХ (ровно 1 тайл, вид сверху) и тёмная ФРОНТ-грань (0.75 тайла),
   которая свисает НИЖЕ клетки («приподнятая модель», u_yShift = ppt*DARK_FRAC).

   Светлый верх — brick_light.png (256x256 = 4x4 клетки), фаза (x mod 4, y mod 4),
   поэтому кладка непрерывна по всей стене. Тёмная грань — brick_dark.png (256x48),
   фаза x mod 4, v от 0 сверху грани до 1 снизу.

   Затенение (shade) шейдер накладывает ТОЛЬКО на светлый верх:
       lit   =  LIT_G * max(0, 1 - din/LIT_W)     — подсветка кромки
       ao    = -AO_G  * exp(-din/AO_S)            — затемнение у кромки
       shade =  1 + lit + ao
   din — расстояние вглубь силуэта в долях тайла. Для бесконечной горизонтальной
   полосы это просто глубина от верхней кромки.

   Мир в LibGDX смотрит Y вверх, texture v — вниз, поэтому светлый верх на экране
   отрисовывается ПЕРЕВЁРНУТЫМ относительно текстуры (см. luv в шейдере).
"""
import math, sys
from PIL import Image, ImageChops

SRC   = sys.argv[1]
OUT   = sys.argv[2]
ROW   = int(sys.argv[3])        # какой ряд 4x4-листа brick_light берём под нашу полосу
LIGHT = int(sys.argv[4]) if len(sys.argv) > 4 else 64   # сколько пикселей светлого верха оставить
SHIFT = int(sys.argv[5]) if len(sys.argv) > 5 else 32   # сдвиг светлого ряда по X, px

DARK_FRAC = 0.75                # Assets.BRICK_DARK_FRAC (322/430)
LIT_W, LIT_G = 0.12, 0.28       # RenderSystem.EDGE_LIT_WIDTH / EDGE_LIT_GAIN
AO_S,  AO_G  = 0.30, 0.20       # RenderSystem.EDGE_AO_SCALE / EDGE_AO_GAIN

CELL = 64                       # тайл текстуры = одна клетка
DARK = int(CELL * DARK_FRAC)    # 48
W    = 256                      # период фазы x mod 4

light = Image.open(SRC + "/brick_light.png").convert("RGB")
dark  = Image.open(SRC + "/brick_dark.png").convert("RGB")

# Полный светлый верх — это ровно тайл (2 ряда кладки). LIGHT < CELL оставляет в кадре
# меньше рядов: берём НИЖНЮЮ часть клетки, чтобы срез пришёлся на шов, а не по кирпичу.
top = light.crop((0, ROW * CELL, W, (ROW + 1) * CELL)).transpose(Image.FLIP_TOP_BOTTOM)
top = top.crop((0, CELL - LIGHT, W, CELL))
# В игре светлый верх и тёмная грань — разные плоскости и разные текстуры, их фазы
# по X ничем не связаны. В узкой полосе, где виден один ряд верха над гранью, они
# случайно совпали: вертикальные швы верхнего ряда встали ровно над швами первого
# ряда грани, и кладка перестала быть перевязкой. Сдвигаем верх на полкирпича
# (кирпич 64px). Сдвиг циклический, бесшовность по X от него не страдает.
top = ImageChops.offset(top, SHIFT, 0)
px  = top.load()
for y in range(LIGHT):
    # din отсчитывается от ВЕРХНЕЙ кромки силуэта, то есть от верха полосы, а не от
    # верха клетки: подсветка и AO обязаны остаться на кромке, что бы мы ни срезали.
    din   = (y + 0.5) / CELL
    shade = 1.0 + LIT_G * max(0.0, 1.0 - din / LIT_W) - AO_G * math.exp(-din / AO_S)
    for x in range(W):
        r, g, b = px[x, y]
        px[x, y] = (min(255, int(r * shade + .5)),
                    min(255, int(g * shade + .5)),
                    min(255, int(b * shade + .5)))

out = Image.new("RGB", (W, LIGHT + DARK))
out.paste(top, (0, 0))
out.paste(dark, (0, LIGHT))
out.save(OUT)
print(OUT, out.size)

# Запуск:
#   python3 tools/gen_brick_course.py \
#     ../../pixel_tanks_steel_frontier/android/src/main/assets/brick_tiles \
#     assets/images/materials/pixel-tanks/brick-course.png 3 32 32
