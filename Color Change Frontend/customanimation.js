// customanimation.js

// بيانات التلميحات لأزرار الأنيميشن
const animationTooltipData = {
    'lightOneBtn': { 
        title: 'Fade Colors', 
        // description: 'Smooth color transitions between multiple colors',
        animationType: 'fade_colors'
    },
    'WaveEffectBtn': { 
        title: 'Wave Effect', 
        // description: 'Color wave moving through the LED strip',
        animationType: 'wave_effect'
    },
    'RainbowFlowBtn': { 
        title: 'Rainbow Flow', 
        // description: 'Continuous rainbow color cycling',
        animationType: 'rainbow_flow'
    },
    'BlinkingPatternBtn': { 
        title: 'Blinking Pattern', 
        // description: 'Random color blinking pattern',
        animationType: 'blinking_pattern'
    },
    'RunningLightsBtn': { 
        title: 'Running Lights', 
        // description: 'Multiple lights running across the strip',
        animationType: 'running_lights'
    },
    'BreathingEffectBtn': { 
        title: 'Breathing Effect', 
        // description: 'Gentle breathing effect with color transitions',
        animationType: 'breathing_effect'
    },
    'MeteorShowerBtn': { 
        title: 'Meteor Shower', 
        // description: 'Multiple colored snakes chasing each other',
        animationType: 'meteor_shower'
    },
    'RandomColorsBtn': { 
        title: 'Random Colors', 
        // description: 'Random color snakes with varying lengths',
        animationType: 'random_colors'
    },
    'PulseSyncBtn': { 
        title: 'Pulse Sync', 
        // description: 'Synchronized pulsing with random colors',
        animationType: 'pulse_sync'
    },
    'FireworksBurstBtn': { 
        title: 'Fireworks Burst', 
        // description: 'Fireworks simulation with launch and explosion',
        animationType: 'fireworks_burst'
    },
    'MeteorShowerNewBtn': { 
        title: 'Meteor Shower (Single)', 
        // description: 'Single meteor shower with smooth movement',
        animationType: 'single_snake'
    }
};

// متغيرات عالمية للأنيميشن
let currentAnimationTooltip = null;
let currentAnimationBrightness = 25;
let currentAnimationButton = null;

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
                <button class="animation-apply-btn" id="applyAnimationBrightness">Apply & Start</button>
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

            // click على الزر - التطبيق التلقائي للسطوع والأنيميشن
            button.addEventListener('click', (e) => {
                console.log('Animation button clicked:', buttonId);
                handleAnimationButtonClick(e.target, buttonId);
            });
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

    if (!tooltipTitle || !animationDescription || !brightnessSlider || !brightnessValue) {
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
    currentAnimationTooltip.setAttribute('data-current-brightness', currentAnimationBrightness);
    currentAnimationButton = buttonId; // حفظ الزر الحالي

    // تحديث شريط التمرير وعرض القيمة
    brightnessSlider.value = currentAnimationBrightness;
    brightnessValue.textContent = `${currentAnimationBrightness}%`;

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
    const applyBtn = e.target;
    const tooltip = document.getElementById('customAnimationTooltip');
    
    if (!tooltip) {
        console.error('Animation tooltip not found');
        return;
    }

    const animationType = tooltip.getAttribute('data-animation-type');
    const brightness = tooltip.getAttribute('data-current-brightness');
    
    if (!animationType) {
        console.error('No animation type selected');
        return;
    }

    console.log('Applying animation brightness:', brightness + '% to animation:', animationType);

    // تعطيل الزر مؤقتاً وإخفاء الـ tooltip
    applyBtn.disabled = true;

    try {
        // استخدام الدالة الجديدة التي تجمع بين السطوع والأنيميشن
        await applyAnimationBrightnessAndStart(animationType, parseInt(brightness));
        
        // إخفاء الـ tooltip بعد التطبيق الناجح
        hideAnimationTooltip();
    } catch (error) {
        console.error('Error applying animation brightness:', error);
        // في حالة الخطأ، استخدم دالة الأنيميشن العادية
        startAnimationDirectly(animationType);
    }

    // إعادة تمكين الزر بعد 1 ثانية
    setTimeout(() => {
        applyBtn.disabled = false;
        console.log('Animation apply button re-enabled');
    }, 1000);
}

// دالة جديدة للتعامل مع النقر على أزرار الأنيميشن
async function handleAnimationButtonClick(button, buttonId) {
    console.log('Handling animation button click:', buttonId);
    
    const buttonData = animationTooltipData[buttonId];
    if (!buttonData) {
        console.error('No data for animation button:', buttonId);
        return;
    }

    // استخدام الدالة الجديدة التي تجمع السطوع والأنيميشن
    if (currentAnimationBrightness > 0) {
        console.log(`Applying ${currentAnimationBrightness}% brightness to animation: ${buttonData.animationType}`);
        await applyAnimationBrightnessAndStart(buttonData.animationType, currentAnimationBrightness);
    } else {
        // إذا لم يكن هناك سطوع محدد، نستخدم الوظيفة الأصلية
        console.log('No brightness set, using default animation behavior');
        startAnimationDirectly(buttonData.animationType);
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

// دالة جديدة تجمع بين تعديل السطوع وتشغيل الأنيميشن
async function applyAnimationBrightnessAndStart(animationType, brightness) {
    console.log(`Applying ${brightness}% brightness to animation: ${animationType}`);
    
    try {
        // أولاً تحديث السطوع في الـ backend
        const brightnessResult = await sendAnimationRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (brightnessResult.status === "brightness_updated") {
            console.log("Animation brightness updated successfully");
            // ثم تشغيل الأنيميشن
            await startAnimationDirectly(animationType);
        } else {
            console.error("Failed to update animation brightness:", brightnessResult);
            // إذا فشل تحديث السطوع، شغل الأنيميشن فقط
            await startAnimationDirectly(animationType);
        }
    } catch (error) {
        console.error("Animation API Error:", error);
        // في حالة الخطأ، شغل الأنيميشن فقط
        await startAnimationDirectly(animationType);
        throw error;
    }
}

// دالة مساعدة لتشغيل الأنيميشن مباشرة
async function startAnimationDirectly(animationType) {
    console.log("Starting animation:", animationType);
    
    // استدعاء الدوال الموجودة في app.js حسب نوع الأنيميشن
    switch (animationType) {
        case 'fade_colors':
            await startFadeAnimation();
            break;
        case 'wave_effect':
            await startWaveAnimation();
            break;
        case 'rainbow_flow':
            await startRainbowAnimation();
            break;
        case 'blinking_pattern':
            await startBlinkingPattern();
            break;
        case 'running_lights':
            await startRunningLights();
            break;
        case 'breathing_effect':
            await startBreathingAnimation();
            break;
        case 'meteor_shower':
            await startSnakesChasing();
            break;
        case 'random_colors':
            await startRandomColors();
            break;
        case 'pulse_sync':
            await startPulseSyncAnimation();
            break;
        case 'fireworks_burst':
            await startFireworksBurst();
            break;
        case 'single_snake':
            await startSingleSnake();
            break;
        default:
            console.error('Unknown animation type:', animationType);
    }
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
