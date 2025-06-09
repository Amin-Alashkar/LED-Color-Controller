import time
import board
import neopixel

# الإعدادات
num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, auto_write=False)

# الألوان
low_red = (50, 0, 0)    # سطوع 50%
high_red = (255, 0, 0)  # سطوع 100%
off = (0, 0, 0)

### 🐍 مرحلة الترحيب - حركة الأفعى ###
for i in range(num_pixels):
    pixels.fill(off)
    pixels[i] = high_red
    pixels.show()
    time.sleep(0.1)

### 💥 وميضتين سريعتين ###
for _ in range(2):
    pixels.fill(high_red)
    pixels.show()
    time.sleep(0.1)
    pixels.fill(off)
    pixels.show()
    time.sleep(0.1)

### 🔁 الآن يبدأ الإنميشن الأساسي ###
while True:
    # ضوء ثابت بسطوع منخفض
    pixels.fill(low_red)
    pixels.show()

    # ومضة سريعة على السطوع العالي
    pixels.fill(high_red)
    pixels.show()
    time.sleep(0.2)

    # رجوع للسطوع المنخفض
    pixels.fill(low_red)
    pixels.show()
    time.sleep(0.2)
