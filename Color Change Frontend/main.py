from pi5neo import Pi5Neo
import time
import threading

neo = Pi5Neo('/dev/spidev0.0', 20, 800) 

colors = [
    (255, 0, 50),   # dark pink
    (255, 0, 0),    # Red
    (255, 55, 0),   # Orange
    (255, 255, 0),  # Yellow
    (0, 255, 0),    # Green
    (0, 255, 255),  # Cyan
    (0, 0, 255),    # Blue
    (255, 0, 50),   # dark pink
    (255, 0, 255),  # Purple
    (255, 105, 180),# Hot Pink
    (212, 175, 55), # Gold
    (192, 192, 192),# Silver
    (176, 141, 87), # Bronze
    (220, 20, 60),  # Crimson Red
    (128, 0, 50),   # color
    (203, 192, 255),# pink
    (42, 42, 165)   # brown
]

colores = [
    (255, 0, 0),  
    (0, 255, 0),
    (0, 0, 255),  
    (255, 165, 0),  # Orange
    (255, 255, 0),  # Yellow
    (0, 255, 255),  # Cyan
    (255, 0, 255),  # Purple
    (255, 0, 50),   # dark pink
    (255, 80, 125), # Hot Pink
    (255, 215, 0),  # Gold
    (192, 192, 192),# Silver
    (205, 127, 50), # Bronze
    (128, 0, 50),   # color
    (203, 192, 255),# pink
    (42, 42, 165)   # brown
]

Color = [
    (255, 0, 128),  # Purple
    (200, 0, 60),   # color
    (255, 0, 50)    # dark pink
]

delay = 0.011
pause_duration = 3
count = 0
animation_running = False  # متغير للتحكم في تشغيل/إيقاف الأنيميشن

def light_up_one_by_one(neo, num_leds, color, delay=0.011):
    global animation_running
    animation_running = True
    for j in range(num_leds):
        if not animation_running:  # إذا طلبنا إيقاف الأنيميشن
            break
        for i in range(num_leds - 1, j - 1, -1):
            if not animation_running:
                break
            neo.set_led_color(i, color[0], color[1], color[2])
            neo.update_strip()
            time.sleep(delay)
            if i != j:
                neo.set_led_color(i, 0, 0, 0)
            neo.update_strip()
        neo.set_led_color(j, color[0], color[1], color[2])
    neo.update_strip()
    animation_running = False

def turn_off_dynamically(neo, num_leds, delay=0.011):
    for j in range(num_leds):
        for i in range(num_leds - 1, -1, 1):
            neo.set_led_color(i, 0, 0, 0)
            neo.update_strip()
            time.sleep(0.05)

def run_light_one_by_one_animation(color_index=0):
    global animation_running
    if not animation_running:
        color = colors[color_index % len(colors)]
        light_up_one_by_one(neo, 20, color, delay)
        time.sleep(pause_duration)
        turn_off_dynamically(neo, 20, delay)

if __name__ == '__main__':
    switch_state = False  

    while True:
        if switch_state:
            for color in colors:
                light_up_one_by_one(neo, 20, color, delay)
                time.sleep(pause_duration)
                turn_off_dynamically(neo, 20, delay)
        else:
            for i in range(20):
                color = Color[i % len(Color)]
                neo.set_led_color((count + i) % 20, color[0], color[1], color[2])
            count += 1
            neo.update_strip()
            time.sleep(0.09)
        
        switch_state = not switch_state
        time.sleep(1)
