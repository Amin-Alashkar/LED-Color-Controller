// BrightnessControl.js


// Brightness Control functionality
const brightnessPanel = document.getElementById('brightnessPanel');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const applyBrightnessBtn = document.getElementById('applyBrightness');
const closeBrightnessBtn = document.querySelector('.brightness-header .close-btn');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

let currentAnimationType = null;
let currentBrightness = 0.25; // Default brightness

//  click event to all animation buttons
document.querySelectorAll('.button-container button, .custom-animation-btn').forEach(button => {
    if (button.id !== 'offBtn' 
        && button.id !== 'off2Btn' 
        && button.id !== 'customFadeBtn' 
        && button.id !== 'customBlinkBtn' 
        && button.id !== 'customBreathingBtn' 
        && button.id !== 'customMeteorShowerBtn' 
        && button.id !== 'customPulseSyncBtn'
        && button.id !== 'customGlitchFlashBtn' 
        && button.id !== 'customHeartBeatBtn' 
        && button.id !== 'customTunnelEffectBtn' 
        && button.id !== 'customLaserShotBtn' 
        && button.id !== 'customSparklingStarsBtn' 
        && button.id !== 'customStrobeFlashBtn'
        && button.id !== 'customKnightRiderBtn' 
        && button.id !== 'customBounceBackBtn' 
        && button.id !== 'customRippleTouchBtn' 
        && button.id !== 'customFireFlickerBtn' 
        && button.id !== 'customColorWipeBtn' 
        && button.id !== 'customStaticGlowBtn'
        && button.id !== 'customColorEchoBtn' 
        && button.id !== 'customTimeWarpBtn' 
        && button.id !== 'customQuantumFlickerBtn' 
        && button.id !== 'customRunningLightsBtn2' 
        && button.id !== 'customFireworksBurstBtn' 
        && button.id !== 'customRunningLightsBtn'
        && button.id !== 'redBtn'
        && button.id !== 'blueBtn'
        && button.id !== 'greenBtn'
        && button.id !== 'orangeBtn'
        && button.id !== 'yellowBtn'
        && button.id !== 'purpleBtn'
        && button.id !== 'whiteBtn'
        && button.id !== 'lightOneBtn'
        && button.id !== 'WaveEffectBtn'
        && button.id !== 'RainbowFlowBtn'
        && button.id !== 'BlinkingPatternBtn'
        && button.id !== 'RunningLightsBtn'
        && button.id !== 'BreathingEffectBtn'
        && button.id !== 'MeteorShowerBtn'
        && button.id !== 'PulseSyncBtn'
        && button.id !== 'FireworksBurstBtn'
        && button.id !== 'MeteorShowerNewBtn'
        && button.id !== 'RandomColorsBtn'

    ) {
        button.addEventListener('click', function() {
            // Store the current animation type
            currentAnimationType = this.id.replace('Btn', '');
            
            // Show brightness panel
            showBrightnessPanel();
        });
    }
});

// Show brightness panel
function showBrightnessPanel() {
    brightnessPanel.classList.remove('hidden');
    overlay.classList.add('active');
    
    // Set slider to current brightness value
    brightnessSlider.value = currentBrightness * 100;
    brightnessValue.textContent = `${Math.round(currentBrightness * 100)}%`;
}

// Hide brightness panel
function hideBrightnessPanel() {
    brightnessPanel.classList.add('hidden');
    overlay.classList.remove('active');
}

// Update brightness value display
brightnessSlider.addEventListener('input', function() {
    brightnessValue.textContent = `${this.value}%`;
});

// Apply brightness changes
applyBrightnessBtn.addEventListener('click', function() {
    currentBrightness = parseInt(brightnessSlider.value) / 100;
    hideBrightnessPanel();
    
    // Send brightness update to server
    updateBrightness(currentBrightness);
    
    // If an animation was selected, start it with the new brightness
    if (currentAnimationType) {
        const button = document.getElementById(`${currentAnimationType}Btn`);
        if (button) button.click();
    }
});

// Close panel when clicking close button
closeBrightnessBtn.addEventListener('click', hideBrightnessPanel);

// Close panel when clicking outside
overlay.addEventListener('click', hideBrightnessPanel);

// Prevent panel from closing when clicking inside it
brightnessPanel.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Function to update brightness on the server
async function updateBrightness(brightness) {
    try {
        const response = await fetch(`${API_BASE_URL}/set_brightness`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brightness: brightness })
        });
        
        const result = await response.json();
        if (result.status !== 'brightness_updated') {
            console.error('Failed to update brightness:', result.message);
        }
    } catch (error) {
        console.error('Error updating brightness:', error);
    }
}

