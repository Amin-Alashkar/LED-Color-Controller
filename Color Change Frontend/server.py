from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
import json
import colorsys

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

animation_queue = deque()
animation_lock = threading.Lock()
stop_requested = False
current_hex: str | None = "#000000"
current_anim: str | None = None

class AnimationRequest(BaseModel):
    animation_type: str
    color_index: int = 0
    hex_color: str | None = None

class ColorRequest(BaseModel):
    hex_color: str

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

async def fade_colors_loop(delay: float = 0.02, steps: int = 50):
    global stop_requested
    COLORS = [
        (255, 255, 255),
        (255,   0,   0),
        (0,     0, 255),
        (0,   255,   0),
        (255, 255,   0),
        (255,   0, 255),
        (0,   255, 255),
    ]
    while not stop_requested:
        for (r_t, g_t, b_t) in COLORS:
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

async def wave_effect_loop(delay: float = 0.05, wave_speed: float = 0.02):
    global stop_requested
    brightness = 0.5
    step = 0.0

    while not stop_requested:
        for i in range(NUM_LEDS):
            hue = (i / NUM_LEDS + step) % 1.0
            r_f, g_f, b_f = colorsys.hsv_to_rgb(hue, 1.0, brightness)
            r = int(r_f * 255)
            g = int(g_f * 255)
            b = int(b_f * 255)
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

        step = (step + wave_speed) % 1.0
        await asyncio.sleep(delay)

    for i in range(NUM_LEDS):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()

async def rainbow_flow_loop(delay: float = 0.05, steps: int = 100):
    global stop_requested
    step = 0
    while not stop_requested:
        hue = (step % steps) / steps
        r_f, g_f, b_f = colorsys.hsv_to_rgb(hue, 1.0, 1.0)
        r = int(r_f * 255)
        g = int(g_f * 255)
        b = int(b_f * 255)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

        step += 1
        await asyncio.sleep(delay)

    for i in range(NUM_LEDS):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()

async def blinking_pattern_loop(delay: float = 0.5):
    global stop_requested

    color_steps = [
        (255, 255, 255),
        (255, 255, 229),
        (255, 255, 178),
        (255, 255,   0),
        (255, 127,   0),
        (255,   0,   0),
        (255,   0, 255),
        (  0,   0, 255),
        (  0, 255, 255),
        (  0, 255,   0)
    ]

    idx = 0
    total = len(color_steps)

    while not stop_requested:
        r, g, b = color_steps[idx]
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
        await asyncio.sleep(delay)

        if stop_requested:
            break

        for i in range(NUM_LEDS):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
        await asyncio.sleep(delay)

        idx = (idx + 1) % total

    for i in range(NUM_LEDS):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()

# ─── التعديل الرئيسي: دالة Meteor Shower المعدلة لتعمل بحركة سلسة مثل الأفعى ───
async def meteor_shower_loop(hex_color: str, delay_per_step: float = 0.000001, trail_length: int = 12):
    """
    حركة سلسة ومتناسقة تشبه حركة الأفعى:
    - تبدأ من LED 19 وتتحرك بسلاسة نحو LED 0
    - ذيل طويل يتلاشى تدريجياً يعطي إحساساً بحركة الشهاب الملتهب
    - عند الوصول إلى LED 0، تعود إلى البداية بشكل سلس
    - التأثير دائري ومستمر بدون انقطاع
    """
    global stop_requested

    # استخراج اللون الأساسي
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)
    
    # مواقع بداية الشهب (نبدأ من النهاية)
    head_position = NUM_LEDS - 1
    
    while not stop_requested:
        # نرسم الشهاب من الرأس إلى نهاية الذيل
        for i in range(NUM_LEDS):
            if stop_requested:
                break
            
            # إطفاء جميع المصابيح
            neo.clear_strip()
            
            # حساب موقع الرأس الحالي
            current_head = (head_position - i) % NUM_LEDS
            
            # رسم الذيل خلف الرأس
            for t in range(trail_length):
                # حساب موقع LED في الذيل
                tail_pos = (current_head + t) % NUM_LEDS
                
                # حساب شدة اللون (تتلاشى مع بعدها عن الرأس)
                factor = max(0.0, 1.0 - t / trail_length)
                
                # تطبيق عامل التلاشي على اللون
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                
                # تعيين اللون للمصباح
                neo.set_led_color(tail_pos, r, g, b)
            
            # تحديث الشريط
            neo.update_strip()
            await asyncio.sleep(delay_per_step)
        
        # إعادة تعيين موقع البداية للدورة التالية
        head_position = (head_position - 1) % NUM_LEDS
    
    # إطفاء المصابيح عند التوقف
    neo.clear_strip()
    neo.update_strip()

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

            elif req.animation_type == "rainbow_flow":
                await rainbow_flow_loop()

            elif req.animation_type == "blinking_pattern":
                await blinking_pattern_loop()

            elif req.animation_type == "meteor_shower":
                if req.hex_color:
                    await meteor_shower_loop(req.hex_color)

            elif req.animation_type == "solid_color":
                if req.hex_color:
                    r = int(req.hex_color[1:3], 16)
                    g = int(req.hex_color[3:5], 16)
                    b = int(req.hex_color[5:7], 16)
                    for i in range(NUM_LEDS):
                        neo.set_led_color(i, r, g, b)
                    neo.update_strip()
                stop_requested = True

        await asyncio.sleep(0.1)

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(animation_worker())

@app.get("/state")
async def get_state():
    return {"animation": current_anim, "color": current_hex}

@app.post("/animate")
async def start_animation(req: AnimationRequest):
    global current_hex, current_anim
    with animation_lock:
        animation_queue.clear()
        animation_queue.append(req)

    current_hex = None
    current_anim = req.animation_type
    return {"status": "queued", "animation": req.animation_type}

@app.post("/color")
async def set_color(req: ColorRequest):
    global current_hex, current_anim, stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        r = int(req.hex_color[1:3], 16)
        g = int(req.hex_color[3:5], 16)
        b = int(req.hex_color[5:7], 16)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

    current_anim = None
    current_hex = req.hex_color
    return {"status": "color_changed", "color": req.hex_color}

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

from fastapi.responses import StreamingResponse

async def event_generator():
    while True:
        data = json.dumps({"animation": current_anim, "color": current_hex})
        yield f"data: {data}\n\n"
        await asyncio.sleep(1.0)

@app.get("/stream")
async def stream_state():
    return StreamingResponse(event_generator(), media_type="text/event-stream")

