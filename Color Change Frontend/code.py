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

low_red = (100, 0, 0)
high_red = (255, 0, 0)

# سويتش
switch = digitalio.DigitalInOut(board.D7)
switch.direction = digitalio.Direction.INPUT
switch.pull = digitalio.Pull.UP

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

def police_back_animation():
    # وميض متناوب أحمر / أزرق
    pixels.fill((255, 0, 0))  # أحمر
    pixels.show()
    time.sleep(0.25)
    pixels.fill((0, 0, 255))  # أزرق
    pixels.show()
    time.sleep(0.25)

# ترحيب
welcome_snake()
welcome_flash()

# نار هادئة
states = [True] * num_pixels

while True:
    if not switch.value:  # الوضع العادي = نار
        for i in range(num_pixels):
            if random.random() < 0.1:
                states[i] = not states[i]
            pixels[i] = high_red if states[i] else low_red
        pixels.show()
        time.sleep(0.2)
    else:  # شرطة خلفية
        police_back_animation()
