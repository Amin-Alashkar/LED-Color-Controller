import time
import board
import neopixel
import random

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

off = (0, 0, 0)

# ألوان الأفعى
snake_head = (255, 255, 255)
tail1 = (180, 180, 180)
tail2 = (100, 100, 100)
tail3 = (30, 30, 30)

# ألوان النار البيضاء
low_white = (150, 150, 150)
high_white = (255, 255, 255)

# -----------------------
# 💥 المرحلة 1: مشهد الترحيب مرة وحدة فقط
# -----------------------

def welcome_snake():
    for _ in range(2):
        for i in range(num_pixels):
            pixels.fill(off)
            if i < num_pixels:
                pixels[i] = snake_head
            if i - 1 >= 0:
                pixels[i - 1] = tail1
            if i - 2 >= 0:
                pixels[i - 2] = tail2
            if i - 3 >= 0:
                pixels[i - 3] = tail3
            pixels.show()
            time.sleep(0.12)

def welcome_flash():
    for _ in range(2):
        pixels.fill((255, 255, 255))
        pixels.show()
        time.sleep(0.1)
        pixels.fill(off)
        pixels.show()
        time.sleep(0.1)

# تنفيذها مرة وحدة بس عند بداية التشغيل
welcome_snake()
welcome_flash()

# -----------------------
# 🔥 المرحلة 2: أنميشن النار الأبيض - دائم لا نهائي
# -----------------------

states = [True] * num_pixels  # كل ليد تبدأ في الوضع العالي

while True:
    for i in range(num_pixels):
        if random.random() < 0.1:
            states[i] = not states[i]
        
        color = high_white if states[i] else low_white
        pixels[i] = color

    pixels.show()
    time.sleep(0.2) 
