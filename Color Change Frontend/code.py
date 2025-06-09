import time
import board
import neopixel

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

# ألوان الذيل
head = (255, 255, 255)
tail1 = (150, 150, 150)
tail2 = (80, 80, 80)
tail3 = (30, 30, 30)
off = (0, 0, 0)

# الأفعى البيضاء أول التشغيل (تمشي مرتين)
for _ in range(2):
    for i in range(num_pixels):
        pixels.fill(off)
        if i < num_pixels:
            pixels[i] = head
        if i-1 >= 0:
            pixels[i-1] = tail1
        if i-2 >= 0:
            pixels[i-2] = tail2
        if i-3 >= 0:
            pixels[i-3] = tail3
        pixels.show()
        time.sleep(0.1)

### ✨ بعد البداية: ضوء أبيض "يتحرك بشكل دائري"
while True:
    for i in range(num_pixels):
        pixels.fill(off)
        pixels[i % num_pixels] = head
        pixels[(i-1) % num_pixels] = tail1
        pixels[(i-2) % num_pixels] = tail2
        pixels[(i-3) % num_pixels] = tail3
        pixels.show()
        time.sleep(0.08)  # عدل السرعة من هون إذا بدك أبطأ/أسرع
