import time
import board
import neopixel

num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

# الألوان المطلوبة
low_red = (50, 0, 0)   # سطوع 50%
high_red = (255, 0, 0)  # سطوع 100%

while True:
    # خليهم كلهم على سطوع 50%
    pixels.fill(low_red)
    pixels.show()
    
    # ومضة قصيرة على 100%
    pixels.fill(high_red)
    pixels.show()
    time.sleep(.2)  # مدة الوميض (قصيرة وواضحة)
    
    # رجعهم مباشرة للـ 50%
    pixels.fill(low_red)
    pixels.show()
    time.sleep(0.2)  # انتظار لباقي الثانية
