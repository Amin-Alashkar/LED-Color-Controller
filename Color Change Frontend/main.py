from pi5neo import Pi5Neo
import time

# تهيئة اللايدز
NUM_LEDS = 20
neo = Pi5Neo('/dev/spidev0.0', NUM_LEDS, 800)

# لائحة الألوان اللي بدنا ندورها
COLORS = [
    (255, 255, 255),  # White
    (255,   0,   0),  # Red
    (  0,   0, 255),  # Blue
    (  0, 255,   0),  # Green
    (255, 255,   0),  # Yellow
    (255,   0, 255),  # Magenta
    (  0, 255, 255),  # Cyan
]

# معطيات الانيميشن
FADE_STEPS   = 50    # عدد درجات التلاشي (fade) لكل لون
STEP_DELAY   = 0.02  # ثانية بين كل خطوة تلاشي

def fade_color(color):
    """Fade in ثم Fade out للشريط بلون واحد."""
    r_target, g_target, b_target = color
    
    # Fade in
    for step in range(FADE_STEPS):
        factor = step / (FADE_STEPS - 1)
        r = int(r_target * factor)
        g = int(g_target * factor)
        b = int(b_target * factor)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
        time.sleep(STEP_DELAY)
    
    # Fade out
    for step in range(FADE_STEPS):
        factor = 1 - (step / (FADE_STEPS - 1))
        r = int(r_target * factor)
        g = int(g_target * factor)
        b = int(b_target * factor)
        for i in range(NUM_LEDS):
            neo.set_led_color(i, r, g, b)
        neo.update_strip()
        time.sleep(STEP_DELAY)

if __name__ == '__main__':
    try:
        while True:
            for color in COLORS:
                fade_color(color)
    except KeyboardInterrupt:
        # لما توقف بالـCtrl+C، نطفّي الأضواء
        for i in range(NUM_LEDS):
            neo.set_led_color(i, 0, 0, 0)
        neo.update_strip()
