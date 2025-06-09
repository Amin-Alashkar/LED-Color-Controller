import time
import board
import neopixel

# تعيين عدد المصابيح LED
num_pixels = 10
pixels = neopixel.NeoPixel(board.NEOPIXEL, num_pixels, brightness=1.0, auto_write=False)

# دالة لضبط السطوع التدريجي
def set_brightness(color, brightness):
    return tuple(int(brightness * c) for c in color)

# دالة لجعل المصابيح تومض بشكل تدريجي
def gradual_blink(color, delay, steps):
    for step in range(steps):
        brightness = step / steps
        for i in range(num_pixels):
            pixels[i] = set_brightness(color, brightness)
        pixels.show()
        time.sleep(delay)
    for step in range(steps, 0, -1):
        brightness = step / steps
        for i in range(num_pixels):
            pixels[i] = set_brightness(color, brightness)
        pixels.show()
        time.sleep(delay)

# اللون المعدل
custom_color = (255, 0, 0)

while True:
    gradual_blink(custom_color, 0.01, 50)  # جعل المصابيح تومض تدريجياً مع تأخير 0.01 ثانية و 50 خطوة
