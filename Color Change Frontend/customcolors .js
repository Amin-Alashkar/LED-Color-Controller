// customcolors.js - UPDATED with 3-second hover delay

// بيانات التلميحات لأزرار الألوان
const colorTooltipData = {
    'redBtn': { title: 'Red Color', color: '#ff0000' },
    'blueBtn': { title: 'Blue Color', color: '#0000ff' },
    'greenBtn': { title: 'Green Color', color: '#00ff00' },
    'orangeBtn': { title: 'Orange Color', color: '#FFA500' },
    'yellowBtn': { title: 'Yellow Color', color: '#FFFF00' },
    'purpleBtn': { title: 'Purple Color', color: '#A020F0' },
    'whiteBtn': { title: 'White Color', color: '#FFFFFF' }
};

// متغيرات عالمية
let currentTooltip = null;
let currentBrightness = 25;
let currentColorButton = null;
let hoverTimeout = null; // NEW: For hover delay
let tooltipShownByClick = false; // NEW: Track if tooltip was shown by click
let isHovering = false; // NEW: Track hover state

// دالة لتحميل السطوع من localStorage
function loadBrightnessFromStorage() {
    const savedBrightness = localStorage.getItem('ledBrightness');
    if (savedBrightness !== null) {
        currentBrightness = parseInt(savedBrightness);
        console.log('Loaded brightness from storage:', currentBrightness);
    }
}

// دالة لحفظ السطوع في localStorage
function saveBrightnessToStorage(brightness) {
    localStorage.setItem('ledBrightness', brightness.toString());
    console.log('Saved brightness to storage:', brightness);
}

// تهيئة الـ Tooltip لأزرار الألوان
function initColorTooltips() {
    console.log('Initializing color tooltips...');
    
    // تحميل قيمة السطوع المحفوظة
    loadBrightnessFromStorage();
    
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
            <div class="brightness-controls">
                <div class="brightness-title">Set Brightness:</div>
                <div class="brightness-display">
                    <span class="brightness-value" id="brightnessValue">${currentBrightness}%</span>
                </div>
                <div class="brightness-slider-container">
                    <input type="range" min="1" max="100" value="${currentBrightness}" class="brightness-slider" id="brightnessSlider">
                </div>
                <button class="apply-btn" id="applyBrightness">Apply</button>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;
    console.log('Tooltip created with brightness:', currentBrightness);
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
            
            // Add hover delay class for visual feedback
            button.classList.add('button-hover-delay');
            
            // mouseenter على الزر - مع تأخير 3 ثواني
            button.addEventListener('mouseenter', (e) => {
                console.log('Mouse enter on button:', buttonId);
                isHovering = true;
                
                // Don't show if tooltip is already visible (except if shown by click)
                if (currentTooltip && currentTooltip.classList.contains('show') && !tooltipShownByClick) {
                    return;
                }
                
                // Clear any existing timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }
                
                // Start 3-second delay for hover
                hoverTimeout = setTimeout(() => {
                    console.log('3-second hover delay completed - showing tooltip');
                    if (isHovering) { // Only show if still hovering
                        tooltipShownByClick = false;
                        showTooltip(e.target, buttonId);
                    }
                    hoverTimeout = null;
                }, 3000); // 3 seconds
            });

            // mouseleave على الزر
            button.addEventListener('mouseleave', (e) => {
                console.log('Mouse leave from button:', buttonId);
                isHovering = false;
                
                // Clear hover timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                    console.log('Hover timeout cleared');
                }
                
                // Only hide tooltip if it was shown by hover (not by click)
                if (currentTooltip && currentTooltip.classList.contains('show') && !tooltipShownByClick) {
                    const relatedTarget = e.relatedTarget;
                    // Check if mouse is moving to tooltip
                    if (!relatedTarget || (currentTooltip && !currentTooltip.contains(relatedTarget))) {
                        hideTooltip();
                    }
                }
            });

            // click على الزر - التطبيق التلقائي للسطوع مع عرض فوري
            button.addEventListener('click', (e) => {
                console.log('Color button clicked - showing tooltip immediately');
                e.stopPropagation();
                
                // Clear any hover timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }
                
                // Set flag that tooltip was shown by click
                tooltipShownByClick = true;
                
                // Show tooltip immediately
                showTooltip(e.target, buttonId);
                
                // Also handle the color application
                handleColorButtonClick(e.target, buttonId);
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
            // Only hide if tooltip was shown by hover (not by click)
            if (!tooltipShownByClick) {
                hideTooltip();
            }
        });
    }
    
    // NEW: Close tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (currentTooltip && currentTooltip.classList.contains('show')) {
            // Check if click is outside the tooltip and not on a color button
            if (!currentTooltip.contains(e.target) && 
                !e.target.closest('.button-container button[id]')) {
                hideTooltip();
                tooltipShownByClick = false;
            }
        }
    });
    
    // NEW: Clear hover timeout when window loses focus
    window.addEventListener('blur', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
        isHovering = false;
    });
    
    // NEW: Clear hover timeout on page unload
    window.addEventListener('beforeunload', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    });
}

function showTooltip(button, buttonId) {
    console.log('Showing tooltip for:', buttonId);
    
    if (!currentTooltip) {
        console.error('No tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('customColorTooltipTitle');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');

    if (!tooltipTitle || !brightnessSlider || !brightnessValue) {
        console.error('Tooltip elements not found');
        return;
    }

    const buttonData = colorTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';

    // توليد ألوان عشوائية جديدة
    const [color1, color2, color3] = generateRandomColors();
    currentTooltip.style.setProperty('--random-color-1', color1);
    currentTooltip.style.setProperty('--random-color-2', color2);
    currentTooltip.style.setProperty('--random-color-3', color3);

    // تعيين اللون الحالي والسطوع
    currentTooltip.setAttribute('data-current-color', buttonData.color);
    currentTooltip.setAttribute('data-current-brightness', currentBrightness);
    currentColorButton = buttonId; // حفظ الزر الحالي

    // تحديث شريط التمرير وعرض القيمة
    brightnessSlider.value = currentBrightness;
    brightnessValue.textContent = `${currentBrightness}%`;

    // تحديث موضع الـ tooltip
    currentTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    currentTooltip.style.top = `${rect.top - 10}px`;
    currentTooltip.style.transform = 'translate(-50%, -100%)';

    currentTooltip.classList.add('show');
    console.log('Tooltip shown with brightness:', currentBrightness);
}

function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.classList.remove('show');
        tooltipShownByClick = false; // Reset flag
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
    
    // حفظ السطوع الجديد في localStorage
    saveBrightnessToStorage(newValue);
    
    console.log('Brightness changed to:', newValue + '%');
}

function handleSliderChange(e) {
    const newValue = parseInt(e.target.value);
    currentBrightness = newValue;
    updateBrightnessDisplay(newValue);
    
    if (currentTooltip) {
        currentTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    // حفظ السطوع الجديد في localStorage
    saveBrightnessToStorage(newValue);
    
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

    // تعطيل الزر مؤقتاً وإخفاء الـ tooltip
    applyBtn.disabled = true;

    try {
        // استخدام الدالة الجديدة التي تجمع بين السطوع واللون
        await applyBrightnessAndColor(currentColor, parseInt(brightness));
        
        // إخفاء الـ tooltip بعد التطبيق الناجح
        hideTooltip();
    } catch (error) {
        console.error('Error applying brightness:', error);
        // في حالة الخطأ، استخدم دالة changeColor العادية
        changeColor(currentColor);
    }

    // إعادة تمكين الزر بعد 1 ثانية
    setTimeout(() => {
        applyBtn.disabled = false;
        console.log('Apply button re-enabled');
    }, 1000);
}

// دالة جديدة للتعامل مع النقر على أزرار الألوان
async function handleColorButtonClick(button, buttonId) {
    console.log('Handling color button click:', buttonId);
    
    const buttonData = colorTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for button:', buttonId);
        return;
    }

    // استخدام الدالة الجديدة التي تجمع السطوع واللون
    if (currentBrightness > 0) {
        console.log(`Applying ${currentBrightness}% brightness to color: ${buttonData.color}`);
        await applyBrightnessAndColor(buttonData.color, currentBrightness);
    } else {
        // إذا لم يكن هناك سطوع محدد، نستخدم الوظيفة الأصلية
        console.log('No brightness set, using default behavior');
        changeColor(buttonData.color);
    }
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

// دالة جديدة تجمع بين تعديل السطوع وتطبيق اللون
async function applyBrightnessAndColor(color, brightness) {
    console.log(`Applying ${brightness}% brightness to color: ${color}`);
    
    try {
        // أولاً تحديث السطوع في الـ backend
        const brightnessResult = await sendRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (brightnessResult.status === "brightness_updated") {
            console.log("Brightness updated successfully");
            // ثم تطبيق اللون باستخدام الدالة الموجودة في app.js
            await changeColor(color);
        } else {
            console.error("Failed to update brightness:", brightnessResult);
            // إذا فشل تحديث السطوع، طبق اللون فقط
            await changeColor(color);
        }
    } catch (error) {
        console.error("API Error:", error);
        // في حالة الخطأ، طبق اللون فقط
        await changeColor(color);
        throw error;
    }
}

// دالة مساعدة لإرسال الطلبات مع معالجة CORS
async function sendRequest(endpoint, data) {
    const API_BASE_URL = `http://${window.location.hostname}:8000`;
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
            mode: 'cors'
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        return await res.json();
    } catch (e) {
        console.error("API Error:", e);
        // بدلاً من رمي خطأ، نعيد كائن خطأ
        return { 
            status: "error", 
            message: e.message,
            endpoint: endpoint
        };
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initColorTooltips);
