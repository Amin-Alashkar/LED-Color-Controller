# Server.py
from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
import threading

# Raspberry Pi NeoPixel init
neo = Pi5Neo('/dev/spidev0.0', 20, 800)
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Animation control variables
animation_queue = deque()
animation_lock = threading.Lock()
stop_requested = False

# Request models
class AnimationRequest(BaseModel):
    animation_type: str        # "light_one_by_one" | "fade_colors" | "solid_color"
    color_index: int = 0       # used by light_one_by_one
    hex_color: str = None      # used by solid_color

class ColorRequest(BaseModel):
    hex_color: str

# ——— light_one_by_one as before ———
async def light_up_one_by_one(color_index, delay=0.011):
    colors = [
        (255, 0, 50), (255, 0, 0), (255, 55, 0),
        (255, 255, 0), (0, 255, 0), (0, 255, 255),
        (0, 0, 255), (255, 0, 50), (255, 0, 255),
        (255, 105, 180)
    ]
    color = colors[color_index % len(colors)]
    for j in range(20):
        if stop_requested: break
        for i in range(19, j - 1, -1):
            if stop_requested: break
            neo.set_led_color(i, *color)
            neo.update_strip()
            await asyncio.sleep(delay)
            if i != j:
                neo.set_led_color(i, 0, 0, 0)
                neo.update_strip()
        neo.set_led_color(j, *color)
    neo.update_strip()

# ——— fade_colors_loop: New smooth fade‑in/fade‑out across all LEDs ———
async def fade_colors_loop(delay=0.02, steps=50):
    COLORS = [
        (255, 255, 255),  # White
        (255,   0,   0),  # Red
        (  0,   0, 255),  # Blue
        (  0, 255,   0),  # Green
        (255, 255,   0),  # Yellow
        (255,   0, 255),  # Magenta
        (  0, 255, 255),  # Cyan
    ]
    global stop_requested
    while not stop_requested:
        for (r_t, g_t, b_t) in COLORS:
            # fade in
            for step in range(steps):
                if stop_requested: return
                factor = step / (steps - 1)
                r = int(r_t * factor)
                g = int(g_t * factor)
                b = int(b_t * factor)
                for i in range(neo.num_leds):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)
            # fade out
            for step in range(steps):
                if stop_requested: return
                factor = 1 - (step / (steps - 1))
                r = int(r_t * factor)
                g = int(g_t * factor)
                b = int(b_t * factor)
                for i in range(neo.num_leds):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)

# ——— background worker to pull from queue ———
async def animation_worker():
    global stop_requested
    while True:
        if animation_queue:
            with animation_lock:
                req = animation_queue.popleft()
            stop_requested = False

            if req.animation_type == "light_one_by_one":
                while not stop_requested:
                    await light_up_one_by_one(req.color_index)

            elif req.animation_type == "fade_colors":
                await fade_colors_loop()

            elif req.animation_type == "solid_color":
                # parse hex_color and set static color
                r = int(req.hex_color[1:3], 16)
                g = int(req.hex_color[3:5], 16)
                b = int(req.hex_color[5:7], 16)
                for i in range(neo.num_leds):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()

        await asyncio.sleep(0.1)

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(animation_worker())

# ——— API endpoints ———
@app.post("/animate")
async def start_animation(req: AnimationRequest):
    with animation_lock:
        animation_queue.clear()
        animation_queue.append(req)
    return {"status": "queued", "animation": req.animation_type}

@app.post("/color")
async def set_color(req: ColorRequest):
    global stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        r = int(req.hex_color[1:3], 16)
        g = int(req.hex_color[3:5], 16)
        b = int(req.hex_color[5:7], 16)
        for i in range(neo.num_leds):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
    return {"status": "color_changed", "color": req.hex_color}

@app.post("/stop")
async def stop_animation():
    global stop_requested
    with animation_lock:
        animation_queue.clear()
        stop_requested = True
        for i in range(neo.num_leds):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
    return {"status": "stopped"}
