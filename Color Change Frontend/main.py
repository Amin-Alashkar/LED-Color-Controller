# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import asyncio
from pi5neo import Pi5Neo

# LED setup
NUM_LEDS = 20
neo = Pi5Neo('/dev/spidev0.0', NUM_LEDS, 800)

app = FastAPI()
stop_event = asyncio.Event()

class ColorIndex(BaseModel):
    index: int

# ——— helper: light one by one in an infinite loop ———
async def run_one_by_one(idx):
    colors = [
        (255, 0, 50), (255, 0, 0), (255, 55, 0),
        (255, 255, 0), (0, 255, 0), (0, 255, 255),
        (0, 0, 255), (255, 0, 255), (255, 105, 180)
    ]
    while not stop_event.is_set():
        color = colors[idx % len(colors)]
        for j in range(NUM_LEDS):
            if stop_event.is_set(): return
            neo.set_led_color(j, *color)
            neo.update_strip()
            await asyncio.sleep(0.05)
        await asyncio.sleep(0.1)

# ——— helper: fade through all colors in an infinite loop ———
async def run_fade():
    COLORS = [
        (255,255,255),(255,0,0),(0,0,255),
        (0,255,0),(255,255,0),(255,0,255),(0,255,255)
    ]
    STEPS = 50
    DELAY = 0.02
    while not stop_event.is_set():
        for (r_t,g_t,b_t) in COLORS:
            # fade in
            for s in range(STEPS):
                if stop_event.is_set(): return
                f = s/(STEPS-1)
                r,g,b = int(r_t*f),int(g_t*f),int(b_t*f)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(DELAY)
            # fade out
            for s in range(STEPS):
                if stop_event.is_set(): return
                f = 1 - s/(STEPS-1)
                r,g,b = int(r_t*f),int(g_t*f),int(b_t*f)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(DELAY)

@app.post("/light_one_by_one")
async def start_one_by_one(data: ColorIndex):
    stop_event.set()              # stop any existing loop
    await asyncio.sleep(0)        # let running task exit
    stop_event.clear()            # clear flag
    asyncio.create_task(run_one_by_one(data.index))
    return {"status": "started one_by_one"}

@app.post("/fade_colors")
async def start_fade():
    stop_event.set()
    await asyncio.sleep(0)
    stop_event.clear()
    asyncio.create_task(run_fade())
    return {"status": "started fade"}

@app.post("/stop")
async def stop_all():
    stop_event.set()
    # turn off
    for i in range(NUM_LEDS):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()
    return {"status": "stopped"}
