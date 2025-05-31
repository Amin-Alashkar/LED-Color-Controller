from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
import threading

# تهيئة شريط الـLED: عدد المصابيح = 20
NUM_LEDS = 20
neo = Pi5Neo('/dev/spidev0.0', NUM_LEDS, 800)

app = FastAPI()

# تمكين CORS لجميع الطلبات (للسماح للملفات الثابتة من أصول مختلفة بالإتصال)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# طابورُ الأنيميشن (queue) وقفلُ الوصول إليه (lock) 
animation_queue = deque()
animation_lock = threading.Lock()

# علم لإيقاف الحلقة الحالية
stop_requested = False

# نخزن هنا أحدث لون ثابت (hex string مثل "#00FF00") أو None إذا لا يوجد لون ثابت
current_hex: str | None = "#000000"

# نخزن هنا اسم الأنيميشن الجاري (مثلاً "fade_colors") أو None إذا لا يوجد أنيميشن جارٍ
current_anim: str | None = None

# نماذج البيانات الواردة (Pydantic)
class AnimationRequest(BaseModel):
    animation_type: str        # "light_one_by_one" | "fade_colors" | "solid_color"
    color_index: int = 0       # استخدم في light_one_by_one
    hex_color: str | None = None  # استخدم في solid_color

class ColorRequest(BaseModel):
    hex_color: str

# ——— دالة تشغيل دورة واحدة من تأثير light_one_by_one ———
async def light_up_one_by_one(color_index: int, delay: float = 0.011):
    """
    تشغل دورة واحدة من تأثير "Light One by One" باللون المحدد بناء على color_index.
    تنتهي تلقائيًا إذا stop_requested أصبح True.
    """
    global stop_requested
    colors = [
        (255, 0, 50),  (255, 0, 0),  (255, 55, 0),
        (255, 255, 0),(0, 255, 0),(0, 255, 255),
        (0, 0, 255),  (255, 0, 50), (255, 0, 255),
        (255, 105, 180)
    ]
    color = colors[color_index % len(colors)]

    for j in range(NUM_LEDS):
        if stop_requested:
            break
        for i in range(NUM_LEDS - 1, j - 1, -1):
            if stop_requested:
                break
            neo.set_led_color(i, *color)
            neo.update_strip()
            await asyncio.sleep(delay)
            if i != j:
                neo.set_led_color(i, 0, 0, 0)
                neo.update_strip()
        neo.set_led_color(j, *color)
    neo.update_strip()

# ——— دالة تشغيل تأثير fade_colors في حلقة متكررة ———
async def fade_colors_loop(delay: float = 0.02, steps: int = 50):
    """
    تقوم بالتالي لكل لون في قائمة COLORS:
      1) Fade-in تدريجي عبر steps خطوات
      2) Fade-out تدريجي عبر steps خطوات
    تتكرر هذه اللوب طالما stop_requested == False
    """
    global stop_requested
    COLORS = [
        (255, 255, 255),  # White
        (255,   0,   0),  # Red
        (0,     0, 255),  # Blue
        (0,   255,   0),  # Green
        (255, 255,   0),  # Yellow
        (255,   0, 255),  # Magenta
        (0,   255, 255),  # Cyan
    ]
    while not stop_requested:
        for (r_t, g_t, b_t) in COLORS:
            # Fade-in
            for step in range(steps):
                if stop_requested:
                    return
                factor = step / (steps - 1)
                r = int(r_t * factor)
                g = int(g_t * factor)
                b = int(b_t * factor)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)
            # Fade-out
            for step in range(steps):
                if stop_requested:
                    return
                factor = 1 - (step / (steps - 1))
                r = int(r_t * factor)
                g = int(g_t * factor)
                b = int(b_t * factor)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)

# ——— عامل خلفي (Background Worker) لمعالجة طابور الأنيميشن ———
async def animation_worker():
    """
    يقرأ من animation_queue، ويشغل الأنيميشن المناسب.
    يعرّف stop_requested ليوقف الأنيميشن حينما تطلب نقطة النهاية /stop أو نقطة النهاية /color.
    """
    global stop_requested, current_anim
    while True:
        if animation_queue:
            with animation_lock:
                req = animation_queue.popleft()
            stop_requested = False
            current_anim = req.animation_type

            if req.animation_type == "light_one_by_one":
                # شغل حلقات light_one_by_one بلا انقطاع حتى stop_requested == True
                while not stop_requested:
                    await light_up_one_by_one(req.color_index)

            elif req.animation_type == "fade_colors":
                await fade_colors_loop()

            elif req.animation_type == "solid_color":
                # نقرأ اللون من req.hex_color ثم نطبّقه دفعة واحدة
                if req.hex_color:
                    r = int(req.hex_color[1:3], 16)
                    g = int(req.hex_color[3:5], 16)
                    b = int(req.hex_color[5:7], 16)
                    for i in range(NUM_LEDS):
                        neo.set_led_color(i, r, g, b)
                    neo.update_strip()
                stop_requested = True

        await asyncio.sleep(0.1)

# عند بدء تشغيل التطبيق، نشغّل عامل الخلفية:
@app.on_event("startup")
async def on_startup():
    asyncio.create_task(animation_worker())

# ——— نقطة نهاية لإرجاع الحالة الحاليّة (GET /state) ———
@app.get("/state")
async def get_state():
    """
    يعيد JSON مثل:
      { "animation": null,        "color": "#00FF00" }
      { "animation": "fade_colors","color": null        }
    """
    return {"animation": current_anim, "color": current_hex}

# ——— نقطة نهاية لبدء أنيميشن معيّن (POST /animate) ———
@app.post("/animate")
async def start_animation(req: AnimationRequest):
    """
    يتلقّى JSON مثل:
      { "animation_type": "fade_colors" }
      { "animation_type": "light_one_by_one", "color_index": 0 }
      { "animation_type": "solid_color", "hex_color": "#A0B1C2" }
    """
    global current_hex, current_anim
    with animation_lock:
        animation_queue.clear()
        animation_queue.append(req)

    # بما أننا بدأنا أنيميشن، لا يوجد لون ثابت الآن:
    current_hex = None
    current_anim = req.animation_type
    return {"status": "queued", "animation": req.animation_type}

# ——— نقطة نهاية لتغيير اللون الثابت (POST /color) ———
@app.post("/color")
async def set_color(req: ColorRequest):
    """
    يتلقّى JSON:
      { "hex_color": "#00FF00" }
    يوقف أي أنيميشن جاري (stop_requested=True)، ثم يضبط جميع المصابيح إلى ذلك اللون.
    """
    global current_hex, current_anim, stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        # نحسب قيم RGB ونطبّقها
        r = int(req.hex_color[1:3], 16)
        g = int(req.hex_color[3:5], 16)
        b = int(req.hex_color[5:7], 16)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

    current_anim = None
    current_hex = req.hex_color
    return {"status": "color_changed", "color": req.hex_color}

# ——— نقطة نهاية لإيقاف كل شيء (POST /stop) ———
@app.post("/stop")
async def stop_animation():
    """
    يمسح طابور الأنيميشن، يضبط stop_requested=True، ثم يطفئ جميع المصابيح،
    ويجعل current_hex = "#000000" و current_anim = None.
    """
    global current_hex, current_anim, stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        for i in range(NUM_LEDS):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()

    current_anim = None
    current_hex = "#000000"
    return {"status": "stopped"}
