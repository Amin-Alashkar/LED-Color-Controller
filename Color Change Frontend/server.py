# Server.py

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
import math
import random  # لإنتاج الألوان والمواقع العشوائية

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

async def fade_colors_loop(delay: float = 0.0001, steps: int = 10):
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

# ───── التعديل هنا: إعادة تعريف pulse_sync_loop لتأثير Larson Scanner ─────
async def pulse_sync_loop(delay: float = 0.05, steps: int = 20):
    """
    تأثير Larson Scanner (ضوء يتنقل ذهابًا وإيابًا مع ذيل لوني):
    - يتحرك رأس الضوء ذهابًا وإيابًا
    - خلف كل رأس ضوئي ذيل يتلاشى تدريجيًا
    - يتغير اللون بعد كل دورة كاملة
    """
    global stop_requested
    COLORS = [
        (255, 0, 0),    # أحمر
        (0, 255, 0),    # أخضر
        (0, 0, 255),    # أزرق
        (255, 255, 0),  # أصفر
        (255, 0, 255),  # أرجواني
        (0, 255, 255),  # سماوي
        (255, 165, 0),  # برتقالي
        (255, 192, 203),# وردي
        (138, 43, 226), # أزرق بنفسجي
        (50, 205, 50)   # أخضر ليموني
    ]
    position = 0
    direction = 1
    trail_length = 5
    color_index = 0

    while not stop_requested:
        r_base, g_base, b_base = COLORS[color_index % len(COLORS)]
        neo.clear_strip()
        for t in range(trail_length):
            pos = position - (t * direction)
            if 0 <= pos < NUM_LEDS:
                factor = (trail_length - t) / trail_length
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                neo.set_led_color(pos, r, g, b)
        neo.update_strip()
        await asyncio.sleep(delay)
        position += direction
        if position >= NUM_LEDS - 1 or position <= 0:
            direction *= -1
            color_index += 1
    neo.clear_strip()
    neo.update_strip()
# ────────────────────────────────────────────────────────────────────

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

async def meteor_shower_loop(delay_per_step: float = 0.05, trail_length: int = 15):
    """
    تأثير الشهاب (تأثير "الأفعى") مع عشرة أفاعي مختلفة الألوان:
    - كل أفعى طولها 12 LED بتدريج من الفاتح إلى الداكن
    - تتحرك كل أفعى من LED رقم 19 إلى LED رقم 0
    - بين كل أفعى وأفعى مسافة 5 أضواء سوداء
    - في كل دورة نحافظ على تشغيل ثلاث أفاعي في آنٍ واحد حتى ننتهي من إطلاق العشر أفاعي
    - بعد انتهاء العشر أفاعي، نعيد الدورة من جديد طالما لم يُطلَب الإيقاف
    """
    global stop_requested

    # نعرّف عشرة ألوان ثابتة للأفاعي (كل أفعى لون مختلف)
    SNAKE_COLORS = [
        (255,   0,   0),   # أحمر
        (  0,   0, 255),   # أزرق
        (  0, 255,   0),   # أخضر
        (255, 255,   0),   # أصفر
        (255,   0, 255),   # أرجواني
        (  0, 255, 255),   # سماوي
        (255, 165,   0),   # برتقالي
        (255, 192, 203),   # وردي
        (138,  43, 226),   # بنفسجي
        ( 50, 205,  50)    # أخضر ليموني
    ]

    total_snakes = len(SNAKE_COLORS)
    # مدة حركة الأفعى الواحدة بالخطوات:
    frames_per_snake = NUM_LEDS + trail_length  # الرأس يبدأ عند 19 وينتهي عند -trail_length

    # نضبط الفاصل الزمني لإطلاق الأفاعي بحيث يبقى بين كل رأس وآخر 5 أضواء سوداء
    spawn_interval = trail_length + 30  # 12 + 5 = 17

    while not stop_requested:
        # قائمة تمثل الأفاعي النشطة حاليًّا
        active_snakes = []
        global_frame = 0
        snake_index = 0

        # نطلق الأفاعي الواحدة تلو الأخرى بانتظام
        while not stop_requested:
            # إذا حان وقت إطلاق أفعى جديدة
            if snake_index < total_snakes and global_frame >= snake_index * spawn_interval:
                # نضيف الأفعى إلى القائمة (مع حالة التقدّم بدايةً 0)
                active_snakes.append({
                    'id': snake_index,
                    'progress': 0  # رقم الإطار داخل الأفعى
                })
                snake_index += 1

            # إذا لم يبقَ أفعى ضمن النطاق أو انتهت كل الأفاعي من الحركة، نكسر
            if snake_index >= total_snakes and not active_snakes:
                break

            # نمسح الشريط
            neo.clear_strip()

            # نحدّث كل أفعى
            for snake in active_snakes[:]:
                sid = snake['id']
                color_base = SNAKE_COLORS[sid]
                prog = snake['progress']
                head_pos = NUM_LEDS - prog

                # نرسم ذيل الأفعى بطول trail_length
                for t in range(trail_length):
                    pos = head_pos + t
                    if 0 <= pos < NUM_LEDS:
                        # حساب التدريج (فاتح في الرأس، داكن في الذيل)
                        factor = (trail_length - t) / trail_length
                        r = int(color_base[0] * factor)
                        g = int(color_base[1] * factor)
                        b = int(color_base[2] * factor)
                        neo.set_led_color(pos, r, g, b)

                # نزيح الأفعى خطوة لاحقًا
                snake['progress'] += 1
                # إذا تجاوزت الأفعى المسار كاملاً
                if snake['progress'] > frames_per_snake:
                    active_snakes.remove(snake)

            # نطبّق التحديث على الشريط
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

            global_frame += 1
            # إذا انتهى جميع الإطارات لكل الأفاعي وأفرغت القائمة
            if snake_index >= total_snakes and not active_snakes:
                break

        # بعد إنهاء عشر أفاعي، نعيد الدورة تلقائيًّا
    neo.clear_strip()
    neo.update_strip()

async def running_lights_loop(delay: float = 0.05):
    """
    تأثير أضواء متحركة بألوان عشوائية:
    - لدينا سبع نقاط انطلاق: 19,16,13,10,7,4,1
    - لكل نقطة، نختار لونًا عشوائيًا ثم نحركه إلى الأسفل حتى الصفر
    - عندما يصل إلى ما دون 0، نعيد تهيئته بلون جديد عند موقع الانطلاق الأصلي
    - يستمر هذا التكرار باستمرار طالما لم يُطلَب الإيقاف
    """
    global stop_requested
    spawn_positions = list(range(19, -1, -3))  # [19,16,13,10,7,4,1]
    # نهيئ الشرارات الثلاث في المواقع الأصلية
    sparks = []
    for p in spawn_positions:
        color = (random.randint(1, 255), random.randint(1, 255), random.randint(1, 255))
        sparks.append({'start': p, 'pos': p, 'color': color})

    while not stop_requested:
        neo.clear_strip()
        # رسم كل شرارة في موقعها الحالي
        for s in sparks:
            if 0 <= s['pos'] < NUM_LEDS:
                neo.set_led_color(s['pos'], *s['color'])
        neo.update_strip()
        await asyncio.sleep(delay)
        # تحديث كل شرارة: نقلها خطوة لأسفل أو إعادة تهيئتها
        for s in sparks:
            s['pos'] -= 1
            if s['pos'] < 0:
                s['pos'] = s['start']
                s['color'] = (random.randint(1, 255), random.randint(1, 255), random.randint(1, 255))
    neo.clear_strip()
    neo.update_strip()

async def breathing_effect_loop(delay: float = 0.02, steps: int = 50):
    """
    تأثير تنفسي ناعم ينتقل بين ألوان مختلفة تلقائيًا:
    - ينتقل بين مجموعة من الألوان الأساسية
    - كل لون يمر بدورة تنفس كاملة (زيادة ثم نقصان الشدة)
    - يعطي إحساساً بالتنفس مع تغير الألوان
    """
    global stop_requested
    COLORS = [
        (255, 0, 0),    # أحمر
        (0, 255, 0),    # أخضر
        (0, 0, 255),    # أزرق
        (255, 255, 0),  # أصفر
        (255, 0, 255),  # أرجواني
        (0, 255, 255),  # سماوي
        (255, 165, 0),  # برتقالي
        (128, 0, 128),  # بنفسجي
        (255, 192, 203) # وردي
    ]
    while not stop_requested:
        for (r_base, g_base, b_base) in COLORS:
            for step in range(steps):
                if stop_requested:
                    return
                factor = step / (steps - 1)
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)
            for step in range(steps):
                if stop_requested:
                    return
                factor = 1 - (step / (steps - 1))
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                for i in range(NUM_LEDS):
                    neo.set_led_color(i, r, g, b)
                neo.update_strip()
                await asyncio.sleep(delay)


async def fireworks_burst_loop(delay_per_step: float = 0.05, fade_steps: int = 10):
    """
    تأثير ألعاب نارية “صاروخ” حقيقي:
    - ينطلق الصاروخ (نقطة مضيئة) من LED رقم 19 وصولاً إلى منتصف الشريط (LED رقم 9 أو 10)
    - عند الوصول، ينفجر الصاروخ في “موجة” ضوئية: تضيء LEDs على الجانبين بألوان عشوائية
    - ثم تتلاشى الأضواء المتفجرة تدريجياً
    - نكرر الحلقة طالما لم يُطلَب الإيقاف
    """
    global stop_requested
    mid = NUM_LEDS // 2  # منتصف الشريط (20/2 = 10)
    trail_length = 3     # طول ذيل الصاروخ عند الإقلاع

    COLORS = [
        (255,  50,  50),  # أحمر خفيف
        (255, 255,  50),  # أصفر
        ( 50, 255,  50),  # أخضر فاتح
        ( 50, 255, 255),  # سماوي فاتح
        ( 50,  50, 255),  # أزرق فاتح
        (255,  50, 255),  # وردي
        (255, 150,   0),  # برتقالي
    ]

    while not stop_requested:
        # 1) مرحلة الانطلاق: نقطة مضيئة تتحرك من LED 19 إلى منتصف الشريط
        color = random.choice(COLORS)
        for pos in range(NUM_LEDS - 1, mid - 1, -1):
            if stop_requested:
                break

            neo.clear_strip()
            # نرسم ذيل الصاروخ بإضاءة تدريجية إلى أنفه
            for t in range(trail_length):
                trail_pos = pos + t
                if 0 <= trail_pos < NUM_LEDS:
                    factor = max(0.2, 1 - (t / trail_length))  # الذيل أهدأ تدريجياً
                    r = int(color[0] * factor)
                    g = int(color[1] * factor)
                    b = int(color[2] * factor)
                    neo.set_led_color(trail_pos, r, g, b)

            # الرأس (الأقوى ضوءاً)
            if 0 <= pos < NUM_LEDS:
                neo.set_led_color(pos, *color)

            neo.update_strip()
            await asyncio.sleep(delay_per_step)

        if stop_requested:
            break

        # 2) مرحلة الانفجار عند منتصف الشريط
        # نحدد مجموعة من “جزيئات” الانفجار: إضاءة تدريجية للخارج
        explosion_colors = [random.choice(COLORS) for _ in range(mid)]
        # نضيء الموجة المركزية أولاً
        for offset in range(mid + 1):
            if stop_requested:
                break

            neo.clear_strip()
            # نضيء كل مواضع الانفجار حتى الإزاحة الحالية
            for d in range(offset + 1):
                left = mid - d
                right = mid + d - 1  # لأن mid =10 يؤشر لـ LED 10، نسوي -1 علشان 0- based
                c = explosion_colors[d % len(explosion_colors)]
                if 0 <= left < NUM_LEDS:
                    neo.set_led_color(left, *c)
                if 0 <= right < NUM_LEDS and right != left:
                    neo.set_led_color(right, *c)

            neo.update_strip()
            await asyncio.sleep(delay_per_step)

        if stop_requested:
            break

        # 3) مرحلة التلاشي التدريجي لموجة الانفجار
        # نُخزن ألوان الانفجار الحالية لكي نُخفتها خطوة بخطوة
        current_colors = []
        for i in range(NUM_LEDS):
            r, g, b = neo.strip[i]  # بافتراض أنّ Pi5Neo يتيح الوصول للمصفوفة حالياً
            current_colors.append((r, g, b))

        # إذا مكتوبٌ عندك مكتبة NeoNative لا تسمح بالوصول لـ strip، حِلها بتحويل r,g,b لـ array عند رسمك سابقاً

        for fade_step in range(fade_steps):
            if stop_requested:
                break
            neo.clear_strip()
            factor = 1 - (fade_step / (fade_steps - 1))
            for i in range(NUM_LEDS):
                r_base, g_base, b_base = current_colors[i]
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                neo.set_led_color(i, r, g, b)
            neo.update_strip()
            await asyncio.sleep(delay_per_step / 2)

        # نستريح شريط الإضاءة (السلام عليك يا أضوية 😉)
        neo.clear_strip()
        neo.update_strip()
        await asyncio.sleep(delay_per_step * 5)  # وقت راحة قصير قبل الإطلاق التالي

    # عند طلب التوقف نطفي الشريط نهائياً
    neo.clear_strip()
    neo.update_strip()
async def meteor_shower_modified_loop(delay_per_step: float = 0.03):
    """
    تأثير الشهاب المعدل - أسرع وأطول مع ذيل متوهج
    - طول الشهاب: 17 LED
    - سرعة أعلى بـ 40% من الإصدار الأصلي
    - ذيل متدرج الشدة مع توهج إضافي
    """
    global stop_requested
    trail_length = 17
    fade_steps = 5
    
    while not stop_requested:
        # توليد مواقع بداية عشوائية
        start_pos = random.randint(15, NUM_LEDS + trail_length)
        color = (
            random.randint(150, 255),  # أحمر
            random.randint(150, 255),  # أخضر
            random.randint(200, 255)   # أزرق
        )
        
        for pos in range(start_pos, -trail_length, -1):
            if stop_requested:
                break
            
            neo.clear_strip()
            
            # رسم الشهاب مع ذيل متدرج
            for i in range(trail_length):
                led_pos = pos - i
                if 0 <= led_pos < NUM_LEDS:
                    # حساب شدة الإضاءة (تتلاشى مع بعدها عن الرأس)
                    intensity = 1.0 - (i / trail_length)
                    
                    # تطبيق تأثير التوهج
                    glow_intensity = intensity * 0.7
                    r = int(color[0] * intensity)
                    g = int(color[1] * intensity)
                    b = int(color[2] * intensity)
                    
                    # إضافة لون التوهج (أزرق-أبيض)
                    r = min(r + int(100 * glow_intensity), 255)
                    g = min(g + int(100 * glow_intensity), 255)
                    b = min(b + int(255 * glow_intensity), 255)
                    
                    neo.set_led_color(led_pos, r, g, b)
            
            neo.update_strip()
            await asyncio.sleep(delay_per_step)
    
    neo.clear_strip()
    neo.update_strip()





# ────────────────────────────────────────────────────────────────────

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
            elif req.animation_type == "pulse_sync":
                await pulse_sync_loop()
            elif req.animation_type == "wave_effect":
                await wave_effect_loop()
            elif req.animation_type == "rainbow_flow":
                await rainbow_flow_loop()
            elif req.animation_type == "blinking_pattern":
                await blinking_pattern_loop()
            elif req.animation_type == "meteor_shower":
                await meteor_shower_loop()
            elif req.animation_type == "running_lights":
                await running_lights_loop()
            elif req.animation_type == "breathing_effect":
                await breathing_effect_loop()
            elif req.animation_type == "fireworks_burst":
                await fireworks_burst_loop()
            elif req.animation_type == "meteor_shower_modified":
                await meteor_shower_modified_loop()
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
