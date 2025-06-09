import time
import board
import neopixel

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

# ألوان الرأس والذيل
snake_head = (255, 0, 0)
tail1 = (127, 0, 0)
tail2 = (64, 0, 0)
tail3 = (25, 0, 0)
off = (0, 0, 0)

# أنيميشن الأفعى (تمر مرتين)
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
        time.sleep(0.13)

### 💥 وميضتين سريعتين ###
for _ in range(2):
    pixels.fill(snake_head)
    pixels.show()
    time.sleep(0.1)
    pixels.fill(off)
    pixels.show()
    time.sleep(0.1)

### 🔁 يبدأ الإنميشن الأساسي ###
low_red = (50, 0, 0)
high_red = (255, 0, 0)

while True:
    # سطوع منخفض دائم
    pixels.fill(low_red)
    pixels.show()

    # ومضة سريعة
    pixels.fill(high_red)
    pixels.show()
    time.sleep(0.2)

    # رجوع للسطوع المنخفض
    pixels.fill(low_red)
    pixels.show()
    time.sleep(0.2)
