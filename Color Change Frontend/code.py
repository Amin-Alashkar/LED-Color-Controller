import time
import board
import neopixel
import random
from adafruit_circuitplayground import cp  # هنا السحر

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

off = (0, 0, 0)

snake_head = (255, 255, 255)
tail1 = (180, 180, 180)
tail2 = (100, 100, 100)
tail3 = (30, 30, 30)

low_white = (150, 150, 150)
high_white = (255, 255, 255)

# زر سويتش الشرطة (D7)
import digitalio
switch = digitalio.DigitalInOut(board.D7)
switch.direction = digitalio.Direction.INPUT
switch.pull = digitalio.Pull.UP

# هل الأضواء مفعّلة؟
leds_on = True
last_a = cp.button_a
last_b = cp.button_b

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
        pixels.fill(high_white)
        pixels.show()
        time.sleep(0.1)
        pixels.fill(off)
        pixels.show()
        time.sleep(0.1)

def police_front_animation():
    for i in range(num_pixels):
        pixels.fill(off)
        pixels[i] = (255, 0, 0) if i % 2 == 0 else (0, 0, 255)
        pixels.show()
        time.sleep(0.05)

# تشغيل الترحيب
welcome_snake()
welcome_flash()

states = [True] * num_pixels

while True:
    # Toggle on button press A or B
    if (cp.button_a and not last_a) or (cp.button_b and not last_b):
        leds_on = not leds_on
        if not leds_on:
            pixels.fill(off)
            pixels.show()
        time.sleep(0.2)  # منع التكرار السريع

    last_a = cp.button_a
    last_b = cp.button_b

    if not leds_on:
        continue  # ما تعمل شيء لو مطفي

    if not switch.value:
        for i in range(num_pixels):
            if random.random() < 0.1:
                states[i] = not states[i]
            pixels[i] = high_white if states[i] else low_white
        pixels.show()
        time.sleep(0.2)
    else:
        police_front_animation()




pip install adafruit-circuitplayground
