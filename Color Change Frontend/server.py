from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
import json  # ─── أضفنا هذا للاستفادة من JSON في SSE

# تهيئة شريط الـLED: عدد المصابيح = 20
NUM_LEDS = 20
neo = Pi5Neo('/dev/spidev0.0', NUM_LEDS, 800)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# طابورُ الأنيميشن (queue) وقفلُ الوصول إليه (lock)
animation_queue = deque()
animation_lock = threading.Lock()

# علم لإيقاف الحلقة الحالية
stop_requested = False

# الحالة الحالية: لون ثابت أو None
current_hex: str | None = "#000000"
# اسم الأنيميشن الجاري أو None
current_anim: str | None = None

# نماذج Pydantic
class AnimationRequest(BaseModel):
    animation_type: str        # "light_one_by_one" | "fade_colors" | "wave_effect" | "solid_color"
    color_index: int = 0       # استخدم في light_one_by_one
    hex_color: str | None = None  # استخدم في solid_color

class ColorRequest(BaseModel):
    hex_color: str

# ——— دالة تشغيل حلقة “Light One by One” ———
async def light_up_one_by_one(color_index: int, delay: float = 0.011):
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

# ——— دالة تشغيل حلقة “Fade Colors” ———
async def fade_colors_loop(delay: float = 0.02, steps: int = 50):
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
            # Fade‑in
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
            # Fade‑out
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

# ——— دالة تشغيل حلقة “Wave Effect” ———
async def wave_effect_loop(delay: float = 0.05):
    """
    يمرر موجة ضوئية من البداية للنهاية بشكل حلقي.
    مثلاً: نشغل LED واحد باللون الأبيض عند كل خطوة، ثم ننقل للآتي.
    """
    global stop_requested
    color = (80, 80, 255)  # يمكنك تغييره لكل لون تريده للـwave
    off_color = (0, 0, 0)

    while not stop_requested:
        for idx in range(NUM_LEDS):
            if stop_requested:
                break
            # أطفئ جميع المصابيح أولاً
            for i in range(NUM_LEDS):
                neo.set_led_color(i, *off_color)
            # أشعل الـLED الحالي
            neo.set_led_color(idx, *color)
            neo.update_strip()
            await asyncio.sleep(delay)
        # بعد الوصول للنهاية، تعود للمؤشر 0 تلقائيًا
    # عندما ينتهي، نطفئ الكل
    for i in range(NUM_LEDS):
        neo.set_led_color(i, *off_color)
    neo.update_strip()

# ——— عامل خلفي لمعالجة طابور الأنيميشن ———
async def animation_worker():
    global stop_requested, current_anim
    while True:
        if animation_queue:
            with animation_lock:
                req = animation_queue.popleft()

            stop_requested = False
            current_anim = req.animation_type

            if req.animation_type == "light_one_by_one":
                while not stop_requested:
                    await light_up_one_by_one(req.color_index)

            elif req.animation_type == "fade_colors":
                await fade_colors_loop()

            elif req.animation_type == "wave_effect":
                await wave_effect_loop()

            elif req.animation_type == "solid_color":
                # لو طلب color ثابت:
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

# ——— GET /state ———
@app.get("/state")
async def get_state():
    return {"animation": current_anim, "color": current_hex}

# ——— POST /animate ———
@app.post("/animate")
async def start_animation(req: AnimationRequest):
    global current_hex, current_anim
    with animation_lock:
        animation_queue.clear()
        animation_queue.append(req)

    current_hex = None
    current_anim = req.animation_type
    return {"status": "queued", "animation": req.animation_type}

# ——— POST /color ———
@app.post("/color")
async def set_color(req: ColorRequest):
    global current_hex, current_anim, stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        # ضع اللون الثابت
        r = int(req.hex_color[1:3], 16)
        g = int(req.hex_color[3:5], 16)
        b = int(req.hex_color[5:7], 16)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

    current_anim = None
    current_hex = req.hex_color
    return {"status": "color_changed", "color": req.hex_color}

# ——— POST /stop ———
@app.post("/stop")
async def stop_animation():
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

# ───────────── START: إضافة نقطة نهاية SSE ─────────────
from fastapi.responses import StreamingResponse

async def event_generator():
    """
    تُرسل بشكل دوري الحالة الحالية كـ SSE:
      - بيانات JSON فيها animation و color
    """
    while True:
        data = json.dumps({"animation": current_anim, "color": current_hex})
        yield f"data: {data}\n\n"
        await asyncio.sleep(1.0)  # نرسل كل ثانية

@app.get("/stream")
async def stream_state():
    """
    يعيد StreamingResponse بمحتوى text/event-stream
    ليتم التقاطه عن طريق EventSource في الـClient.
    """
    return StreamingResponse(event_generator(), media_type="text/event-stream")
# ───────────── END: إضافة نقطة نهاية SSE ─────────────
