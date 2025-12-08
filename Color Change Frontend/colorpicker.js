// colorpicker.js


let cpTooltip = null;
let cpSelectedColor = '#ff0000';
let cpBrightness = 25;
let cpIsApplying = false;
let cpHoverTimeout = null;
let cpTooltipShownByClick = false; 


const cpErrorMessages = [
    "Please choose a color first!",
    "Select a color to make it shine!",
    "Color missing - waiting for your choice...",
    "Add some color magic first!",
    "Pick a color to start the party!"
];


function cpInit() {
    console.log('Initializing Color Picker...');

    cpLoadSettings();

    cpCreateTooltip();

    cpSetupEventListeners();
}

function cpCreateTooltip() {
    if (document.getElementById('cp-tooltip')) {
        cpTooltip = document.getElementById('cp-tooltip');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'cp-tooltip';
    tooltip.className = 'cp-tooltip';
    tooltip.innerHTML = `
        <div class="cp-tooltip-content">
            <h3 id="cp-tooltip-title">Color Picker</h3>
            <div class="cp-description" id="cp-description">Choose any color and brightness for your LED lights</div>
            
            <!-- Color Picker -->
            <div class="cp-color-container">
                <div class="cp-color-title">Choose Your Color:</div>
                    <div class="cp-color-wrapper">
                    <div class="cp-color-ring"></div>
                    <input type="color" id="cp-color-picker" value="${cpSelectedColor}">
                </div>
                <div class="cp-preview-container">
                    <div class="cp-selected-preview" 
                         id="cp-color-preview" 
                         style="background: ${cpSelectedColor}">
                    </div>
                    <span class="cp-preview-text" id="cp-preview-text">
                        Selected Color
                    </span>
                </div>
            </div>
            
            <!-- Brightness Controls -->
            <div class="cp-brightness-controls">
                <div class="cp-brightness-title">Set Brightness:</div>
                <div class="cp-brightness-display">
                    <span class="cp-brightness-value" id="cp-brightness-value">${cpBrightness}%</span>
                </div>
                <div class="cp-brightness-slider-container">
                    <input type="range" min="1" max="100" value="${cpBrightness}" 
                           class="cp-brightness-slider" id="cp-brightness-slider">
                </div>
                <div class="cp-brightness-note"></div>
            </div>
            
            <!-- Error Message -->
            <div class="cp-error-message" id="cp-error-message"></div>
            
            <!-- Apply Button -->
            <button class="cp-apply-btn" id="cp-apply-btn">Apply Color & Brightness</button>
        </div>
        <div class="cp-tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);
    cpTooltip = tooltip;
    
    console.log('Color Picker tooltip created');
}

function cpSetupEventListeners() {
    console.log('Setting up Color Picker event listeners...');
    

    const colorPickerBtn = document.getElementById('colorPickerBtn');
    if (!colorPickerBtn) {
        console.error('Color Picker button not found');
        return;
    }

    colorPickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Color Picker button clicked - showing tooltip immediately');

        if (cpHoverTimeout) {
            clearTimeout(cpHoverTimeout);
            cpHoverTimeout = null;
        }

        cpTooltipShownByClick = true;
        cpShowTooltip(colorPickerBtn);
    });

    colorPickerBtn.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Color Picker button hovered - starting 1-second delay');

        if (cpTooltip && cpTooltip.classList.contains('show')) {
            return;
        }

        if (cpHoverTimeout) {
            clearTimeout(cpHoverTimeout);
            cpHoverTimeout = null;
        }

        cpHoverTimeout = setTimeout(() => {
            console.log('1-second hover delay completed - showing tooltip');
            cpTooltipShownByClick = false; 
            cpShowTooltip(colorPickerBtn);
            cpHoverTimeout = null;
        }, 1000); 
    });
    
    colorPickerBtn.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse left Color Picker button');

        if (cpHoverTimeout) {
            clearTimeout(cpHoverTimeout);
            cpHoverTimeout = null;
            console.log('Hover timeout cleared - tooltip won\'t show');
        }

        if (cpTooltip && cpTooltip.classList.contains('show') && !cpTooltipShownByClick) {
            const tooltipRect = cpTooltip.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            if (!(mouseX >= tooltipRect.left && mouseX <= tooltipRect.right &&
                  mouseY >= tooltipRect.top && mouseY <= tooltipRect.bottom)) {
                cpHideTooltip();
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'cp-apply-btn') {
            console.log('CP Apply button clicked');
            cpHandleApplyColor(e);
        }
    });

    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'cp-color-picker') {
            cpHandleColorChange(e);
        }

        if (e.target && e.target.id === 'cp-brightness-slider') {
            cpHandleBrightnessChange(e);
        }
    });

    document.addEventListener('wheel', function(e) {
        const brightnessSlider = document.getElementById('cp-brightness-slider');
        if (brightnessSlider && (e.target === brightnessSlider || brightnessSlider.contains(e.target))) {
            e.preventDefault();
            cpHandleWheelBrightness(e, brightnessSlider);
        }
    });

    if (cpTooltip) {
        cpTooltip.addEventListener('mouseenter', () => {
            cpTooltip.classList.add('show');
        });
        
        cpTooltip.addEventListener('mouseleave', (e) => {
            cpHideTooltip();
            cpTooltipShownByClick = false; 
        });
    }
    

    document.addEventListener('click', function(e) {
        if (cpTooltip && cpTooltip.classList.contains('show')) {
            if (!cpTooltip.contains(e.target) && e.target.id !== 'colorPickerBtn') {
                cpHideTooltip();
                cpTooltipShownByClick = false; 
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        if (cpTooltip && cpTooltip.classList.contains('show')) {
            const brightnessSlider = document.getElementById('cp-brightness-slider');
            if (brightnessSlider && document.activeElement === brightnessSlider) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    cpAdjustBrightness(5);
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    cpAdjustBrightness(-5);
                }
            }
        }
    });

    window.addEventListener('blur', function() {
        if (cpHoverTimeout) {
            clearTimeout(cpHoverTimeout);
            cpHoverTimeout = null;
        }
    });
}

function cpShowTooltip(button) {
    console.log('Showing Color Picker tooltip');
    
    if (!cpTooltip) {
        console.error('No Color Picker tooltip found');
        return;
    }

    const rect = button.getBoundingClientRect();
    const tooltipTitle = document.getElementById('cp-tooltip-title');
    const description = document.getElementById('cp-description');
    const colorPicker = document.getElementById('cp-color-picker');
    const colorPreview = document.getElementById('cp-color-preview');
    const previewText = document.getElementById('cp-preview-text');
    const brightnessSlider = document.getElementById('cp-brightness-slider');
    const brightnessValue = document.getElementById('cp-brightness-value');
    const applyBtn = document.getElementById('cp-apply-btn');
    const errorMessage = document.getElementById('cp-error-message');

    if (!tooltipTitle || !description || !colorPicker || !colorPreview || !previewText || 
        !brightnessSlider || !brightnessValue || !applyBtn || !errorMessage) {
        console.error('Color Picker tooltip elements not found');
        return;
    }


    const [color1, color2, color3] = cpGenerateRandomColors();
    cpTooltip.style.setProperty('--cp-color-1', color1);
    cpTooltip.style.setProperty('--cp-color-2', color2);
    cpTooltip.style.setProperty('--cp-color-3', color3);

    colorPicker.value = cpSelectedColor;
    colorPreview.style.background = cpSelectedColor;
    previewText.textContent = 'Selected Color';

    brightnessSlider.value = cpBrightness;
    brightnessValue.textContent = `${cpBrightness}%`;

    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    cpTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    cpTooltip.style.top = `${rect.top - 10}px`;
    cpTooltip.style.transform = 'translate(-50%, -100%)';

    cpTooltip.classList.add('show');
    console.log('Color Picker tooltip shown');
}

function cpHideTooltip() {
    if (cpTooltip) {
        cpTooltip.classList.remove('show');
        console.log('Color Picker tooltip hidden');
    }
}

function cpHandleColorChange(e) {
    const newColor = e.target.value;
    cpSelectedColor = newColor;

    const colorPreview = document.getElementById('cp-color-preview');
    const previewText = document.getElementById('cp-preview-text');
    
    if (colorPreview && previewText) {
        colorPreview.style.background = newColor;
        colorPreview.textContent = '';
    }

    cpSaveSettings();
    console.log('Color changed to:', newColor);
}

function cpHandleBrightnessChange(e) {
    const newValue = parseInt(e.target.value);
    cpBrightness = newValue;
    cpUpdateBrightnessDisplay(newValue);
    cpSaveSettings();
}

function cpHandleWheelBrightness(e, slider) {
    const step = 5;
    let newValue = parseInt(slider.value) + (e.deltaY > 0 ? -step : step);
    newValue = Math.max(1, Math.min(100, newValue));
    
    slider.value = newValue;
    cpBrightness = newValue;
    
    cpUpdateBrightnessDisplay(newValue);
    cpSaveSettings();
}

function cpAdjustBrightness(change) {
    const brightnessSlider = document.getElementById('cp-brightness-slider');
    if (brightnessSlider) {
        let newValue = parseInt(brightnessSlider.value) + change;
        newValue = Math.max(1, Math.min(100, newValue));
        
        brightnessSlider.value = newValue;
        cpBrightness = newValue;
        
        cpUpdateBrightnessDisplay(newValue);
        cpSaveSettings();
    }
}

function cpUpdateBrightnessDisplay(value) {
    const brightnessValue = document.getElementById('cp-brightness-value');
    if (brightnessValue) {
        brightnessValue.textContent = `${value}%`;
    }
}

function cpGetRandomError() {
    return cpErrorMessages[Math.floor(Math.random() * cpErrorMessages.length)];
}

async function cpHandleApplyColor(e) {
    if (cpIsApplying) return;
    
    const applyBtn = e.target;
    const errorMessage = document.getElementById('cp-error-message');
    
    console.log('Applying Color Picker - Color:', cpSelectedColor, 'Brightness:', cpBrightness + '%');

    cpIsApplying = true;
    applyBtn.disabled = true;
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Applying...';

    try {

        if (typeof stopAnimation === 'function') {
            await stopAnimation();
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        await cpUpdateBrightness(cpBrightness);
        
        if (typeof changeColor === 'function') {
            await changeColor(cpSelectedColor);
        } else {
            await cpSendRequest("/color", { hex_color: cpSelectedColor });
        }
        
        cpHideTooltip();
        applyBtn.textContent = 'Done!';
        applyBtn.classList.add('done');
        
    } catch (error) {
        console.error('Error applying color and brightness:', error);
        applyBtn.textContent = 'Error!';

        if (errorMessage) {
            errorMessage.textContent = 'Failed to apply settings. Please try again.';
            errorMessage.style.display = 'block';
        }
    }

    setTimeout(() => {
        applyBtn.disabled = false;
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('done');
        cpIsApplying = false;
    }, 1000);
}

async function cpUpdateBrightness(brightness) {
    console.log(`Updating brightness to: ${brightness}%`);
    
    try {
        const result = await cpSendRequest("/set_brightness", { 
            brightness: brightness / 100 
        });
        
        if (result.status === "brightness_updated") {
            console.log("Brightness updated successfully");
            return true;
        } else {
            throw new Error("Failed to update brightness");
        }
    } catch (error) {
        console.error("Brightness update error:", error);
        throw error;
    }
}

async function cpSendRequest(endpoint, data) {
    const API_BASE_URL = `http://${window.location.hostname}:8000`;
    try {
        console.log('Sending CP request to:', endpoint, 'with data:', data);
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        console.log('CP request successful:', result);
        return result;
        
    } catch (e) {
        console.error("CP API Error:", e);
        throw e;
    }
}

function cpGenerateRandomColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
    const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

    return [
        `hsl(${hue1}, 100%, 60%)`,
        `hsl(${hue2}, 100%, 60%)`,
        `hsl(${hue3}, 100%, 60%)`
    ];
}

function cpLoadSettings() {
    const savedColor = localStorage.getItem('cpColor');
    const savedBrightness = localStorage.getItem('cpBrightness');
    
    if (savedColor !== null && savedColor !== 'null') {
        cpSelectedColor = savedColor;
    }
    
    if (savedBrightness !== null) {
        cpBrightness = parseInt(savedBrightness);
    }
    
    console.log('Loaded CP settings - Color:', cpSelectedColor, 'Brightness:', cpBrightness);
}

function cpSaveSettings() {
    localStorage.setItem('cpColor', cpSelectedColor);
    localStorage.setItem('cpBrightness', cpBrightness.toString());
    console.log('Saved CP settings - Color:', cpSelectedColor, 'Brightness:', cpBrightness);
}

document.addEventListener('DOMContentLoaded', cpInit);
