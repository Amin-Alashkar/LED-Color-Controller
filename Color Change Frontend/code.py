import time
import board
import neopixel
import digitalio

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

# ألوان
red_low = (50, 0, 0)
red_high = (255, 0, 0)
blue = (0, 0, 255)
off = (0, 0, 0)

# السويتش على D7
switch = digitalio.DigitalInOut(board.D7)
switch.direction = digitalio.Direction.INPUT
switch.pull = digitalio.Pull.UP

# مشهد الترحيب: أفعى بيضاء + وميض
def welcome_snake():
    snake_head = (255, 0, 0)     # رأس الأفعى - أحمر قوي
    tail1 = (180, 0, 0)          # الذيل 1 - أخف
    tail2 = (100, 0, 0)          # الذيل 2 - أخف
    tail3 = (30, 0, 0)           # الذيل 3 - ضعيف جداً
    off = (0, 0, 0)

    for _ in range(2):  # تمر مرتين
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

welcome_snake()
welcome_flash()

# وميض أحمر دائم (الوضع العادي)
def red_flash():
    pixels.fill(red_low)
    pixels.show()
    time.sleep(0.3)
    pixels.fill(red_high)
    pixels.show()
    time.sleep(0.2)

# شرطة خلفية: ومضات سريعة أحمر/أزرق
def police_mode():
    for color in [(255, 0, 0), (0, 0, 255)]:
        pixels.fill(color)
        pixels.show()
        time.sleep(0.15)
        pixels.fill(off)
        pixels.show()
        time.sleep(0.1)

# حلقة رئيسية
while True:
    if not switch.value:  # switch = OFF
        red_flash()
    else:  # switch = ON
        police_mode()
