# server.py

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

NUM_LEDS = 150
neo = Pi5Neo('/dev/spidev0.0', NUM_LEDS, 800)

BRIGHTNESS_SCALE = 0.25

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
    hex_color: str | None = None   # <-- we already need this

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
                    neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
                    neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
                neo.update_strip()
                await asyncio.sleep(delay)

async def pulse_sync_loop(delay: float = 0.03, steps: int = 20):
    """
    Larson Scanner (Smooth + Color Shift on Final Head Pixel):
    - يتغير اللون فقط عندما يختفي الذيل وتبقى آخر لمعة (الرأس)
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
    trail_length = 20
    color_index = 0

    r_base, g_base, b_base = COLORS[color_index % len(COLORS)]

    while not stop_requested:
        neo.clear_strip()

        # رسم الرأس والذيل
        for t in range(trail_length):
            pos = position - (t * direction)
            if 0 <= pos < NUM_LEDS:
                factor = (trail_length - t) / trail_length
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                neo.set_led_color(
                    pos,
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )

        neo.update_strip()
        await asyncio.sleep(delay)

        position += direction

        # إذا وصل الطرف:
        if position >= NUM_LEDS - 1 or position <= 0:
            # بعد هالخطوة، رح يبقى الرأس فقط مضيء والباقي يتلاشى
            for i in range(trail_length):
                neo.clear_strip()

                # فقط الرأس يبقى، الباقي يتلاشى
                for t in range(trail_length - i):
                    pos = position - (t * direction)
                    if 0 <= pos < NUM_LEDS:
                        factor = (trail_length - i - t) / trail_length
                        r = int(r_base * factor)
                        g = int(g_base * factor)
                        b = int(b_base * factor)
                        neo.set_led_color(
                            pos,
                            int(r * BRIGHTNESS_SCALE),
                            int(g * BRIGHTNESS_SCALE),
                            int(b * BRIGHTNESS_SCALE)
                        )
                neo.update_strip()
                # await asyncio.sleep(delay)

            # بعد ما الرأس يضل لحاله → نغير اللون
            color_index += 1
            r_base, g_base, b_base = COLORS[color_index % len(COLORS)]

            # نعكس الاتجاه
            direction *= -1

    neo.clear_strip()
    neo.update_strip()

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
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
    تأثير الشهاب (تأثير "الأفعى") مع عشرة أفعى مختلفة الألوان:
    - كل أفعى طولها 12 LED بتدريج من الفاتح إلى الداكن
    - تتحرك كل أفعى من LED رقم 19 إلى LED رقم 0
    - بين كل أفعى وأفعى مسافة 5 أضواء سوداء
    - في كل دورة نحافظ على تشغيل ثلاث أفعى في آنٍ واحد حتى ننتهي من إطلاق العشر أفعى
    - بعد انتهاء العشر أفعى، نعيد الدورة من جديد طالما لم يُطلَب الإيقاف
    """
    global stop_requested

    # نعرّف عشرة ألوان ثابتة للأفعى (كل أفعى لون مختلف)
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

    # نضبط الفاصل الزمني لإطلاق الأفعى بحيث يبقى بين كل رأس وآخر 5 أضواء سوداء
    spawn_interval = trail_length + 30  # 12 + 5 = 17

    while not stop_requested:
        # قائمة تمثل الأفعى النشطة حاليًّا
        active_snakes = []
        global_frame = 0
        snake_index = 0

        # نطلق الأفعى الواحدة تلو الأخرى بانتظام
        while not stop_requested:
            # إذا حان وقت إطلاق أفعى جديدة
            if snake_index < total_snakes and global_frame >= snake_index * spawn_interval:
                # نضيف الأفعى إلى القائمة (مع حالة التقدّم بدايةً 0)
                active_snakes.append({
                    'id': snake_index,
                    'progress': 0  # رقم الإطار داخل الأفعى
                })
                snake_index += 1

            # إذا لم يبقَ أفعى ضمن النطاق أو انتهت كل الأفعى من الحركة، نكسر
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
                        neo.set_led_color(
                        pos,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )

                # نزيح الأفعى خطوة لاحقًا
                snake['progress'] += 1
                # إذا تجاوزت الأفعى المسار كاملاً
                if snake['progress'] > frames_per_snake:
                    active_snakes.remove(snake)

            # نطبّق التحديث على الشريط
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

            global_frame += 1
            # إذا انتهى جميع الإطارات لكل الأفعى وأفرغت القائمة
            if snake_index >= total_snakes and not active_snakes:
                break

        # بعد إنتهاء عشر أفعى، نعيد الدورة تلقائيًّا
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
    spawn_positions = list(range(149, -1, -3))  # [19,16,13,10,7,4,1]
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
                    neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
                    neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
                neo.update_strip()
                await asyncio.sleep(delay)

async def fireworks_burst_loop(delay: float = 0.05 / 10):  # 1000% أسرع
    """
    تأثير ألعاب نارية مطوّر:
    - صاروخ من 7 أضواء.
    - ينفجر في موقع عشوائي.
    - بعد كل انفجار، انتظار عشوائي (حتى 10 ثواني).
    """
    global stop_requested

    COLORS = [
        (255, 0, 0),    # أحمر
        (0, 0, 255),    # أزرق
        (0, 255, 0),    # أخضر
        (255, 255, 0),  # أصفر
        (255, 0, 255),  # أرجواني
        (0, 255, 255),  # سماوي
        (255, 165, 0),  # برتقالي
    ]

    ROCKET_LENGTH = 7
    ROCKET_BRIGHTNESSES = [0.25 - (i * 0.03) for i in range(ROCKET_LENGTH)]  # تدرج سطوع
    EXPLOSION_BRIGHTNESS = 1.0
    FADE_STEPS = 20

    while not stop_requested:
        color = random.choice(COLORS)
        explosion_pos = random.randint(ROCKET_LENGTH, NUM_LEDS - ROCKET_LENGTH)

        # 1. حركة الصاروخ باتجاه موقع الانفجار
        for head_pos in range(NUM_LEDS - 1, explosion_pos - 1, -1):
            if stop_requested:
                break
            neo.clear_strip()
            for i in range(ROCKET_LENGTH):
                led_pos = head_pos + i
                if 0 <= led_pos < NUM_LEDS:
                    brightness = ROCKET_BRIGHTNESSES[i]
                    r = int(color[0] * brightness)
                    g = int(color[1] * brightness)
                    b = int(color[2] * brightness)
                    neo.set_led_color(
                        led_pos,
                        int(r * BRIGHTNESS_SCALE),
                        int(g * BRIGHTNESS_SCALE),
                        int(b * BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)

        if stop_requested:
            break

        # 2. الانفجار الكامل
        neo.clear_strip()
        for i in range(NUM_LEDS):
            r = int(color[0] * EXPLOSION_BRIGHTNESS)
            g = int(color[1] * EXPLOSION_BRIGHTNESS)
            b = int(color[2] * EXPLOSION_BRIGHTNESS)
            neo.set_led_color(
                i,
                int(r * BRIGHTNESS_SCALE),
                int(g * BRIGHTNESS_SCALE),
                int(b * BRIGHTNESS_SCALE)
            )
        neo.update_strip()
        await asyncio.sleep(0.2)

        # 3. التلاشي التدريجي
        for fade_step in range(FADE_STEPS):
            if stop_requested:
                break
            factor = 1 - (fade_step / FADE_STEPS)
            neo.clear_strip()
            for i in range(NUM_LEDS):
                r = int(color[0] * factor)
                g = int(color[1] * factor)
                b = int(color[2] * factor)
                neo.set_led_color(
                    i,
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            pass

        neo.clear_strip()
        neo.update_strip()

        # 4. انتظار عشوائي قبل إطلاق صاروخ جديد
        wait_time = random.uniform(0.5, 10.0)
        await asyncio.sleep(wait_time)

    neo.clear_strip()
    neo.update_strip()

async def meteor_shower_modified_loop():
    """
    تأثير شهاب سريع جدًا: يقطع من LED 150 إلى 0 خلال 3 ثواني فقط
    - طول الشهاب: 40 LED
    - توهج متدرج جميل
    """
    global stop_requested
    trail_length = 40
    delay_per_step = 3 / 151  # تقريبًا 0.0198 ثانية لكل خطوة

    while not stop_requested:
        start_pos = random.randint(150, 160)
        color = (
            random.randint(150, 255),
            random.randint(150, 255),
            random.randint(200, 255)
        )

        for pos in range(start_pos, -trail_length, -1):
            if stop_requested:
                break

            neo.clear_strip()

            for i in range(trail_length):
                led_pos = pos - i
                if 0 <= led_pos < NUM_LEDS:
                    intensity = 1.0 - (i / trail_length)
                    glow_intensity = intensity * 0.7
                    r = int(color[0] * intensity)
                    g = int(color[1] * intensity)
                    b = int(color[2] * intensity)

                    r = min(r + int(100 * glow_intensity), 255)
                    g = min(g + int(100 * glow_intensity), 255)
                    b = min(b + int(255 * glow_intensity), 255)

                    neo.set_led_color(
                        led_pos,
                        int(r * BRIGHTNESS_SCALE),
                        int(g * BRIGHTNESS_SCALE),
                        int(b * BRIGHTNESS_SCALE)
                    )

            neo.update_strip()
            await asyncio.sleep(delay_per_step)

    neo.clear_strip()
    neo.update_strip()

async def single_snake_loop():
    """
    إنيميشن الأفعى السريعة جداً:
    - تمشي من LED 150 إلى 0 خلال 3 ثواني فقط
    - طولها 40 LED
    - تنتظر وقت عشوائي من 0 إلى 10 ثواني قبل أن تبدأ مرة ثانية
    """
    global stop_requested
    trail_length = 40
    delay_per_step = 3 / (NUM_LEDS + trail_length)  # تقريبًا 0.0157 ثانية

    while not stop_requested:
        wait_time = random.uniform(0, 10)  # بدل 30، خليناه من 0 إلى 10
        await asyncio.sleep(wait_time)
        
        color = (
            random.randint(100, 255),
            random.randint(100, 255),
            random.randint(100, 255)
        )
        
        for head_pos in range(NUM_LEDS - 1, -trail_length - 1, -1):
            if stop_requested:
                break
            
            neo.clear_strip()
            for t in range(trail_length):
                led_pos = head_pos + t
                if 0 <= led_pos < NUM_LEDS:
                    factor = (trail_length - t) / trail_length
                    r = int(color[0] * factor)
                    g = int(color[1] * factor)
                    b = int(color[2] * factor)
                    neo.set_led_color(
                        led_pos,
                        int(r * BRIGHTNESS_SCALE),
                        int(g * BRIGHTNESS_SCALE),
                        int(b * BRIGHTNESS_SCALE)
                    )
            
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

    neo.clear_strip()
    neo.update_strip()

async def custom_fade_loop(hex_color: str, delay: float = 0.02, steps: int = 10):
    """
    Fade a single hex_color in and out across all LEDs.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for step in range(steps):
            if stop_requested:
                break
            factor = step / (steps - 1)
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)
        if stop_requested:
            break

        for step in range(steps):
            if stop_requested:
                break
            factor = 1 - (step / (steps - 1))
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_blink_loop(hex_color: str, on_duration: float = 0.5, off_duration: float = 0.5):
    """
    Blink a single hex_color on and off across all LEDs.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)
    
    while not stop_requested:
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(on_duration)
        if stop_requested:
            break
        for i in range(NUM_LEDS):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
        await asyncio.sleep(off_duration)
    
    neo.clear_strip()
    neo.update_strip()

async def custom_breathing_loop(hex_color: str, delay: float = 0.02, steps: int = 50):
    """
    Breathing effect with a custom color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for step in range(steps):
            if stop_requested:
                break
            factor = step / (steps - 1)
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)
        if stop_requested:
            break

        for step in range(steps):
            if stop_requested:
                break
            factor = 1 - (step / (steps - 1))
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_meteor_shower_loop(hex_color: str, delay_per_step: float = 0.05, trail_length: int = 12):
    """
    Custom Meteor Shower – single-colored:
    - A small “meteor” of length trail_length moves across the strip
    - All LEDs light up in chosen hex_color
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for head_pos in range(NUM_LEDS - 1, -trail_length - 1, -1):
            if stop_requested:
                break
            neo.clear_strip()
            for t in range(trail_length):
                led_pos = head_pos + t
                if 0 <= led_pos < NUM_LEDS:
                    factor = (trail_length - t) / trail_length
                    r = int(r_base * factor)
                    g = int(g_base * factor)
                    b = int(b_base * factor)
                    neo.set_led_color(
                        led_pos,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

    neo.clear_strip()
    neo.update_strip()

async def custom_pulse_sync_loop(hex_color: str, delay: float = 0.02, steps: int = 20):
    """
    Custom Pulse Sync – all LEDs pulse in the chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for step in range(steps):
            if stop_requested:
                break
            factor = step / (steps - 1)
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)
        if stop_requested:
            break
        for step in range(steps):
            if stop_requested:
                break
            factor = 1 - (step / (steps - 1))
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_glitch_flash_loop(hex_color: str, duration: float = 5.0, interval: float = 0.05):
    """
    Glitch Flash with custom color:
    - Randomly flash chosen color or off across all LEDs for duration seconds.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    start_time = time.time()
    while time.time() - start_time < duration and not stop_requested:
        for i in range(NUM_LEDS):
            if random.random() < 0.5:
                neo.set_led_color(i, 0, 0, 0)
            else:
                neo.set_led_color(i, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(interval)

    neo.clear_strip()
    neo.update_strip()

async def custom_heart_beat_loop(hex_color: str, delay: float = 0.1):
    """
    Custom Heart Beat:
    - Two quick pulses of chosen color, then pause.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        # Pulse one
        for factor in (0.4, 1.0, 0.4):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)
        # Pulse two
        for factor in (0.4, 1.0, 0.4):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            for i in range(NUM_LEDS):
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)
        # Pause
        neo.clear_strip()
        neo.update_strip()
        await asyncio.sleep(1.0)

    neo.clear_strip()
    neo.update_strip()

async def custom_tunnel_effect_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Tunnel Effect:
    - Light moves from both ends toward center in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for step in range((NUM_LEDS // 2) + 1):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.clear_strip()
            for i in range(NUM_LEDS):
                if i == step or i == NUM_LEDS - 1 - step:
                    neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(delay)
        # ثم يعود
        for step in range((NUM_LEDS // 2) + 1):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.clear_strip()
            for i in range(NUM_LEDS):
                if i == (NUM_LEDS // 2) - step or i == (NUM_LEDS // 2) + step:
                    neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_laser_shot_loop(hex_color: str, delay: float = 0.02):
    """
    Custom Laser Shot:
    - A single bright “laser” LED moves from start to end in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.clear_strip()
            neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_sparkling_stars_loop(hex_color: str, interval: float = 0.1):
    """
    Custom Sparkling Stars:
    - Random LEDs light up briefly in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        neo.clear_strip()
        num_stars = random.randint(1, NUM_LEDS // 3)
        for _ in range(num_stars):
            idx = random.randint(0, NUM_LEDS - 1)
            neo.set_led_color(idx, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(interval)

    neo.clear_strip()
    neo.update_strip()

async def custom_strobe_flash_loop(hex_color: str, on_duration: float = 0.05, off_duration: float = 0.05):
    """
    Custom Strobe Flash:
    - All LEDs flash on and off rapidly in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(on_duration)
        if stop_requested:
            break
        neo.clear_strip()
        neo.update_strip()
        await asyncio.sleep(off_duration)

    neo.clear_strip()
    neo.update_strip()

async def custom_knight_rider_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Knight Rider:
    - A single LED bounces back and forth in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    position = 0
    direction = 1

    while not stop_requested:
        neo.clear_strip()
        neo.set_led_color(position, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(delay)
        position += direction
        if position >= NUM_LEDS - 1 or position <= 0:
            direction *= -1

    neo.clear_strip()
    neo.update_strip()

async def custom_bounce_back_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Bounce Back:
    - Similar to Knight Rider but pauses briefly at each end.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    position = 0
    direction = 1

    while not stop_requested:
        neo.clear_strip()
        neo.set_led_color(position, r_base, g_base, b_base)
        neo.update_strip()
        await asyncio.sleep(delay)
        if position == 0 or position == NUM_LEDS - 1:
            await asyncio.sleep(0.2)
        position += direction
        if position > NUM_LEDS - 1:
            position = NUM_LEDS - 1
            direction = -1
        if position < 0:
            position = 0
            direction = 1

    neo.clear_strip()
    neo.update_strip()

async def custom_ripple_touch_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Ripple Touch:
    - Ripple originates from center in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    center = NUM_LEDS // 2

    while not stop_requested:
        for radius in range(center + 1):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.clear_strip()
            left = center - radius
            right = center + radius
            if 0 <= left < NUM_LEDS:
                neo.set_led_color(left, r_base, g_base, b_base)
            if 0 <= right < NUM_LEDS:
                neo.set_led_color(right, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_fire_flicker_loop(hex_color: str, interval: float = 0.1):
    """
    Custom Fire Flicker:
    - LEDs flicker in chosen color with random intensity, simulating a flame.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            factor = random.uniform(0.3, 1.0)
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
        neo.update_strip()
        await asyncio.sleep(interval)

    neo.clear_strip()
    neo.update_strip()

async def custom_color_wipe_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Color Wipe:
    - LEDs light up one by one in chosen color across the strip.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_static_glow_loop(hex_color: str, flicker_interval: float = 0.2):
    """
    Custom Static Glow with Flicker:
    - All LEDs stay lit in chosen color, with slight random brightness flickers.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            factor = random.uniform(0.8, 1.0)
            r = int(r_base * factor)
            g = int(g_base * factor)
            b = int(b_base * factor)
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
        neo.update_strip()
        await asyncio.sleep(flicker_interval)

    neo.clear_strip()
    neo.update_strip()

async def custom_color_echo_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Color Echo:
    - A single LED lights up in chosen color, then “echo” spreads to next LEDs with fading.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)
    echo_steps = 5

    while not stop_requested:
        for start in range(NUM_LEDS):
            if stop_requested:
                neo.clear_strip()
                neo.update_strip()
                return
            neo.clear_strip()
            for step in range(echo_steps):
                pos = start + step
                if 0 <= pos < NUM_LEDS:
                    factor = (echo_steps - step) / echo_steps
                    r = int(r_base * factor)
                    g = int(g_base * factor)
                    b = int(b_base * factor)
                    neo.set_led_color(
                        pos,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_time_warp_loop(hex_color: str, base_delay: float = 0.05):
    """
    Custom Time Warp:
    - LEDs light up in chosen color with speeds that accelerate then decelerate.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)
    max_speed = 0.01
    min_speed = 0.1

    while not stop_requested:
        # Accelerate
        current_delay = min_speed
        while current_delay > max_speed and not stop_requested:
            neo.clear_strip()
            for i in range(NUM_LEDS):
                neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(current_delay)
            current_delay -= 0.005
        # Decelerate
        while current_delay < min_speed and not stop_requested:
            neo.clear_strip()
            for i in range(NUM_LEDS):
                neo.set_led_color(i, r_base, g_base, b_base)
            neo.update_strip()
            await asyncio.sleep(current_delay)
            current_delay += 0.005

    neo.clear_strip()
    neo.update_strip()

async def custom_quantum_flicker_loop(hex_color: str, interval: float = 0.02):
    """
    Custom Quantum Flicker:
    - LEDs flicker randomly in the chosen color, as if quantum particles.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            if random.random() < 0.5:
                neo.set_led_color(i, 0, 0, 0)
            else:
                # Random small brightness variation
                factor = random.uniform(0.5, 1.0)
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
        neo.update_strip()
        await asyncio.sleep(interval)

    neo.clear_strip()
    neo.update_strip()

async def custom_running_lights_loop(hex_color: str, delay: float = 0.05):
    """
    Custom Running Lights:
    - Similar to running_lights_loop but all sparks in chosen color.
    """
    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    spawn_positions = list(range(19, -1, -3))
    sparks = []
    for p in spawn_positions:
        sparks.append({'start': p, 'pos': p, 'color': (r_base, g_base, b_base)})

    while not stop_requested:
        neo.clear_strip()
        for s in sparks:
            if 0 <= s['pos'] < NUM_LEDS:
                neo.set_led_color(s['pos'], *s['color'])
        neo.update_strip()
        await asyncio.sleep(delay)
        for s in sparks:
            s['pos'] -= 1
            if s['pos'] < 0:
                s['pos'] = s['start']
                s['color'] = (r_base, g_base, b_base)
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

            if req.animation_type == "custom_fade":
                if req.hex_color:
                    await custom_fade_loop(req.hex_color)
            elif req.animation_type == "light_one_by_one":
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
            elif req.animation_type == "single_snake":
                await single_snake_loop()
            elif req.animation_type == "solid_color":
                if req.hex_color:
                    r = int(req.hex_color[1:3], 16)
                    g = int(req.hex_color[3:5], 16)
                    b = int(req.hex_color[5:7], 16)
                    for i in range(NUM_LEDS):
                        neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
                    neo.update_strip()
                stop_requested = True

            # Custom animation handlers
            if req.animation_type == "custom_blink":
                if req.hex_color:
                    await custom_blink_loop(req.hex_color)
            elif req.animation_type == "custom_breathing":
                if req.hex_color:
                    await custom_breathing_loop(req.hex_color)
            elif req.animation_type == "custom_meteor_shower":
                if req.hex_color:
                    await custom_meteor_shower_loop(req.hex_color)
            elif req.animation_type == "custom_pulse_sync":
                if req.hex_color:
                    await custom_pulse_sync_loop(req.hex_color)
            elif req.animation_type == "custom_glitch_flash":
                if req.hex_color:
                    await custom_glitch_flash_loop(req.hex_color)
            elif req.animation_type == "custom_heart_beat":
                if req.hex_color:
                    await custom_heart_beat_loop(req.hex_color)
            elif req.animation_type == "custom_tunnel_effect":
                if req.hex_color:
                    await custom_tunnel_effect_loop(req.hex_color)
            elif req.animation_type == "custom_laser_shot":
                if req.hex_color:
                    await custom_laser_shot_loop(req.hex_color)
            elif req.animation_type == "custom_sparkling_stars":
                if req.hex_color:
                    await custom_sparkling_stars_loop(req.hex_color)
            elif req.animation_type == "custom_strobe_flash":
                if req.hex_color:
                    await custom_strobe_flash_loop(req.hex_color)
            elif req.animation_type == "custom_knight_rider":
                if req.hex_color:
                    await custom_knight_rider_loop(req.hex_color)
            elif req.animation_type == "custom_bounce_back":
                if req.hex_color:
                    await custom_bounce_back_loop(req.hex_color)
            elif req.animation_type == "custom_ripple_touch":
                if req.hex_color:
                    await custom_ripple_touch_loop(req.hex_color)
            elif req.animation_type == "custom_fire_flicker":
                if req.hex_color:
                    await custom_fire_flicker_loop(req.hex_color)
            elif req.animation_type == "custom_color_wipe":
                if req.hex_color:
                    await custom_color_wipe_loop(req.hex_color)
            elif req.animation_type == "custom_static_glow":
                if req.hex_color:
                    await custom_static_glow_loop(req.hex_color)
            elif req.animation_type == "custom_color_echo":
                if req.hex_color:
                    await custom_color_echo_loop(req.hex_color)
            elif req.animation_type == "custom_time_warp":
                if req.hex_color:
                    await custom_time_warp_loop(req.hex_color)
            elif req.animation_type == "custom_quantum_flicker":
                if req.hex_color:
                    await custom_quantum_flicker_loop(req.hex_color)
            elif req.animation_type == "custom_running_lights":
                if req.hex_color:
                    await custom_running_lights_loop(req.hex_color)

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
        stop_requested = False
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
            neo.set_led_color(
                        i,
                        int(r* BRIGHTNESS_SCALE),
                        int(g* BRIGHTNESS_SCALE),
                        int(b* BRIGHTNESS_SCALE)
                    )
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
