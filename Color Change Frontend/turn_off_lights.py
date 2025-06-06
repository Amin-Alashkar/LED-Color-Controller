#!/usr/bin/env python3
import requests

# إذا السيرفر يعمل على الـPi نفسه، نستخدم localhost
url = "http://localhost:8000/color"
data = {"hex_color": "#000000"}

try:
    res = requests.post(url, json=data, timeout=5)
    print(f"Request sent at 5:00 AM, status: {res.status_code}, response: {res.text}")
except Exception as e:
    print(f"Error sending request: {e}")
