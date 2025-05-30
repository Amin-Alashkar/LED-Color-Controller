from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

neo = Pi5Neo('/dev/spidev0.0', 20, 800)
app = FastAPI()
stop_requested = False
pause_durtion = 0
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
current_animation_task = None
animation_lock = threading.Lock()
stop_requested = False

class AnimationRequest(BaseModel):
    animation_type: str
    color_index: int = 0
    hex_color: str = None  # أضف هذا الحقل

class ColorRequest(BaseModel):
    hex_color: str

async def light_up_one_by_one(color_index, delay=0.011):
    global stop_requested
    colors = [
        (255, 0, 50), (255, 0, 0), (255, 55, 0),
        (255, 255, 0), (0, 255, 0), (0, 255, 255),
        (0, 0, 255), (255, 0, 50), (255, 0, 255),
        (255, 105, 180)
    ]
    color = colors[color_index % len(colors)]
    
    stop_requested = False
    for j in range(20):
        if stop_requested:
            break
        for i in range(19, j - 1, -1):
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

async def animation_worker():
    global current_animation_task, stop_requested
    while True:
        if animation_queue:
            with animation_lock:
                request = animation_queue.popleft()
            
            stop_requested = False
            if request.animation_type == "light_oneby_one":
                while not stop_requested:
                    await light_up_one_by_one(request.color_index)
                    await asyncio.sleep(pause_durtion)
            elif request.animation_type == "solid_color":
                r = int(request.hex_color[1:3], 16)
                g = int(request.hex_color[3:5], 16)
                b = int(request.hex_color[5:7], 16)
                for i in range(20):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
            current_animation_task = None
        await asyncio.sleep(0.1)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(animation_worker())

@app.post("/animate")
async def start_animation(request: AnimationRequest):
    with animation_lock:
        animation_queue.append(request)
    return {"status": "queued", "animation": request.animation_type}

@app.post("/color")
async def set_color(request: ColorRequest):
    with animation_lock:
        animation_queue.clear()
        global stop_requested
        stop_requested = True
        
        # استخدم ColorRequest مباشرة
        r = int(request.hex_color[1:3], 16)
        g = int(request.hex_color[3:5], 16)
        b = int(request.hex_color[5:7], 16)
        
        # ضع اللون مباشرة دون إضافته للقائمة
        for i in range(20):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
    
    return {"status": "color_changed", "color": request.hex_color}

@app.post("/stop")
async def stop_animation():
    with animation_lock:
        animation_queue.clear()
        global stop_requested
        stop_requested = True
        
        # Turn all LEDs off
        for i in range(20):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
    return {"status": "stopped"}


    
