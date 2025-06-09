import time
import board
import neopixel
import random
import digitalio

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

off = (0, 0, 0)

snake_head = (255, 255, 255)
tail1 = (180, 180, 180)
tail2 = (100, 100, 100)
tail3 = (30, 30, 30)

low_white = (150, 150, 150)
high_white = (255, 255, 255)

# سويتش الشرطة
switch = digitalio.DigitalInOut(board.D7)
switch.direction = digitalio.Direction.INPUT
switch.pull = digitalio.Pull.UP

# زر A
button_a = digitalio.DigitalInOut(board.BUTTON_A)
button_a.direction = digitalio.Direction.INPUT
button_a.pull = digitalio.Pull.UP

# زر B
button_b = digitalio.DigitalInOut(board.BUTTON_B)
button_b.direction = digitalio.Direction.INPUT
button_b.pull = digitalio.Pull.UP

# هل الأضواء شغالة؟
leds_on = True

# تتبع آخر حالة للزر
last_a = button_a.value
last_b = button_b.value

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
    for _ in range(2):
        pixels.fill((255, 0, 0))
        pixels.show()
        time.sleep(0.1)
        pixels.fill(off)
        pixels.show()
        time.sleep(0.1)

    for _ in range(2):
        pixels.fill((0, 0, 255))
        pixels.show()
        time.sleep(0.1)
        pixels.fill(off)
        pixels.show()
        time.sleep(0.1)

    for i in range(num_pixels):
        pixels.fill(off)
        pixels[i] = (255, 0, 0) if i % 2 == 0 else (0, 0, 255)
        pixels.show()
        time.sleep(0.05)

# تشغيل الترحيب مرة وحدة
welcome_snake()
welcome_flash()

states = [True] * num_pixels

while True:
    # تابع الضغط على الزرين (كبسة وحدة للتبديل)
    current_a = button_a.value
    current_b = button_b.value

    if (not current_a and last_a) or (not current_b and last_b):
        leds_on = not leds_on  # اقلب الحالة
        if not leds_on:
            pixels.fill(off)
            pixels.show()
        time.sleep(0.3)  # ديبونسينغ بسيط

    last_a = current_a
    last_b = current_b

    if not leds_on:
        continue  # لا تعمل شيء إذا الأضواء مطفية

    # اشتغل حسب وضع السويتش
    if not switch.value:
        for i in range(num_pixels):
            if random.random() < 0.1:
                states[i] = not states[i]
            pixels[i] = high_white if states[i] else low_white
        pixels.show()
        time.sleep(0.2)
    else:
        police_front_animation()
