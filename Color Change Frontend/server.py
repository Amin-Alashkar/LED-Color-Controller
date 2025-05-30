from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
import asyncio
from fastapi.middleware.cors import CORSMiddleware

# إعداد الراسبيري والـFastAPI
neo = Pi5Neo('/dev/spidev0.0', 20, 800)
app = FastAPI()

# تمكين CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# متغيرات تحكم بالأنيميشن
stop_requested = False
animation_task: asyncio.Task = None

# نماذج البيانات
class AnimationRequest(BaseModel):
    animation_type: str
    color_index: int = 0

class ColorRequest(BaseModel):
    hex_color: str

# دالة تشغيل دورة واحدة
async def light_up_one_by_one(color_index, delay=0.011):
    colors = [
        (255, 0, 50), (255, 0, 0), (255, 55, 0),
        (255, 255, 0), (0, 255, 0), (0, 255, 255),
        (0, 0, 255), (255, 0, 50), (255, 0, 255),
        (255, 105, 180)
    ]
    color = colors[color_index % len(colors)]
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

# المهمة التي تدير الأنيميشن المتكرر
async def run_animation_loop(color_index):
    global stop_requested
    while not stop_requested:
        await light_up_one_by_one(color_index)
    # عند الخروج، تأكد الإنارة مطفأة
    for i in range(20):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()

# نقطة نهاية لبدء الأنيميشن
@app.post("/animate")
async def start_animation(req: AnimationRequest):
    global stop_requested, animation_task
    # أوقف أي أنيميشن شغّال حالياً
    stop_requested = True
    if animation_task:
        await animation_task
    stop_requested = False
    # اخلق مهمة جديدة للثيم اللا متناهي
    animation_task = asyncio.create_task(run_animation_loop(req.color_index))
    return {"status": "started", "animation": req.animation_type}

# نقطة نهاية لتغيير اللون الثابت
@app.post("/color")
async def set_color(req: ColorRequest):
    global stop_requested, animation_task
    # أوقف الأنيميشن
    stop_requested = True
    if animation_task:
        await animation_task
    # طبّق اللون الثابت
    r = int(req.hex_color[1:3], 16)
    g = int(req.hex_color[3:5], 16)
    b = int(req.hex_color[5:7], 16)
    for i in range(20):
        neo.set_led_color(i, r, g, b)
    neo.update_strip()
    return {"status": "color_changed", "color": req.hex_color}

# نقطة نهاية للإيقاف التام
@app.post("/stop")
async def stop_animation():
    global stop_requested, animation_task
    stop_requested = True
    if animation_task:
        await animation_task
    # أطفئ جميع الـ LEDs
    for i in range(20):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()
    return {"status": "stopped"}
