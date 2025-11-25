// customanimation.js

// بيانات التلميحات لأزرار الأنيميشن
const animationTooltipData = {
    'lightOneBtn': { 
        title: 'Fade Colors', 
        // description: 'Smooth color transitions between multiple colors',
        animationType: 'fade_colors',
        startFunction: 'startFadeAnimation'
    },
    'WaveEffectBtn': { 
        title: 'Wave Effect', 
        // description: 'Color wave moving through the LED strip',
        animationType: 'wave_effect',
        startFunction: 'startWaveAnimation'
    },
    'RainbowFlowBtn': { 
        title: 'Rainbow Flow', 
        // description: 'Continuous rainbow color cycling',
        animationType: 'rainbow_flow',
        startFunction: 'startRainbowAnimation'
    },
    'BlinkingPatternBtn': { 
        title: 'Blinking Pattern', 
        // description: 'Random color blinking pattern',
        animationType: 'blinking_pattern',
        startFunction: 'startBlinkingPattern'
    },
    'RunningLightsBtn': { 
        title: 'Running Lights', 
        // description: 'Multiple lights running across the strip',
        animationType: 'running_lights',
        startFunction: 'startRunningLights'
    },
    'BreathingEffectBtn': { 
        title: 'Breathing Effect', 
        // description: 'Gentle breathing effect with color transitions',
        animationType: 'breathing_effect',
        startFunction: 'startBreathingAnimation'
    },
    'MeteorShowerBtn': { 
        title: 'Meteor Shower', 
        // description: 'Multiple colored snakes chasing each other',
        animationType: 'meteor_shower',
        startFunction: 'startSnakesChasing'
    },
    'RandomColorsBtn': { 
        title: 'Random Colors', 
        // description: 'Random color snakes with varying lengths',
        animationType: 'random_colors',
        startFunction: 'startRandomColors'
    },
    'PulseSyncBtn': { 
        title: 'Pulse Sync', 
        // description: 'Synchronized pulsing with random colors',
        animationType: 'pulse_sync',
        startFunction: 'startPulseSyncAnimation'
    },
    'FireworksBurstBtn': { 
        title: 'Fireworks Burst', 
        // description: 'Fireworks simulation with launch and explosion',
        animationType: 'fireworks_burst',
        startFunction: 'startFireworksBurst'
    },
    'MeteorShowerNewBtn': { 
        title: 'Meteor Shower (Single)', 
        // description: 'Single meteor shower with smooth movement',
        animationType: 'single_snake',
        startFunction: 'startSingleSnake'
    }
};

// متغيرات عالمية للأنيميشن
let currentAnimationTooltip = null;
let currentAnimationBrightness = 25;
let currentAnimationButton = null;
let isApplyingBrightness = false;

// دالة لتحميل سطوع الأنيميشن من localStorage
function loadAnimationBrightnessFromStorage() {
    const savedBrightness = localStorage.getItem('animationBrightness');
    if (savedBrightness !== null) {
        currentAnimationBrightness = parseInt(savedBrightness);
        console.log('Loaded animation brightness from storage:', currentAnimationBrightness);
    }
}

// دالة لحفظ سطوع الأنيميشن في localStorage
function saveAnimationBrightnessToStorage(brightness) {
    localStorage.setItem('animationBrightness', brightness.toString());
    console.log('Saved animation brightness to storage:', brightness);
}

// تهيئة الـ Tooltip لأزرار الأنيميشن
function initAnimationTooltips() {
    console.log('Initializing animation tooltips...');
    
    // تحميل قيمة السطوع المحفوظة
    loadAnimationBrightnessFromStorage();
    
    // إنشاء عنصر الـ tooltip إذا لم يكن موجوداً
    createAnimationTooltip();
    
    // إضافة event listeners
    setupAnimationEventListeners();
}

function createAnimationTooltip() {
    if (document.getElementById('customAnimationTooltip')) {
        currentAnimationTooltip = document.getElementById('customAnimationTooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'customAnimationTooltip';
    tooltip.className = 'custom-animation-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3 id="customAnimationTooltipTitle">Animation Name</h3>
            <div class="animation-description" id="animationDescription">Animation description</div>
            <div class="animation-brightness-controls">
                <div class="animation-brightness-title">Set Animation Brightness:</div>
                <div class="animation-brightness-display">
                    <span class="animation-brightness-value" id="animationBrightnessValue">${currentAnimationBrightness}%</span>
                </div>
                <div class="animation-brightness-slider-container">
                    <input type="range" min="1" max="100" value="${currentAnimationBrightness}" class="animation-brightness-slider" id="animationBrightnessSlider">
                </div>
                <button class="animation-apply-btn" id="applyAnimationBrightness">Apply Brightness</button>
            </div>
        </div>
        <div class="tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    currentAnimationTooltip = tooltip;
    console.log('Animation tooltip created with brightness:', currentAnimationBrightness);
}

function setupAnimationEventListeners() {
    console.log('Setting up animation event listeners...');
    
    // إضافة event listener للزر Apply
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'applyAnimationBrightness') {
            console.log('Apply animation button clicked');
            handleApplyAnimationBrightness(e);
        }
    });

    // إضافة event listener لعجلة الماوس على شريط السطوع
    document.addEventListener('wheel', function(e) {
        const slider = document.getElementById('animationBrightnessSlider');
        if (slider && (e.target === slider || slider.contains(e.target))) {
            e.preventDefault();
            console.log('Wheel event on animation slider');
            handleWheelAnimationBrightness(e, slider);
        }
    });

    // إضافة event listener لسحب شريط التمرير
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'animationBrightnessSlider') {
            console.log('Animation slider input changed');
            handleAnimationSliderChange(e);
        }
    });

    // إضافة event listeners لأزرار الأنيميشن
    const animationButtons = document.querySelectorAll('.button-container button.custom-animation-btn');
    console.log('Found animation buttons:', animationButtons.length);
    
    animationButtons.forEach(button => {
        const buttonId = button.id;
        console.log('Processing animation button:', buttonId);

        if (animationTooltipData[buttonId]) {
            console.log('Adding listeners to animation button:', buttonId);
            
            // mouseenter على الزر
            button.addEventListener('mouseenter', (e) => {
                console.log('Mouse enter on animation button:', buttonId);
                showAnimationTooltip(e.target, buttonId);
            });

            // mouseleave على الزر
            button.addEventListener('mouseleave', (e) => {
                console.log('Mouse leave from animation button:', buttonId);
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || (currentAnimationTooltip && !currentAnimationTooltip.contains(relatedTarget))) {
                    hideAnimationTooltip();
                }
            });

            // click على الزر - نترك السلوك الأصلي يعمل
            // لا نضيف معالج اضافي هنا لأن app.js already handles the toggle behavior
        }
    });

    // event listeners للـ tooltip نفسه
    if (currentAnimationTooltip) {
        currentAnimationTooltip.addEventListener('mouseenter', () => {
            console.log('Mouse enter on animation tooltip');
            currentAnimationTooltip.classList.add('show');
        });

        currentAnimationTooltip.addEventListener('mouseleave', () => {
            console.log('Mouse leave from animation tooltip');
            hideAnimationTooltip();
        });
    }
}

function showAnimationTooltip(button, buttonId) {
    console.log('Showing animation tooltip for:', buttonId);
    
    if (!currentAnimationTooltip) {
        console.error('No animation tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('customAnimationTooltipTitle');
    const animationDescription = document.getElementById('animationDescription');
    const brightnessSlider = document.getElementById('animationBrightnessSlider');
    const brightnessValue = document.getElementById('animationBrightnessValue');
    const applyBtn = document.getElementById('applyAnimationBrightness');

    if (!tooltipTitle || !animationDescription || !brightnessSlider || !brightnessValue || !applyBtn) {
        console.error('Animation tooltip elements not found');
        return;
    }

    const buttonData = animationTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for animation button:', buttonId);
        return;
    }

    tooltipTitle.textContent = buttonData.title || '';
    animationDescription.textContent = buttonData.description || '';

    // توليد ألوان عشوائية جديدة
    const [color1, color2, color3] = generateRandomAnimationColors();
    currentAnimationTooltip.style.setProperty('--random-color-1', color1);
    currentAnimationTooltip.style.setProperty('--random-color-2', color2);
    currentAnimationTooltip.style.setProperty('--random-color-3', color3);

    // تعيين نوع الأنيميشن الحالي والسطوع
    currentAnimationTooltip.setAttribute('data-animation-type', buttonData.animationType);
    currentAnimationTooltip.setAttribute('data-start-function', buttonData.startFunction);
    currentAnimationTooltip.setAttribute('data-current-brightness', currentAnimationBrightness);
    currentAnimationButton = buttonId; // حفظ الزر الحالي

    // تحديث شريط التمرير وعرض القيمة
    brightnessSlider.value = currentAnimationBrightness;
    brightnessValue.textContent = `${currentAnimationBrightness}%`;

    // تحديث نص الزر بناءً على حالة الأنيميشن الحالية
    const isCurrentlyRunning = button.classList.contains('active');
    applyBtn.textContent = isCurrentlyRunning ? 
        'Update Brightness' : 
        'Apply Brightness & Start';

    // تحديث موضع الـ tooltip
    currentAnimationTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    currentAnimationTooltip.style.top = `${rect.top - 10}px`;
    currentAnimationTooltip.style.transform = 'translate(-50%, -100%)';

    currentAnimationTooltip.classList.add('show');
    console.log('Animation tooltip shown with brightness:', currentAnimationBrightness);
}

function hideAnimationTooltip() {
    if (currentAnimationTooltip) {
        currentAnimationTooltip.classList.remove('show');
        console.log('Animation tooltip hidden');
    }
}

function handleWheelAnimationBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    currentAnimationBrightness = newValue;
    
    updateAnimationBrightnessDisplay(newValue);
    
    if (currentAnimationTooltip) {
        currentAnimationTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    // حفظ السطوع الجديد في localStorage
    saveAnimationBrightnessToStorage(newValue);
    
    console.log('Animation brightness changed to:', newValue + '%');
}

function handleAnimationSliderChange(e) {
    const newValue = parseInt(e.target.value);
    currentAnimationBrightness = newValue;
    updateAnimationBrightnessDisplay(newValue);
    
    if (currentAnimationTooltip) {
        currentAnimationTooltip.setAttribute('data-current-brightness', newValue);
    }
    
    // حفظ السطوع الجديد في localStorage
    saveAnimationBrightnessToStorage(newValue);
    
    console.log('Animation brightness slider changed to:', newValue + '%');
}

function updateAnimationBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('animationBrightnessValue');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

async function handleApplyAnimationBrightness(e) {
    if (isApplyingBrightness) return;
    
    const applyBtn = e.target;
    const tooltip = document.getElementById('customAnimationTooltip');
    
    if (!tooltip) {
        console.error('Animation tooltip not found');
        return;
    }

    const animationType = tooltip.getAttribute('data-animation-type');
    const startFunction = tooltip.getAttribute('data-start-function');
    const brightness = tooltip.getAttribute('data-current-brightness');
    
    if (!animationType || !startFunction) {
        console.error('No animation type or function selected');
        return;
    }

    console.log('Applying animation brightness:', brightness + '% to animation:', animationType);

    // منع النقر المزدوج
    isApplyingBrightness = true;
    applyBtn.disabled = true;
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Applying...';

    try {
        // تحديث السطوع أولاً
        await updateAnimationBrightness(parseInt(brightness));
        
        // التحقق مما إذا كانت الأنيميشن شغالة حالياً
        const button = document.getElementById(currentAnimationButton);
        const isCurrentlyRunning = button && button.classList.contains('active');
        
        if (!isCurrentlyRunning) {
            // إذا لم تكن شغالة، نبدأ الأنيميشن
            console.log('Starting animation since it was not running');
            await startAnimationFunction(startFunction);
        } else {
            console.log('Animation is already running, only brightness updated');
        }
        
        // إخفاء الـ tooltip بعد التطبيق الناجح
        hideAnimationTooltip();
        
        // إظهار تأكيد نجاح
        applyBtn.textContent = 'Done!';
        applyBtn.classList.add('done');
        
    } catch (error) {
        console.error('Error applying animation brightness:', error);
        applyBtn.textContent = 'Error!';
    }

    // إعادة تعيين الزر بعد 1 ثانية
    setTimeout(() => {
        applyBtn.disabled = false;
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('done');
        isApplyingBrightness = false;
        console.log('Animation apply button reset');
    }, 1000);
}

// دالة لتحديث السطوع فقط
async function updateAnimationBrightness(brightness) {
    console.log(`Updating animation brightness to: ${brightness}%`);
    
    const brightnessResult = await sendAnimationRequest("/set_brightness", { 
        brightness: brightness / 100 
    });
    
    if (brightnessResult.status === "brightness_updated") {
        console.log("Animation brightness updated successfully");
        return true;
    } else {
        console.error("Failed to update animation brightness:", brightnessResult);
        throw new Error("Failed to update brightness");
    }
}

// دالة مساعدة لاستدعاء دوال الأنيميشن من app.js
async function startAnimationFunction(functionName) {
    console.log("Starting animation function:", functionName);
    
    if (typeof window[functionName] === 'function') {
        await window[functionName]();
        console.log("Animation function executed successfully");
    } else {
        console.error("Animation function not found:", functionName);
        throw new Error(`Animation function ${functionName} not found`);
    }
}

// دالة لتوليد ألوان عشوائية للأنيميشن
function generateRandomAnimationColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

// دالة مساعدة لإرسال طلبات الأنيميشن
async function sendAnimationRequest(endpoint, data) {
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
        console.error("Animation API Error:", e);
        return { 
            status: "error", 
            message: e.message,
            endpoint: endpoint
        };
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initAnimationTooltips);
