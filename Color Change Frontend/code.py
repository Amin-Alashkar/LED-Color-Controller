import time
import board
import neopixel
import random

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

off = (0, 0, 0)

# ⚡ البداية: تمر الأفعى مرتين بلون أبيض
snake_head = (255, 255, 255)
tail1 = (180, 180, 180)
tail2 = (100, 100, 100)
tail3 = (30, 30, 30)

for _ in range(2):
    for i in range(num_pixels):
        pixels.fill(off)
        if i < num_pixels:
            pixels[i] = snake_head
        if i-1 >= 0:
            pixels[i-1] = tail1
        if i-2 >= 0:
            pixels[i-2] = tail2
        if i-3 >= 0:
            pixels[i-3] = tail3
        pixels.show()
        time.sleep(0.1)

# 🔥 White Fire Animation
def white_fire():
    while True:
        for i in range(num_pixels):
            # سطوع عشوائي لكل بكسل
            brightness = random.randint(80, 255)  # بين متوسط وعالي
            color = (brightness, brightness, brightness)
            pixels[i] = color
        pixels.show()
        time.sleep(0.05)  # سرعة التغيير

white_fire()
