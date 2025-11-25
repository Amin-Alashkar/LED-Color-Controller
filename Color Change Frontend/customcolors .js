// customcolors.js

// بيانات التلميحات لأزرار الألوان
const colorTooltipData = {
    'redBtn': { title: 'Red Color', color: '#ff0000' },
    'blueBtn': { title: 'Blue Color', color: '#0000ff' },
    'greenBtn': { title: 'Green Color', color: '#00ff00' },
    'orangeBtn': { title: 'Orange Color', color: '#FFA500' },
    'yellowBtn': { title: 'Yellow Color', color: '#FFFF00' },
    'purpleBtn': { title: 'Purple Color', color: '#A020F0' },
    'whiteBtn': { title: 'White Color', color: '#FFFFFF' },
    'offBtn': { title: 'Turn Off', color: '#000000' }
};

// متغيرات عالمية
let currentTooltip = null;
let currentBrightness = 25;

// تهيئة الـ Tooltip لأزرار الألوان
function initColorTooltips() {
    console.log('Initializing color tooltips...');
    
    // إنشاء عنصر الـ tooltip إذا لم يكن موجوداً
    createTooltip();
    
    // إضافة event listeners
    setupEventListeners();
}

function createTooltip() {
    if (document.getElementById('customColorTooltip')) {
        currentTooltip = document.getElementById('customColorTooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'customColorTooltip';
    tooltip.className = 'custom-color-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3 id="customColorTooltipTitle">Color Name</h3>
            <div class="color-hex" id="customColorHex">#FFFFFF</div>
            <div class="brightness-controls">
                <div class="brightness-title">Set Brightness:</div>
                <div class="brightness-display">
                    <span class="brightness-value" id="brightnessValue">25%</span>
                </div>
                <div class="brightness-slider-container">
                    <input type="range" min="1" max="100" value="25" class="brightness-slider" id="brightnessSlider">
                </div>
                <button class="apply-btn" id="applyBrightness">Apply</button>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;
    console.log('Tooltip created');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // إضافة event listener للزر Apply
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'applyBrightness') {
            console.log('Apply button clicked');
            handleApplyBrightness(e);
        }
    });

    // إضافة event listener لعجلة الماوس على شريط السطوع
    document.addEventListener('wheel', function(e) {
        const slider = document.getElementById('brightnessSlider');
        if (slider && (e.target === slider || slider.contains(e.target))) {
            e.preventDefault();
            console.log('Wheel event on slider');
            handleWheelBrightness(e, slider);
        }
    });

    // إضافة event listener لسحب شريط التمرير
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'brightnessSlider') {
            console.log('Slider input changed');
            handleSliderChange(e);
        }
    });

    // إضافة event listeners لأزرار الألوان
    const colorButtons = document.querySelectorAll('.button-container button');
    console.log('Found color buttons:', colorButtons.length);
    
    colorButtons.forEach(button => {
        const buttonId = button.id;
        console.log('Processing button:', buttonId);

        if (colorTooltipData[buttonId]) {
            console.log('Adding listeners to button:', buttonId);
            
            // mouseenter على الزر
            button.addEventListener('mouseenter', (e) => {
                console.log('Mouse enter on button:', buttonId);
                showTooltip(e.target, buttonId);
            });

            // mouseleave على الزر
            button.addEventListener('mouseleave', (e) => {
                console.log('Mouse leave from button:', buttonId);
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || (currentTooltip && !currentTooltip.contains(relatedTarget))) {
                    hideTooltip();
                }
            });
        }
    });

    // event listeners للـ tooltip نفسه
    if (currentTooltip) {
        currentTooltip.addEventListener('mouseenter', () => {
            console.log('Mouse enter on tooltip');
            currentTooltip.classList.add('show');
        });

        currentTooltip.addEventListener('mouseleave', () => {
            console.log('Mouse leave from tooltip');
            hideTooltip();
        });
    }
}

function showTooltip(button, buttonId) {
    console.log('Showing tooltip for:', buttonId);
    
    if (!currentTooltip) {
        console.error('No tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('customColorTooltipTitle');
    const tooltipHex = document.getElementById('customColorHex');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');

    if (!tooltipTitle || !tooltipHex || !brightnessSlider || !brightnessValue) {
        console.error('Tooltip elements not found');
        return;
    }

    const buttonData = colorTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';
    tooltipHex.textContent = buttonData.color || '';

    // توليد ألوان عشوائية جديدة
    const [color1, color2, color3] = generateRandomColors();
    currentTooltip.style.setProperty('--random-color-1', color1);
    currentTooltip.style.setProperty('--random-color-2', color2);
    currentTooltip.style.setProperty('--random-color-3', color3);

    // تعيين اللون الحالي والسطوع
    currentTooltip.setAttribute('data-current-color', buttonData.color);
    currentTooltip.setAttribute('data-current-brightness', currentBrightness);

    // تحديث شريط التمرير وعرض القيمة
    brightnessSlider.value = currentBrightness;
    brightnessValue.textContent = `${currentBrightness}%`;

    // تحديث موضع الـ tooltip
    currentTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    currentTooltip.style.top = `${rect.top - 10}px`;
    currentTooltip.style.transform = 'translate(-50%, -100%)';

    currentTooltip.classList.add('show');
    console.log('Tooltip shown');
}

function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.classList.remove('show');
        console.log('Tooltip hidden');
    }
}

function handleWheelBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    currentBrightness = newValue;
    
    updateBrightnessDisplay(newValue);
    
    if (currentTooltip) {
        currentTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    console.log('Brightness changed to:', newValue + '%');
}

function handleSliderChange(e) {
    const newValue = parseInt(e.target.value);
    currentBrightness = newValue;
    updateBrightnessDisplay(newValue);
    
    if (currentTooltip) {
        currentTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    console.log('Brightness slider changed to:', newValue + '%');
}

function updateBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('brightnessValue');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

async function handleApplyBrightness(e) {
    const applyBtn = e.target;
    const tooltip = document.getElementById('customColorTooltip');
    
    if (!tooltip) {
        console.error('Tooltip not found');
        return;
    }

    const currentColor = tooltip.getAttribute('data-current-color');
    const brightness = tooltip.getAttribute('data-current-brightness');
    
    if (!currentColor) {
        console.error('No color selected');
        return;
    }

    console.log('Applying brightness:', brightness + '% to color:', currentColor);

    // تغيير نص الزر إلى "Done!" وتغيير اللون
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Done!';
    applyBtn.classList.add('done');
    
    // تعطيل الزر مؤقتاً
    applyBtn.disabled = true;

    try {
        // إرسال طلبات إلى الـ API
        await applyBrightnessToColor(currentColor, parseInt(brightness));
    } catch (error) {
        console.error('Error applying brightness:', error);
    }

    // إعادة الزر إلى حالته الأصلية بعد 3 ثوان
    setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('done');
        applyBtn.disabled = false;
        console.log('Apply button reset');
    }, 3000);
}

// دالة لتوليد ألوان عشوائية زاهية 
function generateRandomColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

// دالة لتطبيق السطوع على اللون (إرسال طلبات API)
async function applyBrightnessToColor(color, brightness) {
    console.log(`Applying ${brightness}% brightness to color: ${color}`);
    
    try {
        // أولاً: تحديث السطوع في الـ backend
        const brightnessResult = await sendRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (brightnessResult.status === "brightness_updated") {
            console.log("Brightness updated successfully");
            
            // ثانياً: تطبيق اللون مع السطوع الجديد
            const colorResult = await sendRequest("/color", { 
                hex_color: color 
            });
            
            if (colorResult.status === "color_changed") {
                console.log("Color applied with new brightness");
            } else {
                console.error("Failed to apply color:", colorResult);
            }
        } else {
            console.error("Failed to update brightness:", brightnessResult);
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// دالة مساعدة لإرسال الطلبات
async function sendRequest(endpoint, data) {
    const API_BASE_URL = `http://${window.location.hostname}:8000`;
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (e) {
        console.error("API Error:", e);
        return { status: "error", message: e.message };
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initColorTooltips);
