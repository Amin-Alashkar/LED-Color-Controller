# server.py

import asyncio, threading, time, json, colorsys, random, math
from fastapi import FastAPI
from pydantic import BaseModel
from pi5neo import Pi5Neo
from collections import deque
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional


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
    hex_color: str | None = None   
    
class ColorRequest(BaseModel):
    hex_color: str



class BrightnessRequest(BaseModel):
    brightness: float

@app.post("/set_brightness")
async def set_brightness(req: BrightnessRequest):
    global BRIGHTNESS_SCALE
    if 0 <= req.brightness <= 1:
        BRIGHTNESS_SCALE = req.brightness
        return {"status": "brightness_updated", "brightness": BRIGHTNESS_SCALE}
    else:
        return {"status": "error", "message": "Brightness must be between 0 and 1"}

        
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
        (255, 255, 255),  # أبيض
        (255,   0,   0),  # أحمر
        (0,     0, 255),  # أزرق
        (0,   255,   0),  # أخضر
        (255, 255,   0),  # أصفر
        (255,   0, 255),  # أرجواني
        (0,   255, 255),  # تركواز
    ]
    
    while not stop_requested:
        # اختيار لون عشوائي من القائمة
        r_t, g_t, b_t = random.choice(COLORS)
        
        # fade-in (التدرج من الأسود إلى اللون)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)
        
        # fade-out (التدرج من اللون إلى الأسود)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)

async def pulse_sync_loop(delay: float = 0.03, steps: int = 20):
    global stop_requested

    # دالة لتوليد ألوان عشوائية
    def get_random_color():
        return (
            random.randint(50, 255),   # الأحمر
            random.randint(50, 255),   # الأخضر  
            random.randint(50, 255)    # الأزرق
        )

    position = 0
    direction = 1
    # طول عشوائي بين 10 و30
    trail_length = random.randint(10, 30)
    # لون عشوائي بداية
    r_base, g_base, b_base = get_random_color()

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
            # يبقى الرأس فقط مضيء والباقي يتلاشى
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
                await asyncio.sleep(delay)

            # بعد ما الرأس يضل لحاله → نغير اللون والطول
            r_base, g_base, b_base = get_random_color()
            trail_length = random.randint(10, 30)  # طول عشوائي جديد

            # عكس الاتجاه
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
        (255, 255, 255),  # أبيض
        (255, 255, 229),
        (255, 255, 178),
        (255, 255,   0),  # أصفر
        (255, 127,   0),  # برتقالي
        (255,   0,   0),  # أحمر
        (255,   0, 255),  # أرجواني
        (  0,   0, 255),  # أزرق
        (  0, 255, 255),  # تركواز
        (  0, 255,   0)   # أخضر
    ]
    
    while not stop_requested:
        # اختيار لون عشوائي من القائمة
        r, g, b = random.choice(color_steps)
        
        # إضاءة كل الليدات باللون المختار
        for i in range(NUM_LEDS):
            neo.set_led_color(
                i,
                int(r * BRIGHTNESS_SCALE),
                int(g * BRIGHTNESS_SCALE),
                int(b * BRIGHTNESS_SCALE)
            )
        neo.update_strip()
        await asyncio.sleep(delay)
        
        if stop_requested:
            break
        
        # إطفاء كل الليدات
        for i in range(NUM_LEDS):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
        await asyncio.sleep(delay)

    # تنظيف بعد انتهاء اللوب
    for i in range(NUM_LEDS):
        neo.set_led_color(i, 0, 0, 0)
    neo.update_strip()

async def meteor_shower_loop(delay_per_step: float = 0.05, trail_length: int = 15):
    global stop_requested


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

    # ضبط الفاصل الزمني لإطلاق الأفعى بحيث يبقى بين كل رأس وآخر 5 أضواء سوداء
    spawn_interval = trail_length + 30  # 12 + 5 = 17

    while not stop_requested:
        # قائمة تمثل الأفعى النشطة حاليًّا
        active_snakes = []
        global_frame = 0
        snake_index = 0

        # طلق الأفعى الواحدة تلو الأخرى بانتظام
        while not stop_requested:
            # إذا حان وقت إطلاق أفعى جديدة
            if snake_index < total_snakes and global_frame >= snake_index * spawn_interval:
                #  الأفعى إلى القائمة (مع حالة التقدّم بدايةً 0)
                active_snakes.append({
                    'id': snake_index,
                    'progress': 0  # رقم الإطار داخل الأفعى
                })
                snake_index += 1

            if snake_index >= total_snakes and not active_snakes:
                break

            # مسح الشريط
            neo.clear_strip()

            # حدّث كل أفعىt
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



async def random_colors_loop(delay_per_step: float = 0.05, min_trail_length: int = 5, max_trail_length: int = 20):
    global stop_requested

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

    while not stop_requested:
        # مسح الشريط
        neo.clear_strip()
        neo.update_strip()

        # قائمة تمثل الأفاعي النشطة حاليًا
        active_snakes = []
        global_frame = 0
        
        # وقت إطلاق الأفعى التالية (يبدأ بإطلاق أول أفعى فورًا)
        next_spawn_time = 0
        last_snake_head_pos = -20  # وضعية تخيلية للأفعى السابقة (خارج النطاق)

        while not stop_requested:
            # إذا حان وقت إطلاق أفعى جديدة ولم نطلب التوقف
            if global_frame >= next_spawn_time and not stop_requested:
                # تحديد تباعد عشوائي عن الأفعى السابقة (3 إلى 15 فراغ)
                min_gap = 3
                max_gap = 15
                
                # إذا كانت هناك أفعى سابقة، نتحقق من التباعد
                if last_snake_head_pos >= 0:
                    current_gap = global_frame - last_snake_head_pos
                    if current_gap < min_gap:
                        # إذا كان التباعد أقل من الحد الأدنى، ننتظر
                        next_spawn_time = global_frame + (min_gap - current_gap)
                    else:
                        # تباعد عشوائي بين min_gap و max_gap
                        gap = random.randint(min_gap, max_gap)
                        next_spawn_time = global_frame + gap
                else:
                    # أول أفعى - نطلقها فورًا
                    gap = 0
                    next_spawn_time = global_frame + gap

                # توليد أفعى عشوائية
                trail_length = random.randint(min_trail_length, max_trail_length)
                color_base = random.choice(SNAKE_COLORS)
                
                # إضافة الأفعى الجديدة
                active_snakes.append({
                    'trail_length': trail_length,
                    'color_base': color_base,
                    'progress': 0,
                    'head_start_frame': global_frame + gap  # توقيت بداية الرأس
                })
                
                last_snake_head_pos = global_frame + gap

            # مسح الشريط
            neo.clear_strip()

            # تحديث ورسم كل الأفاعي النشطة
            snakes_to_remove = []
            
            for snake in active_snakes:
                trail_length = snake['trail_length']
                color_base = snake['color_base']
                progress = snake['progress']
                
                # حساب وضعية الرأس (تبدأ من خارج الشريط وتتحرك داخله)
                head_pos = NUM_LEDS - progress
                
                # رسم ذيل الأفعى
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
                            int(r * BRIGHTNESS_SCALE),
                            int(g * BRIGHTNESS_SCALE),
                            int(b * BRIGHTNESS_SCALE)
                        )
                
                # تحديث تقدم الأفعى
                snake['progress'] += 1
                
                # إذا تجاوزت الأفعى المسار كاملاً (خرج الذيل كله)
                if snake['progress'] > NUM_LEDS + trail_length:
                    snakes_to_remove.append(snake)

            # إزالة الأفاعي المنتهية
            for snake in snakes_to_remove:
                active_snakes.remove(snake)

            # تطبيق التحديث على الشريط
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

            global_frame += 1
            
            # إذا لم يكن هناك أفاعي نشطة ولم نطلب إطلاق المزيد، نكسر الدورة
            if not active_snakes and global_frame > next_spawn_time + 100:
                break

        # استراحة قصيرة بين الدورات
        if not stop_requested:
            await asyncio.sleep(1)

    # تنظيف بعد انتهاء اللوب
    neo.clear_strip()
    neo.update_strip()

async def running_lights_loop(delay: float = 0.05):

    global stop_requested
    spawn_positions = list(range(149, -1, -3))  # [19,16,13,10,7,4,1]
    # نهيئ الشرارات الثلاث في المواقع الأصلية
    sparks = []
    for p in spawn_positions:
        color = (random.randint(1, 255), random.randint(1, 255), random.randint(1, 255))
        sparks.append({'start': p, 'pos': p, 'color': color})

    while not stop_requested:
        neo.clear_strip()
        # رسم كل شرارة في موقع الحالي
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
        # اختيار لون عشوائي من القائمة
        r_base, g_base, b_base = random.choice(COLORS)
        
        # fade-in (التنفس للإضاءة)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)
        
        # fade-out (التنفس للإطفاء)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)

async def fireworks_burst_loop():

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

    FADE_STEPS = 20
    FRAME_SLEEP = 0.012  # إطار أسرع = حركة أنعم

    while not stop_requested:
        color = random.choice(COLORS)
        rocket_len = random.randint(4, 6)              # طول من 4 إلى 6
        explosion_pos = random.randint(NUM_LEDS//4, 3*NUM_LEDS//4)

        # 1. الاشتعال (Ignition) — رأس واحد يومض (2-4s)
        ignition_time = random.uniform(2.0, 4.0)
        t0 = asyncio.get_event_loop().time()
        while (asyncio.get_event_loop().time() - t0 < ignition_time) and not stop_requested:
            now = asyncio.get_event_loop().time()
            # وميض أسرع أثناء الاشتعال
            pulse = (math.sin(now * 12.0) + 1.0) / 2.0  # تردد أعلى
            head_brightness = 0.4 + 0.6 * pulse  # يتراوح بين 0.4 - 1.0

            neo.clear_strip()
            neo.set_led_color(
                0,
                int(color[0] * head_brightness * BRIGHTNESS_SCALE),
                int(color[1] * head_brightness * BRIGHTNESS_SCALE),
                int(color[2] * head_brightness * BRIGHTNESS_SCALE)
            )
            neo.update_strip()
            await asyncio.sleep(FRAME_SLEEP)

        if stop_requested:
            break

        # حركة الصاروخ تبدأ من خارج الشريط (start_pos)
        start_pos = -rocket_len
        # ختار نقطة وسطية عشوائية للانطلاق البطيء (لا تصل للانفجار)a
        mid_fraction = random.uniform(0.25, 0.55)
        mid_pos = start_pos + mid_fraction * (explosion_pos - start_pos)

        # 2. الانطلاق البطيء (1-3s) — يصل إلى mid_pos
        slow_time = random.uniform(1.0, 3.0)
        t_start = asyncio.get_event_loop().time()
        while not stop_requested:
            elapsed = asyncio.get_event_loop().time() - t_start
            progress = min(1.0, elapsed / slow_time)
            eased = (1 - math.cos(progress * math.pi)) / 2  # smooth ease-in-out
            head_pos_f = start_pos + eased * (mid_pos - start_pos)
            head_idx = int(round(head_pos_f))

            # رسم الصاروخ (رأس يومض، الذيل أقل سطوع)
            neo.clear_strip()
            now = asyncio.get_event_loop().time()
            pulse = (math.sin(now * 10.0) + 1.0) / 2.0  # وميض خلال الرحلة
            for t in range(rocket_len):
                led_pos = head_idx - t
                if 0 <= led_pos < NUM_LEDS:
                    # الرأس أعلى سطوع ويومض
                    if t == 0:
                        factor = 0.6 + 0.4 * pulse  # بين 0.6 و1.0
                    else:
                        factor = (1.0 - (t / rocket_len)) * 0.6  # الذيل أضعف
                    r = int(color[0] * factor * BRIGHTNESS_SCALE)
                    g = int(color[1] * factor * BRIGHTNESS_SCALE)
                    b = int(color[2] * factor * BRIGHTNESS_SCALE)
                    neo.set_led_color(led_pos, r, g, b)
            neo.update_strip()

            # إذا وصل الرأس أو تخطى منتصف الهدف (ننتقل للمرحلة التالية)
            if progress >= 1.0:
                break
            await asyncio.sleep(FRAME_SLEEP)

        if stop_requested:
            break

        # =======================
        # 3. الانطلاق السريع — من mid_pos إلى explosion_pos (0.2-0.8s)
        # انفجار يحدث فور وصول الرأس للموقع (no waiting)
        # =======================
        fast_time = random.uniform(0.2, 0.8)
        t_start = asyncio.get_event_loop().time()
        #----------------------------------
        start_f = head_pos_f if 'head_pos_f' in locals() else start_pos
        target_f = explosion_pos
        while not stop_requested:
            elapsed = asyncio.get_event_loop().time() - t_start
            progress = min(1.0, elapsed / fast_time)
            eased = math.sin(progress * math.pi / 2)  # سريع ثم يتباطأ خفيف
            head_pos_f = start_f + eased * (target_f - start_f)
            head_idx = int(round(head_pos_f))

            neo.clear_strip()
            now = asyncio.get_event_loop().time()
            pulse = (math.sin(now * 14.0) + 1.0) / 2.0  # وميض أسرع قليلاً
            for t in range(rocket_len):
                led_pos = head_idx - t
                if 0 <= led_pos < NUM_LEDS:
                    if t == 0:
                        factor = 0.65 + 0.35 * pulse
                    else:
                        factor = (1.0 - (t / rocket_len)) * 0.6
                    r = int(color[0] * factor * BRIGHTNESS_SCALE)
                    g = int(color[1] * factor * BRIGHTNESS_SCALE)
                    b = int(color[2] * factor * BRIGHTNESS_SCALE)
                    neo.set_led_color(led_pos, r, g, b)
            neo.update_strip()

            # انفجر فور ما الرأس يصل أو يتجاوز موقع الانفجار
            if head_pos_f >= explosion_pos or progress >= 1.0:
                break
            await asyncio.sleep(FRAME_SLEEP)

        if stop_requested:
            break

        # 4. الانفجار (فوراً)
        neo.clear_strip()
        for i in range(NUM_LEDS):
            r = int(color[0] * BRIGHTNESS_SCALE)
            g = int(color[1] * BRIGHTNESS_SCALE)
            b = int(color[2] * BRIGHTNESS_SCALE)
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
        await asyncio.sleep(0.2)

        if stop_requested:
            break

        # 5. التلاشي التدريجي
        for fade_step in range(FADE_STEPS):
            if stop_requested:
                break
            factor = 1.0 - (fade_step / FADE_STEPS)
            neo.clear_strip()
            for i in range(NUM_LEDS):
                r = int(color[0] * factor * BRIGHTNESS_SCALE)
                g = int(color[1] * factor * BRIGHTNESS_SCALE)
                b = int(color[2] * factor * BRIGHTNESS_SCALE)
                neo.set_led_color(i, r, g, b)
            neo.update_strip()
            await asyncio.sleep(0.05)

        if stop_requested:
            break

        neo.clear_strip()
        neo.update_strip()

        # 6. انتظار قبل الصاروخ التالي (عشوائي)
        wait_time = random.uniform(0.5, 4.0)
        await asyncio.sleep(wait_time)

    neo.clear_strip()
    neo.update_strip()

async def meteor_shower_modified_loop():

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

    global stop_requested

    colors = [
        (200, 50, 50), (50, 200, 50), (50, 50, 200),   # فاتحة
        (200, 200, 50), (50, 200, 200),
        (100, 20, 20), (20, 100, 20), (20, 20, 100),   # غامقة
        (100, 100, 30), (30, 100, 100)
    ]

    while not stop_requested:
        trail_length = random.randint(15, 40)
        color = random.choice(colors)

        travel_time = random.uniform(3, 5)
        wait_time = random.uniform(5, 20)
        
        # انتظار عشوائي قبل بدء الشهاب التالي
        await asyncio.sleep(wait_time)

        start_time = asyncio.get_event_loop().time()

        # تحريك الشهاب الحالي
        while not stop_requested:
            elapsed = asyncio.get_event_loop().time() - start_time
            progress = elapsed / travel_time

            if progress >= 1.0:
                break  # انتهاء حركة الشهاب الحالي

            # curve: بطيء → سريع → بطيء
            eased_progress = (1 - math.cos(progress * math.pi)) / 2

            # الرأس يبدأ من خارج الشريط (-trail_length) ويمشي لآخر LED
            head_pos = int((1 - eased_progress) * (NUM_LEDS + trail_length)) - trail_length

            # إذا الذيل تخطى آخر LED → خلص
            if head_pos > NUM_LEDS:
                break

            neo.clear_strip()
            for t in range(trail_length):
                led_pos = head_pos + t
                if 0 <= led_pos < NUM_LEDS:
                    factor = 1 - (t / trail_length)  # الرأس = أعلى سطوع
                    
                    # fade-in في البداية للشهاب الجديد فقط
                    if elapsed < 0.5:
                        factor *= min(1.0, elapsed / 0.5)

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
            await asyncio.sleep(0.01)

        # تنظيف بعد انتهاء الشهاب
        if not stop_requested:
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
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    
    while not stop_requested:
        for i in range(NUM_LEDS):
            neo.set_led_color(i,
                            int(r * BRIGHTNESS_SCALE),
                            int(g * BRIGHTNESS_SCALE),
                            int(b * BRIGHTNESS_SCALE) )
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

async def custom_meteor_shower_loop(hex_color: str, travel_time: float = None, trail_length: int = None):

    global stop_requested

    # تحويل اللون من HEX إلى RGB
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        # تحديد طول الذيل ووقت السفر (عشوائي إذا لم يتم تحديده)
        current_trail_length = trail_length if trail_length is not None else random.randint(15, 40)
        current_travel_time = travel_time if travel_time is not None else random.uniform(3, 5)
        
        wait_time = random.uniform(5, 20)
        await asyncio.sleep(wait_time)

        start_time = asyncio.get_event_loop().time()

        # تحريك الشهاب الحالي
        while not stop_requested:
            elapsed = asyncio.get_event_loop().time() - start_time
            progress = elapsed / current_travel_time

            if progress >= 1.0:
                break  # انتهاء حركة الشهاب الحالي

            # curve: بطيء → سريع → بطيء
            eased_progress = (1 - math.cos(progress * math.pi)) / 2

            # الرأس يبدأ من خارج الشريط (-trail_length) ويمشي لآخر LED
            head_pos = int((1 - eased_progress) * (NUM_LEDS + current_trail_length)) - current_trail_length

            # إذا الذيل تخطى آخر LED → خلص
            if head_pos > NUM_LEDS:
                break

            neo.clear_strip()
            for t in range(current_trail_length):
                led_pos = head_pos + t
                if 0 <= led_pos < NUM_LEDS:
                    factor = 1 - (t / current_trail_length)  # الرأس = أعلى سطوع
                    
                    # fade-in في البداية للشهاب الجديد فقط
                    if elapsed < 0.5:
                        factor *= min(1.0, elapsed / 0.5)

                    r = int(r_base * factor)
                    g = int(g_base * factor)
                    b = int(b_base * factor)

                    neo.set_led_color(
                        led_pos,
                        int(r * BRIGHTNESS_SCALE),
                        int(g * BRIGHTNESS_SCALE),
                        int(b * BRIGHTNESS_SCALE)
                    )

            neo.update_strip()
            await asyncio.sleep(0.01)

        # تنظيف بعد انتهاء الشهاب
        if not stop_requested:
            neo.clear_strip()
            neo.update_strip()

async def custom_pulse_sync_loop(hex_color: str, delay: float = None, steps: int = 20):

    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    if delay is None:
        delay = 0.03  # زي النسخة الأصلية

    while not stop_requested:
        # تأخير عشوائي بين كل نبضة
        wait_time = random.uniform(0, 10)
        await asyncio.sleep(wait_time)

        # التصاعد (إضاءة تدريجية)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)

        # التناقص (الانطفاء تدريجي)
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
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

    
async def custom_glitch_flash_loop(hex_color: str, interval: float = 0.05):

    global stop_requested
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    while not stop_requested:
        for i in range(NUM_LEDS):
            if random.random() < 0.5:
                neo.set_led_color(i, 0, 0, 0)
            else:
                neo.set_led_color(i, 
                                int(r * BRIGHTNESS_SCALE),
                                int(g * BRIGHTNESS_SCALE),
                                int(b * BRIGHTNESS_SCALE))
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



async def custom_tunnel_effect_loop(hex_color: str, delay: float = 0.05, snake_length: int = 5):
    global stop_requested
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    mid = NUM_LEDS // 2

    while not stop_requested:
        # Phase 1: الأفعى من الطرفين تدخل نحو المركز
        for step in range(mid + snake_length):
            if stop_requested:
                return
            neo.clear_strip()

            # يمين → يسار
            for i in range(snake_length):
                pos = step - i
                if 0 <= pos < mid:
                    factor = (snake_length - i) / snake_length
                    neo.set_led_color(pos, int(r * factor), int(g * factor), int(b * factor))

            # يسار → يمين
            for i in range(snake_length):
                pos = NUM_LEDS - 1 - (step - i)
                if mid <= pos < NUM_LEDS:
                    factor = (snake_length - i) / snake_length
                    neo.set_led_color(pos, int(r * factor), int(g * factor), int(b * factor))

            neo.update_strip()
            await asyncio.sleep(delay)

        # Phase 2: انفجار في المنتصف
        if stop_requested:
            return

        for brightness in range(255, -1, -15):  # يتلاشى بالتدريج
            for i in range(NUM_LEDS):
                neo.set_led_color(i, int(r * brightness / 255), int(g * brightness / 255), int(b * brightness / 255))
            neo.update_strip()
            await asyncio.sleep(0.03)

        neo.clear_strip()
        neo.update_strip()

        # Phase 3: استراحة عشوائية قبل التكرار
        wait_time = random.uniform(1, 10)
        for _ in range(int(wait_time / 0.1)):
            if stop_requested:
                return
            # await asyncio.sleep(0.1)

async def custom_laser_shot_loop(hex_color: str, delay: float = 0.02, trail_length: int = 4):

    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    while not stop_requested:
        # Forward
        for i in range(NUM_LEDS):
            if stop_requested:
                break
            neo.clear_strip()
            for t in range(trail_length):
                index = i - t
                if 0 <= index < NUM_LEDS:
                    fade = 1.0 - (t / trail_length)
                    r = int(r_base * fade)
                    g = int(g_base * fade)
                    b = int(b_base * fade)
                    neo.set_led_color(index, r, g, b)
            neo.update_strip()
            await asyncio.sleep(delay)

        # Backward
        for i in range(NUM_LEDS - 2, -1, -1):
            if stop_requested:
                break
            neo.clear_strip()
            for t in range(trail_length):
                index = i + t
                if 0 <= index < NUM_LEDS:
                    fade = 1.0 - (t / trail_length)
                    r = int(r_base * fade)
                    g = int(g_base * fade)
                    b = int(b_base * fade)
                    neo.set_led_color(index, r, g, b)
            neo.update_strip()
            # await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

class Star:
    def __init__(self, color):
        self.color = color
        self.index = None
        self.duration = random.uniform(2.5, 4.5)  # كل نجمة إلها مدة لمعان مختلفة
        self.brightness = 0
        self.fading_in = True
        self.active = True

    async def sparkle_forever(self):
        step_time = 0.05
        steps = int(self.duration / step_time / 2)

        # تأخير عشوائي قبل بداية كل نجمة عشان يضهروا تدريجيًا
        await asyncio.sleep(random.uniform(0.2, 4.0))

        while self.active:
            # كل دورة بمكان عشوائي
            self.index = random.randint(0, NUM_LEDS - 1)

            # Fade in
            for i in range(steps):
                if not self.active:
                    break
                self.brightness = int(255 * (i / steps))
                neo.set_led_color(
                    self.index,
                    (self.color[0] * self.brightness) // 255,
                    (self.color[1] * self.brightness) // 255,
                    (self.color[2] * self.brightness) // 255
                )
                await asyncio.sleep(step_time)

            await asyncio.sleep(random.uniform(0.1, 0.3))  # لمعة سريعة

            # Fade out
            for i in range(steps):
                if not self.active:
                    break
                self.brightness = int(255 * ((steps - i) / steps))
                neo.set_led_color(
                    self.index,
                    (self.color[0] * self.brightness) // 255,
                    (self.color[1] * self.brightness) // 255,
                    (self.color[2] * self.brightness) // 255
                )
                await asyncio.sleep(step_time)

            # إطفاء
            neo.set_led_color(self.index, 0, 0, 0)

            # استراحة قبل الدورة الجديدة
            await asyncio.sleep(random.uniform(0.2, 0.5))


async def custom_sparkling_stars_loop(hex_color: str):
    global stop_requested
    neo.clear_strip()
    neo.update_strip()

    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    stars = [Star((r, g, b)) for _ in range(80)]
    tasks = [asyncio.create_task(star.sparkle_forever()) for star in stars]

    while not stop_requested:
        neo.update_strip()
        await asyncio.sleep(0.05)

    # لما يتوقف كل شي
    for star in stars:
        star.active = False
    await asyncio.gather(*tasks)
    neo.clear_strip()
    neo.update_strip()

async def custom_strobe_flash_loop(hex_color: str, on_duration: float = 0.05, off_duration: float = 0.05):

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

async def custom_knight_rider_loop(hex_color: str, delay: float = 0.03):

    global stop_requested
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    mid = NUM_LEDS // 2
    offset = 0
    expand = True  # True: outwards, False: inwards

    while not stop_requested:
        neo.clear_strip()

        # رسم أزواج من المنتصف للخارج والعكس
        for i in range(5):  # عدد النقاط المتقابلة
            left = mid - offset - i * 4
            right = mid + offset + i * 4
            for idx in [left, right]:
                if 0 <= idx < NUM_LEDS:
                    neo.set_led_color(idx, r, g, b)

        neo.update_strip()
        await asyncio.sleep(delay)

        if expand:
            offset += 1
            if mid + offset >= NUM_LEDS - 1 or mid - offset <= 0:
                expand = False
        else:
            offset -= 1
            if offset <= 0:
                expand = True

    neo.clear_strip()
    neo.update_strip()

class Segment:
    def __init__(self, start, size, color):
        self.position = start
        self.size = size
        self.color = color
        self.active = True

    def draw(self):
        for i in range(self.size):
            idx = self.position + i
            if 0 <= idx < NUM_LEDS:
                neo.set_led_color(idx, *self.color)

    def move(self, step=1):
        self.position += step
        if self.position >= NUM_LEDS:
            self.active = False


async def custom_bounce_back_loop(hex_color: str, delay: float = 0.03):

    global stop_requested
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    segments = []
    last_spawn_time = asyncio.get_event_loop().time()
    next_spawn_delay = random.uniform(0.3, 1.0)  # up to 10 LEDs depending on speed

    while not stop_requested:
        neo.clear_strip()

        now = asyncio.get_event_loop().time()
        if now - last_spawn_time >= next_spawn_delay:
            segment_size = random.randint(4, 7)
            segments.append(Segment(start=-segment_size, size=segment_size, color=(r, g, b)))
            last_spawn_time = now
            next_spawn_delay = random.uniform(0.2, 1.0)  # << مسافة عشوائية

        # Move and draw all segments
        for segment in segments:
            if segment.active:
                segment.move(step=1)
                segment.draw()


        segments = [s for s in segments if s.active]

        neo.update_strip()
        await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

class Ripple:
    def __init__(self, center, color):
        self.center = center
        self.radius = 0
        self.color = color
        self.active = True

    def draw(self):
        left = self.center - self.radius
        right = self.center + self.radius

        brightness = max(0, 255 - self.radius * 20)

        r = (self.color[0] * brightness) // 255
        g = (self.color[1] * brightness) // 255
        b = (self.color[2] * brightness) // 255

        if 0 <= left < NUM_LEDS:
            neo.set_led_color(left, r, g, b)
        if 0 <= right < NUM_LEDS:
            neo.set_led_color(right, r, g, b)

        self.radius += 1
        if left < 0 and right >= NUM_LEDS:
            self.active = False


async def custom_ripple_touch_loop(hex_color: str, delay: float = 0.03):

    global stop_requested
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    ripples = []
    last_spawn = asyncio.get_event_loop().time()
    next_spawn_delay = random.uniform(0.1, 0.4)

    while not stop_requested:
        now = asyncio.get_event_loop().time()
        if now - last_spawn >= next_spawn_delay:
            center = random.randint(20, NUM_LEDS - 20)  
            ripples.append(Ripple(center=center, color=(r, g, b)))
            last_spawn = now
            next_spawn_delay = random.uniform(0.1, 0.5)

        neo.clear_strip()
        for ripple in ripples:
            if ripple.active:
                ripple.draw()
        ripples = [r for r in ripples if r.active]

        neo.update_strip()
        await asyncio.sleep(delay)

    neo.clear_strip()
    neo.update_strip()

async def custom_fire_flicker_loop(hex_color: str, interval: float = 0.1):

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

class Snake:
    def __init__(self, start_pos=0, length=10):
        self.position = start_pos
        self.length = length
        self.done = False

    def get_tail(self):
        return self.position - self.length

    def get_body_indexes(self):
        return [
            idx for idx in range(self.position, self.position - self.length, -1)
            if 0 <= idx < NUM_LEDS
        ]

    def move(self):
        self.position += 1
        if self.get_tail() >= NUM_LEDS:
            self.done = True


async def custom_color_wipe_loop(hex_color: str, delay: float = 0.05):
    global stop_requested

    # استخراج قيم اللون من HEX
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)

    # إعداد لون الخلفية (نصف السطوع)
    DIM_LEVEL = 100  # 100/255 ≈ 39% سطوع
    background_color = (
        (r * DIM_LEVEL) // 255,
        (g * DIM_LEVEL) // 255,
        (b * DIM_LEVEL) // 255
    )

    # إضاءة الخلفية الأولية
    for i in range(NUM_LEDS):
        neo.set_led_color(i, *background_color)
    neo.update_strip()

    snakes = []
    gap_counter = 0
    next_gap = 0  # سيتم تعيينه عند إضافة أول ثعبان

    while not stop_requested:
        # إضافة ثعبان جديد عند انتهاء الفجوة
        if gap_counter <= 0:
            snakes.append(Snake(start_pos=0))
            gap_in_space = random.randint(3, 10)  # الفجوة المرئية بين الثعابين
            next_gap = 10 + gap_in_space  # الانتظار حتى يترك الثعبان السابق مسافة كافية
            gap_counter = next_gap
        else:
            gap_counter -= 1

        # معالجة كل ثعبان
        for s in snakes:
            # إعادة لون الخلفية لموضع الذيل
            tail_idx = s.get_tail()
            if 0 <= tail_idx < NUM_LEDS:
                neo.set_led_color(tail_idx, *background_color)
            
            # حساب التدرج اللوني لجسم الثعبان
            body_indexes = s.get_body_indexes()
            if body_indexes:  # التأكد من وجود جسم ظاهر
                head_pos = s.position
                tail_pos = s.get_tail() + 1  # بداية الذيل الفعلية
                
                for idx in body_indexes:
                    # حساب المسافة من الرأس (0 = الرأس, 1 = الذيل)
                    distance_from_head = abs(head_pos - idx) / (s.length - 1)
                    
                    # حساب عامل التخفيف (1.0 عند الرأس, 0.6 عند الذيل)
                    fade_factor = 1.0 - (0.1 * distance_from_head)
                    
                    # تطبيق التدرج على اللون
                    led_color = (
                        int(r * fade_factor),
                        int(g * fade_factor),
                        int(b * fade_factor)
                    )
                    neo.set_led_color(idx, *led_color)
            
            # تحريك الثعبان
            s.move()

        # إزالة الثعابين المنتهية
        snakes = [s for s in snakes if not s.done]

        neo.update_strip()
        await asyncio.sleep(delay)

    # تنظيف الشريط عند الطلب
    neo.clear_strip()
    neo.update_strip()


async def custom_static_glow_loop(hex_color: str, flicker_interval: float = 0.2):

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

class Echo:
    def __init__(self, center, color, max_radius):
        self.center = center
        self.color = color
        self.radius = 0
        self.max_radius = max_radius
        self.alive = True

    def update(self):
        self.radius += 1
        if self.radius > self.max_radius:
            self.alive = False

    def apply(self, strip):
        for offset in range(-self.radius, self.radius + 1):
            pos = self.center + offset
            if 0 <= pos < NUM_LEDS:
                fade = max(0, (self.max_radius - abs(offset)) / self.max_radius)
                r = int(self.color[0] * fade)
                g = int(self.color[1] * fade)
                b = int(self.color[2] * fade)
                strip[pos] = (r, g, b)


async def custom_color_echo_loop(hex_color: str, delay: float = 0.05):

    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    color = (r_base, g_base, b_base)
    echoes = []

    while not stop_requested:
        # إضافة صدى جديد من مركز عشوائي
        if random.random() < 0.2:  # نسبة ظهور موجة جديدة
            center = random.randint(0, NUM_LEDS - 1)
            echoes.append(Echo(center, color, max_radius=10))

        # مسح الشريط (كتم اللمبات)
        strip = [(0, 0, 0)] * NUM_LEDS

        # تحديث الموجات الحالية
        for echo in echoes:
            echo.apply(strip)
            echo.update()

        # إزالة الموجات الميتة
        echoes = [e for e in echoes if e.alive]

        # تحديث الشريط الفعلي
        for i, (r, g, b) in enumerate(strip):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()

        await asyncio.sleep(delay)

    # عند الإيقاف
    neo.clear_strip()
    neo.update_strip()

async def custom_time_warp_loop(hex_color: str, base_delay: float = 0.05):

    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    max_speed = 0.01
    min_speed = 0.12
    wave_size = 10  # حجم الموجة المضيئة
    t = 0  # زمن وهمي

    while not stop_requested:
        neo.clear_strip()

        # حساب السرعة باستخدام دالة ساين (يعطي تسارع وتباطؤ بشكل طبيعي)
        speed_factor = (math.sin(t) + 1) / 2  # بين 0 و 1
        current_delay = max_speed + (1 - speed_factor) * (min_speed - max_speed)

        # حساب مركز الموجة
        center = int((math.sin(t * 0.7) + 1) / 2 * (NUM_LEDS - 1))  # يتحرك يمين ويسار

        for i in range(NUM_LEDS):
            distance = abs(i - center)
            if distance <= wave_size:
                fade = 1 - (distance / wave_size)
                r = int(r_base * fade)
                g = int(g_base * fade)
                b = int(b_base * fade)
                neo.set_led_color(i, r, g, b)

        neo.update_strip()
        await asyncio.sleep(current_delay)
        t += 0.15  # كل تكرار يزيد الزمن

    neo.clear_strip()
    neo.update_strip()


async def custom_quantum_flicker_loop(hex_color: str, interval: float = 0.01):

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

    global stop_requested
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    spawn_positions = list(range(150, -1, -3))
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


async def custom_fireworks_burst_loop(hex_color: str, delay_per_step: float = 0.05 / 10):

    global stop_requested
    
    # استخراج قيم اللون من HEX
    r_base = int(hex_color[1:3], 16)
    g_base = int(hex_color[3:5], 16)
    b_base = int(hex_color[5:7], 16)

    ROCKET_LENGTH = 7
    ROCKET_BRIGHTNESSES = [0.25 - (i * 0.03) for i in range(ROCKET_LENGTH)]
    EXPLOSION_BRIGHTNESS = 1.0
    FADE_STEPS = 20

    while not stop_requested:
        explosion_pos = random.randint(ROCKET_LENGTH, NUM_LEDS - ROCKET_LENGTH)

        # حركة الصاروخ
        for head_pos in range(NUM_LEDS - 1, explosion_pos - 1, -1):
            if stop_requested:
                break
            neo.clear_strip()
            for i in range(ROCKET_LENGTH):
                led_pos = head_pos + i
                if 0 <= led_pos < NUM_LEDS:
                    brightness = ROCKET_BRIGHTNESSES[i]
                    r = int(r_base * brightness)
                    g = int(g_base * brightness)
                    b = int(b_base * brightness)
                    neo.set_led_color(
                        led_pos,
                        int(r * BRIGHTNESS_SCALE),
                        int(g * BRIGHTNESS_SCALE),
                        int(b * BRIGHTNESS_SCALE)
                    )
            neo.update_strip()
            await asyncio.sleep(delay_per_step)

        if stop_requested:
            break

        # الانفجار
        neo.clear_strip()
        for i in range(NUM_LEDS):
            r = int(r_base * EXPLOSION_BRIGHTNESS)
            g = int(g_base * EXPLOSION_BRIGHTNESS)
            b = int(b_base * EXPLOSION_BRIGHTNESS)
            neo.set_led_color(
                i,
                int(r * BRIGHTNESS_SCALE),
                int(g * BRIGHTNESS_SCALE),
                int(b * BRIGHTNESS_SCALE)
            )
        neo.update_strip()
        await asyncio.sleep(0.2)

        # التلاشي التدريجي
        for fade_step in range(FADE_STEPS):
            if stop_requested:
                break
            factor = 1 - (fade_step / FADE_STEPS)
            neo.clear_strip()
            for i in range(NUM_LEDS):
                r = int(r_base * factor)
                g = int(g_base * factor)
                b = int(b_base * factor)
                neo.set_led_color(
                    i,
                    int(r * BRIGHTNESS_SCALE),
                    int(g * BRIGHTNESS_SCALE),
                    int(b * BRIGHTNESS_SCALE)
                )
            neo.update_strip()
            await asyncio.sleep(0.03)

        neo.clear_strip()
        neo.update_strip()

        # انتظار عشوائي
        wait_time = random.uniform(0.5, 10.0)
        await asyncio.sleep(wait_time)

    neo.clear_strip()
    neo.update_strip()



# ----------------------------------------------------

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
            elif req.animation_type == "random_colors":
                await random_colors_loop()
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
            elif req.animation_type == "custom_fireworks_burst":
                if req.hex_color:
                    await custom_fireworks_burst_loop(req.hex_color)

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


async def event_generator():
    while True:
        data = json.dumps({"animation": current_anim, "color": current_hex})
        yield f"data: {data}\n\n"
        await asyncio.sleep(1.0)

@app.get("/stream")
async def stream_state():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
