// app.js

const API_BASE_URL = `http://${window.location.hostname}:8000`;

// DOM Elements
const colorDisplay              = document.getElementById('colorDisplay');
const offBtn                    = document.getElementById('offBtn');
const off2Btn                   = document.getElementById('off2Btn');
const colorPicker               = document.getElementById('colorPicker');
const cardElement               = document.querySelector('.card');
let isAnimationRunning          = false;
let currentAnim                 = null;

// أزرار الانيميشن الجاهزه
const lightOneBtn               = document.getElementById('lightOneBtn');
const waveEffectBtn             = document.getElementById('WaveEffectBtn');
const rainbowFlowBtn            = document.getElementById('RainbowFlowBtn');
const blinkingPatternBtn        = document.getElementById('BlinkingPatternBtn');
const runningLightsBtn          = document.getElementById('RunningLightsBtn');
const breathingEffectBtn        = document.getElementById('BreathingEffectBtn');
const snakesChasingBtn          = document.getElementById('MeteorShowerBtn');
const randomColorsBtn           = document.getElementById('RandomColorsBtn');
const meteorShowerNewBtn        = document.getElementById('MeteorShowerNewBtn');
const pulseSyncBtn              = document.getElementById('PulseSyncBtn');
const fireworksBurstBtn         = document.getElementById('FireworksBurstBtn');
const customBreathingBtn        = document.getElementById('customBreathingBtn');

// Custom Animation
const customFadeBtn             = document.getElementById('customFadeBtn');
const customBlinkBtn            = document.getElementById('customBlinkBtn');
const customBreathingBtn2       = document.getElementById('customBreathingBtn');
const customMeteorShowerBtn     = document.getElementById('customMeteorShowerBtn');
const customPulseSyncBtn        = document.getElementById('customPulseSyncBtn');
const customGlitchFlashBtn      = document.getElementById('customGlitchFlashBtn');
const customHeartBeatBtn        = document.getElementById('customHeartBeatBtn');
const customTunnelEffectBtn     = document.getElementById('customTunnelEffectBtn');
const customLaserShotBtn        = document.getElementById('customLaserShotBtn');
const customSparklingStarsBtn   = document.getElementById('customSparklingStarsBtn');
const customStrobeFlashBtn      = document.getElementById('customStrobeFlashBtn');
const customKnightRiderBtn      = document.getElementById('customKnightRiderBtn');
const customBounceBackBtn       = document.getElementById('customBounceBackBtn');
const customRippleTouchBtn      = document.getElementById('customRippleTouchBtn');
const customFireFlickerBtn      = document.getElementById('customFireFlickerBtn');
const customColorWipeBtn        = document.getElementById('customColorWipeBtn');
const customStaticGlowBtn       = document.getElementById('customStaticGlowBtn');
const customColorEchoBtn        = document.getElementById('customColorEchoBtn');
const customTimeWarpBtn         = document.getElementById('customTimeWarpBtn');
const customQuantumFlickerBtn   = document.getElementById('customQuantumFlickerBtn');
const customRunningLightsBtn2   = document.getElementById('customRunningLightsBtn');
const customFireworksBurstBtn   = document.getElementById('customFireworksBurstBtn');



// نداء عام لإرسال طلبات POST
async function sendRequest(endpoint, data) {
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

// جلب الحالة الحالية من /state وتحديث الواجهة
async function fetchAndApplyState() {
    try {
        const res = await fetch(`${API_BASE_URL}/state`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { animation, color } = await res.json();

        if (color) {
            updateUI(color);
            cardElement.style.background = "";
        } else {
            updateUI('#000000');
            cardElement.style.background = "";
        }

        // ——— Fade Colors ———
        if (animation === "fade_colors") {
            isAnimationRunning = true;
            currentAnim = "fade_colors";
            lightOneBtn.classList.add('active');
            lightOneBtn.textContent = 'Fade Colors (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fade Colors";
        } else {
            lightOneBtn.classList.remove('active');
            lightOneBtn.textContent = 'Fade Colors';
        }

        // ——— Pulse Sync ———
        if (animation === "pulse_sync") {
            isAnimationRunning = true;
            currentAnim = "pulse_sync";
            pulseSyncBtn.classList.add('active');
            pulseSyncBtn.textContent = 'Pulse Sync (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Pulse Sync";
        } else {
            pulseSyncBtn.classList.remove('active');
            pulseSyncBtn.textContent = 'Pulse Sync';
        }

        // ——— Wave Effect ———
        if (animation === "wave_effect") {
            isAnimationRunning = true;
            currentAnim = "wave_effect";
            waveEffectBtn.classList.add('active');
            waveEffectBtn.textContent = 'Wave Effect (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Wave Effect";
        } else {
            waveEffectBtn.classList.remove('active');
            waveEffectBtn.textContent = 'Wave Effect';
        }

        // ——— Rainbow Flow ———
        if (animation === "rainbow_flow") {
            isAnimationRunning = true;
            currentAnim = "rainbow_flow";
            rainbowFlowBtn.classList.add('active');
            rainbowFlowBtn.textContent = 'Rainbow Flow (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Rainbow Flow";
        } else {
            rainbowFlowBtn.classList.remove('active');
            rainbowFlowBtn.textContent = 'Rainbow Flow';
        }

        // ——— Blinking Pattern ———
        if (animation === "blinking_pattern") {
            isAnimationRunning = true;
            currentAnim = "blinking_pattern";
            blinkingPatternBtn.classList.add('active');
            blinkingPatternBtn.textContent = 'Blinking Pattern (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Blinking Pattern";
        } else {
            blinkingPatternBtn.classList.remove('active');
            blinkingPatternBtn.textContent = 'Blinking Pattern';
        }

        // ——— Running Lights ———
        if (animation === "running_lights") {
            isAnimationRunning = true;
            currentAnim = "running_lights";
            runningLightsBtn.classList.add('active');
            runningLightsBtn.textContent = 'Running Lights (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Running Lights";
        } else {
            runningLightsBtn.classList.remove('active');
            runningLightsBtn.textContent = 'Running Lights';
        }

        // ——— Breathing Effect ———
        if (animation === "breathing_effect") {
            isAnimationRunning = true;
            currentAnim = "breathing_effect";
            breathingEffectBtn.classList.add('active');
            breathingEffectBtn.textContent = 'Breathing Effect (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect";
        } else {
            breathingEffectBtn.classList.remove('active');
            breathingEffectBtn.textContent = 'Breathing Effect';
        }

        // ——— Snakes Chasing ( Meteor Shower) ———
        if (animation === "meteor_shower") {
            isAnimationRunning = true;
            currentAnim = "meteor_shower";
            snakesChasingBtn.classList.add('active');
            snakesChasingBtn.textContent = 'Snakes Chasing (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Snakes Chasing";
        } else {
            snakesChasingBtn.classList.remove('active');
            snakesChasingBtn.textContent = 'Snakes Chasing';
        }
        // ----------- Random Colors ----------
        if (animation === "random_colors") {
            isAnimationRunning = true;
            currentAnim = "random_colors";
            randomColorsBtn.classList.add('active');
            randomColorsBtn.textContent = 'Random Colors (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Random Colors";
        } else {
            randomColorsBtn.classList.remove('active');
            randomColorsBtn.textContent = 'Random Colors';
        }

        // ———  single snake (New Meteor Shower) ———
        if (animation === "single_snake") {
            isAnimationRunning = true;
            currentAnim = "single_snake";
            meteorShowerNewBtn.classList.add('active');
            meteorShowerNewBtn.textContent = 'Meteor Shower (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Meteor Shower";
        } else {
            meteorShowerNewBtn.classList.remove('active');
            meteorShowerNewBtn.textContent = 'Meteor Shower';
        }

        // ——— Fireworks Burst ———
        if (animation === "fireworks_burst") {
            isAnimationRunning = true;
            currentAnim = "fireworks_burst";
            fireworksBurstBtn.classList.add('active');
            fireworksBurstBtn.textContent = 'Fireworks Burst (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fireworks Burst";
        } else {
            fireworksBurstBtn.classList.remove('active');
            fireworksBurstBtn.textContent = 'Fireworks Burst';
        }

        // ────  Custom Fade Colors ────
        if (animation === "custom_fade") {
            isAnimationRunning = true;
            currentAnim = "custom_fade";
            customFadeBtn.classList.add('active');
            customFadeBtn.textContent = 'Fade Colors - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fade Colors - Custom";
        } else {
            customFadeBtn.classList.remove('active');
            customFadeBtn.textContent = 'Fade Colors - Custom';
        }

        // ────  Custom Blinking ────
        if (animation === "custom_blink") {
            isAnimationRunning = true;
            currentAnim = "custom_blink";
            customBlinkBtn.classList.add('active');
            customBlinkBtn.textContent = 'Blinking - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Blinking - Custom";
        } else {
            customBlinkBtn.classList.remove('active');
            customBlinkBtn.textContent = 'Blinking - Custom';
        }

        // ────  Custom Breathing ────
        if (animation === "custom_breathing") {
            isAnimationRunning = true;
            currentAnim = "custom_breathing";
            customBreathingBtn2.classList.add('active');
            customBreathingBtn2.textContent = 'Breathing Effect - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect - Custom";
        } else {
            customBreathingBtn2.classList.remove('active');
            customBreathingBtn2.textContent = 'Breathing Effect - Custom';
        }

        // ────  Custom Meteor Shower ────
        if (animation === "custom_meteor_shower") {
            isAnimationRunning = true;
            currentAnim = "custom_meteor_shower";
            customMeteorShowerBtn.classList.add('active');
            customMeteorShowerBtn.textContent = 'Meteor Shower (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Meteor Shower - Custom";
        } else {
            customMeteorShowerBtn.classList.remove('active');
            customMeteorShowerBtn.textContent = 'Meteor Shower';
        }

        // ────  Custom Pulse Sync ────
        if (animation === "custom_pulse_sync") {
            isAnimationRunning = true;
            currentAnim = "custom_pulse_sync";
            customPulseSyncBtn.classList.add('active');
            customPulseSyncBtn.textContent = 'Pulse Sync (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Pulse Sync - Custom";
        } else {
            customPulseSyncBtn.classList.remove('active');
            customPulseSyncBtn.textContent = 'Pulse Sync';
        }

        // ──── Custom Glitch Flash ────
        if (animation === "custom_glitch_flash") {
            isAnimationRunning = true;
            currentAnim = "custom_glitch_flash";
            customGlitchFlashBtn.classList.add('active');
            customGlitchFlashBtn.textContent = 'Glitch Flash (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Glitch Flash - Custom";
        } else {
            customGlitchFlashBtn.classList.remove('active');
            customGlitchFlashBtn.textContent = 'Glitch Flash';
        }

        // ────  Custom Heart Beat ────
        if (animation === "custom_heart_beat") {
            isAnimationRunning = true;
            currentAnim = "custom_heart_beat";
            customHeartBeatBtn.classList.add('active');
            customHeartBeatBtn.textContent = 'Heart Beat (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Heart Beat - Custom";
        } else {
            customHeartBeatBtn.classList.remove('active');
            customHeartBeatBtn.textContent = 'Heart Beat';
        }

        // ────  Custom Tunnel Effect ────
        if (animation === "custom_tunnel_effect") {
            isAnimationRunning = true;
            currentAnim = "custom_tunnel_effect";
            customTunnelEffectBtn.classList.add('active');
            customTunnelEffectBtn.textContent = 'Tunnel Effect (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Tunnel Effect - Custom";
        } else {
            customTunnelEffectBtn.classList.remove('active');
            customTunnelEffectBtn.textContent = 'Tunnel Effect';
        }

        // ────  Custom Laser Shot ────
        if (animation === "custom_laser_shot") {
            isAnimationRunning = true;
            currentAnim = "custom_laser_shot";
            customLaserShotBtn.classList.add('active');
            customLaserShotBtn.textContent = 'Laser Shot (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Laser Shot - Custom";
        } else {
            customLaserShotBtn.classList.remove('active');
            customLaserShotBtn.textContent = 'Laser Shot';
        }

        // ────  Custom Sparkling Stars ────
        if (animation === "custom_sparkling_stars") {
            isAnimationRunning = true;
            currentAnim = "custom_sparkling_stars";
            customSparklingStarsBtn.classList.add('active');
            customSparklingStarsBtn.textContent = 'Sparkling Stars (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Sparkling Stars - Custom";
        } else {
            customSparklingStarsBtn.classList.remove('active');
            customSparklingStarsBtn.textContent = 'Sparkling Stars';
        }

        // ────  Custom Strobe Flash ────
        if (animation === "custom_strobe_flash") {
            isAnimationRunning = true;
            currentAnim = "custom_strobe_flash";
            customStrobeFlashBtn.classList.add('active');
            customStrobeFlashBtn.textContent = 'Strobe Flash (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Strobe Flash - Custom";
        } else {
            customStrobeFlashBtn.classList.remove('active');
            customStrobeFlashBtn.textContent = 'Strobe Flash';
        }

        // ────  Custom Knight Rider ────
        if (animation === "custom_knight_rider") {
            isAnimationRunning = true;
            currentAnim = "custom_knight_rider";
            customKnightRiderBtn.classList.add('active');
            customKnightRiderBtn.textContent = 'Knight Rider (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Knight Rider - Custom";
        } else {
            customKnightRiderBtn.classList.remove('active');
            customKnightRiderBtn.textContent = 'Knight Rider';
        }

        // ────  Custom Bounce Back ────
        if (animation === "custom_bounce_back") {
            isAnimationRunning = true;
            currentAnim = "custom_bounce_back";
            customBounceBackBtn.classList.add('active');
            customBounceBackBtn.textContent = 'Bounce Back (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Bounce Back - Custom";
        } else {
            customBounceBackBtn.classList.remove('active');
            customBounceBackBtn.textContent = 'Bounce Back';
        }

        // ────  Custom Ripple Touch ────
        if (animation === "custom_ripple_touch") {
            isAnimationRunning = true;
            currentAnim = "custom_ripple_touch";
            customRippleTouchBtn.classList.add('active');
            customRippleTouchBtn.textContent = 'Ripple Touch (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Ripple Touch - Custom";
        } else {
            customRippleTouchBtn.classList.remove('active');
            customRippleTouchBtn.textContent = 'Ripple Touch';
        }

        // ────  Custom Fire Flicker ────
        if (animation === "custom_fire_flicker") {
            isAnimationRunning = true;
            currentAnim = "custom_fire_flicker";
            customFireFlickerBtn.classList.add('active');
            customFireFlickerBtn.textContent = 'Fire Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fire Flicker - Custom";
        } else {
            customFireFlickerBtn.classList.remove('active');
            customFireFlickerBtn.textContent = 'Fire Flicker';
        }

        // ────  Custom Color Wipe ────
        if (animation === "custom_color_wipe") {
            isAnimationRunning = true;
            currentAnim = "custom_color_wipe";
            customColorWipeBtn.classList.add('active');
            customColorWipeBtn.textContent = 'Color Wipe (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Color Wipe - Custom";
        } else {
            customColorWipeBtn.classList.remove('active');
            customColorWipeBtn.textContent = 'Color Wipe';
        }

        // ────  Custom Static Glow with Flicker ────
        if (animation === "custom_static_glow") {
            isAnimationRunning = true;
            currentAnim = "custom_static_glow";
            customStaticGlowBtn.classList.add('active');
            customStaticGlowBtn.textContent = 'Static Glow with Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Static Glow with Flicker - Custom";
        } else {
            customStaticGlowBtn.classList.remove('active');
            customStaticGlowBtn.textContent = 'Static Glow with Flicker';
        }

        // ────  Custom Color Echo ────
        if (animation === "custom_color_echo") {
            isAnimationRunning = true;
            currentAnim = "custom_color_echo";
            customColorEchoBtn.classList.add('active');
            customColorEchoBtn.textContent = 'Color Echo (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Color Echo - Custom";
        } else {
            customColorEchoBtn.classList.remove('active');
            customColorEchoBtn.textContent = 'Color Echo';
        }

        // ──── Custom Time Warp ────
        if (animation === "custom_time_warp") {
            isAnimationRunning = true;
            currentAnim = "custom_time_warp";
            customTimeWarpBtn.classList.add('active');
            customTimeWarpBtn.textContent = 'Time Warp (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Time Warp - Custom";
        } else {
            customTimeWarpBtn.classList.remove('active');
            customTimeWarpBtn.textContent = 'Time Warp';
        }

        // ────  Custom Quantum Flicker ────
        if (animation === "custom_quantum_flicker") {
            isAnimationRunning = true;
            currentAnim = "custom_quantum_flicker";
            customQuantumFlickerBtn.classList.add('active');
            customQuantumFlickerBtn.textContent = 'Quantum Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Quantum Flicker - Custom";
        } else {
            customQuantumFlickerBtn.classList.remove('active');
            customQuantumFlickerBtn.textContent = 'Quantum Flicker';
        }

        // ────  Custom Running Lights ────
        if (animation === "custom_running_lights") {
            isAnimationRunning = true;
            currentAnim = "custom_running_lights";
            customRunningLightsBtn2.classList.add('active');
            customRunningLightsBtn2.textContent = 'Running Lights (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Running Lights - Custom";
        } else {
            customRunningLightsBtn2.classList.remove('active');
            customRunningLightsBtn2.textContent = 'Running Lights';
        }

        // Custom fireworks Burst
        if (animation === "custom_fireworks_burst") {
            isAnimationRunning = true;
            currentAnim = "custom_fireworks_burst";
            customFireworksBurstBtn.classList.add('active');
            customFireworksBurstBtn.textContent = 'Fireworks Burst (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fireworks Burst - Custom";
        } else {
            customFireworksBurstBtn.classList.remove('active');
            customFireworksBurstBtn.textContent = 'Fireworks Burst';
        }


    } catch (err) {
        console.error("Error fetching state:", err);
        updateUI('#000000');
        isAnimationRunning = false;
        currentAnim = null;
        // إزالة أي حالة نشطة على الأزرار
        lightOneBtn.classList.remove('active');
        lightOneBtn.textContent = 'Fade Colors';
        pulseSyncBtn.classList.remove('active');
        pulseSyncBtn.textContent = 'Pulse Sync';
        waveEffectBtn.classList.remove('active');
        waveEffectBtn.textContent = 'Wave Effect';
        rainbowFlowBtn.classList.remove('active');
        rainbowFlowBtn.textContent = 'Rainbow Flow';
        blinkingPatternBtn.classList.remove('active');
        blinkingPatternBtn.textContent = 'Blinking Pattern';
        runningLightsBtn.classList.remove('active');
        runningLightsBtn.textContent = 'Running Lights';
        breathingEffectBtn.classList.remove('active');
        breathingEffectBtn.textContent = 'Breathing Effect';
        snakesChasingBtn.classList.remove('active');
        snakesChasingBtn.textContent = 'Snakes Chasing';
        meteorShowerNewBtn.classList.remove('active');
        meteorShowerNewBtn.textContent = 'Meteor Shower';
        fireworksBurstBtn.classList.remove('active');
        randomColorsBtn.textContent = 'Random Colors';
        randomColorsBtn.classList.remove('active')
        fireworksBurstBtn.textContent = 'Fireworks Burst';
        customFadeBtn.classList.remove('active');
        customFadeBtn.textContent = 'Fade Colors - Custom';
        customBlinkBtn.classList.remove('active');
        customBlinkBtn.textContent = 'Blinking - Custom';
        customBreathingBtn2.classList.remove('active');
        customBreathingBtn2.textContent = 'Breathing Effect - Custom';
        customMeteorShowerBtn.classList.remove('active');
        customMeteorShowerBtn.textContent = 'Meteor Shower';
        customPulseSyncBtn.classList.remove('active');
        customPulseSyncBtn.textContent = 'Pulse Sync';
        customGlitchFlashBtn.classList.remove('active');
        customGlitchFlashBtn.textContent = 'Glitch Flash';
        customHeartBeatBtn.classList.remove('active');
        customHeartBeatBtn.textContent = 'Heart Beat';
        customTunnelEffectBtn.classList.remove('active');
        customTunnelEffectBtn.textContent = 'Tunnel Effect';
        customLaserShotBtn.classList.remove('active');
        customLaserShotBtn.textContent = 'Laser Shot';
        customSparklingStarsBtn.classList.remove('active');
        customSparklingStarsBtn.textContent = 'Sparkling Stars';
        customStrobeFlashBtn.classList.remove('active');
        customStrobeFlashBtn.textContent = 'Strobe Flash';
        customKnightRiderBtn.classList.remove('active');
        customKnightRiderBtn.textContent = 'Knight Rider';
        customBounceBackBtn.classList.remove('active');
        customBounceBackBtn.textContent = 'Bounce Back';
        customRippleTouchBtn.classList.remove('active');
        customRippleTouchBtn.textContent = 'Ripple Touch';
        customFireFlickerBtn.classList.remove('active');
        customFireFlickerBtn.textContent = 'Fire Flicker';
        customColorWipeBtn.classList.remove('active');
        customColorWipeBtn.textContent = 'Color Wipe';
        customStaticGlowBtn.classList.remove('active');
        customStaticGlowBtn.textContent = 'Static Glow with Flicker';
        customColorEchoBtn.classList.remove('active');
        customColorEchoBtn.textContent = 'Color Echo';
        customTimeWarpBtn.classList.remove('active');
        customTimeWarpBtn.textContent = 'Time Warp';
        customQuantumFlickerBtn.classList.remove('active');
        customQuantumFlickerBtn.textContent = 'Quantum Flicker';
        customRunningLightsBtn2.classList.remove('active');
        customRunningLightsBtn2.textContent = 'Running Lights';
        cardElement.style.background = "";
    }
}

// دالة تغيير اللون الثابت
async function changeColor(color) {
    if (isAnimationRunning) {
        await stopAnimation();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    playCardOverlay();
    updateUI(color);
    cardElement.style.background = "";
    await sendRequest("/color", { hex_color: color });
}

// دالة إيقاف الأنيميشن (POST /stop)
async function stopAnimation() {
    isAnimationRunning = false;
    currentAnim = null;
    // ازاله الحالة النشطة من كل الأزرار 
    lightOneBtn.classList.remove('active');
    lightOneBtn.textContent = 'Fade Colors';
    pulseSyncBtn.classList.remove('active');
    pulseSyncBtn.textContent = 'Pulse Sync';
    waveEffectBtn.classList.remove('active');
    waveEffectBtn.textContent = 'Wave Effect';
    rainbowFlowBtn.classList.remove('active');
    rainbowFlowBtn.textContent = 'Rainbow Flow';
    blinkingPatternBtn.classList.remove('active');
    blinkingPatternBtn.textContent = 'Blinking Pattern';
    runningLightsBtn.classList.remove('active');
    runningLightsBtn.textContent = 'Running Lights';
    breathingEffectBtn.classList.remove('active');
    breathingEffectBtn.textContent = 'Breathing Effect';
    snakesChasingBtn.classList.remove('active');
    snakesChasingBtn.textContent = 'Snakes Chasing';
    meteorShowerNewBtn.classList.remove('active');
    meteorShowerNewBtn.textContent = 'Meteor Shower';
    fireworksBurstBtn.classList.remove('active');
    randomColorsBtn.textContent = 'Random Colors';
    randomColorsBtn.classList.remove('active')
    fireworksBurstBtn.textContent = 'Fireworks Burst';
    customFadeBtn.classList.remove('active');
    customFadeBtn.textContent = 'Fade Colors - Custom';
    customBlinkBtn.classList.remove('active');
    customBlinkBtn.textContent = 'Blinking - Custom';
    customBreathingBtn2.classList.remove('active');
    customBreathingBtn2.textContent = 'Breathing Effect - Custom';
    customMeteorShowerBtn.classList.remove('active');
    customMeteorShowerBtn.textContent = 'Meteor Shower';
    customPulseSyncBtn.classList.remove('active');
    customPulseSyncBtn.textContent = 'Pulse Sync';
    customGlitchFlashBtn.classList.remove('active');
    customGlitchFlashBtn.textContent = 'Glitch Flash';
    customHeartBeatBtn.classList.remove('active');
    customHeartBeatBtn.textContent = 'Heart Beat';
    customTunnelEffectBtn.classList.remove('active');
    customTunnelEffectBtn.textContent = 'Tunnel Effect';
    customLaserShotBtn.classList.remove('active');
    customLaserShotBtn.textContent = 'Laser Shot';
    customSparklingStarsBtn.classList.remove('active');
    customSparklingStarsBtn.textContent = 'Sparkling Stars';
    customStrobeFlashBtn.classList.remove('active');
    customStrobeFlashBtn.textContent = 'Strobe Flash';
    customKnightRiderBtn.classList.remove('active');
    customKnightRiderBtn.textContent = 'Knight Rider';
    customBounceBackBtn.classList.remove('active');
    customBounceBackBtn.textContent = 'Bounce Back';
    customRippleTouchBtn.classList.remove('active');
    customRippleTouchBtn.textContent = 'Ripple Touch';
    customFireFlickerBtn.classList.remove('active');
    customFireFlickerBtn.textContent = 'Fire Flicker';
    customColorWipeBtn.classList.remove('active');
    customColorWipeBtn.textContent = 'Color Wipe';
    customStaticGlowBtn.classList.remove('active');
    customStaticGlowBtn.textContent = 'Static Glow with Flicker';
    customColorEchoBtn.classList.remove('active');
    customColorEchoBtn.textContent = 'Color Echo';
    customTimeWarpBtn.classList.remove('active');
    customTimeWarpBtn.textContent = 'Time Warp';
    customQuantumFlickerBtn.classList.remove('active');
    customQuantumFlickerBtn.textContent = 'Quantum Flicker';
    customRunningLightsBtn2.classList.remove('active');
    customRunningLightsBtn2.textContent = 'Running Lights';
    customFireworksBurstBtn.classList.remove('active');
    customFireworksBurstBtn.textContent = 'Fireworks Burst';
    colorDisplay.textContent = 'Off';
    cardElement.style.background = "";
    await sendRequest("/stop", {});
}

// ——— الدوال التي تشغل الانيميشنات ———

// Fade Colors
async function startFadeAnimation() {
    if (isAnimationRunning && currentAnim !== "fade_colors") {
        await stopAnimation();
    }
    // إذا كانت نفس الانيميشن تعمل حاليًا، نوقفها
    if (isAnimationRunning && currentAnim === "fade_colors") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "fade_colors";
    lightOneBtn.classList.add('active');
    lightOneBtn.textContent = 'Fade Colors (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Fade Colors";
    await sendRequest("/animate", { animation_type: "fade_colors" });
}

// Pulse Sync
async function startPulseSyncAnimation() {
    if (isAnimationRunning && currentAnim !== "pulse_sync") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "pulse_sync") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "pulse_sync";
    pulseSyncBtn.classList.add('active');
    pulseSyncBtn.textContent = 'Pulse Sync (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Pulse Sync";
    await sendRequest("/animate", { animation_type: "pulse_sync" });
}

// Wave Effect
async function startWaveAnimation() {
    if (isAnimationRunning && currentAnim !== "wave_effect") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "wave_effect") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "wave_effect";
    waveEffectBtn.classList.add('active');
    waveEffectBtn.textContent = 'Wave Effect (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Wave Effect";
    await sendRequest("/animate", { animation_type: "wave_effect" });
}

// Rainbow Flow
async function startRainbowAnimation() {
    if (isAnimationRunning && currentAnim !== "rainbow_flow") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "rainbow_flow") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "rainbow_flow";
    rainbowFlowBtn.classList.add('active');
    rainbowFlowBtn.textContent = 'Rainbow Flow (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Rainbow Flow";
    await sendRequest("/animate", { animation_type: "rainbow_flow" });
}

// Blinking Pattern
async function startBlinkingPattern() {
    if (isAnimationRunning && currentAnim !== "blinking_pattern") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "blinking_pattern") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "blinking_pattern";
    blinkingPatternBtn.classList.add('active');
    blinkingPatternBtn.textContent = 'Blinking Pattern (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Blinking Pattern";
    await sendRequest("/animate", { animation_type: "blinking_pattern" });
}

// Running Lights
async function startRunningLights() {
    if (isAnimationRunning && currentAnim !== "running_lights") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "running_lights") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "running_lights";
    runningLightsBtn.classList.add('active');
    runningLightsBtn.textContent = 'Running Lights (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Running Lights";
    await sendRequest("/animate", { animation_type: "running_lights" });
}

// Breathing Effect
async function startBreathingAnimation() {
    if (isAnimationRunning && currentAnim !== "breathing_effect") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "breathing_effect") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "breathing_effect";
    breathingEffectBtn.classList.add('active');
    breathingEffectBtn.textContent = 'Breathing Effect (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Breathing Effect";
    await sendRequest("/animate", { animation_type: "breathing_effect" });
}

// Snakes Chasing ( Meteor Shower)
async function startSnakesChasing() {
    if (isAnimationRunning && currentAnim !== "meteor_shower") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "meteor_shower") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "meteor_shower";
    snakesChasingBtn.classList.add('active');
    snakesChasingBtn.textContent = 'Snakes Chasing (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Snakes Chasing";
    await sendRequest("/animate", { animation_type: "meteor_shower" });
}

// ———   “Meteor Shower” (الأفعى الوحيدة) ———
async function startSingleSnake() {
    if (isAnimationRunning && currentAnim !== "single_snake") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "single_snake") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "single_snake";
    meteorShowerNewBtn.classList.add('active');
    meteorShowerNewBtn.textContent = 'Meteor Shower (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Meteor Shower";
    await sendRequest("/animate", { animation_type: "single_snake" });
}

async function startRandomColors() {
    if (isAnimationRunning && currentAnim !== "random_colors") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "random_colors") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "random_colors";
    randomColorsBtn.classList.add('active');
    randomColorsBtn.textContent = 'Random Colors (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Random Colors";
    await sendRequest("/animate", { animation_type: "random_colors" });
}

// Fireworks Burst
async function startFireworksBurst() {
    if (isAnimationRunning && currentAnim !== "fireworks_burst") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "fireworks_burst") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "fireworks_burst";
    fireworksBurstBtn.classList.add('active');
    fireworksBurstBtn.textContent = 'Fireworks Burst (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Fireworks Burst";
    await sendRequest("/animate", { animation_type: "fireworks_burst" });
}

// ────   “Fade Colors (Custom)” ────
async function startCustomFadeAnimation() {

    if (isAnimationRunning && currentAnim === "custom_fade") {
        await stopAnimation();
        return;
    }

    if (isAnimationRunning && currentAnim !== "custom_fade") {
        await stopAnimation();
    }
    //  طلب من المستخدم اختيار اللون:
    customFadeBtn.textContent = "Choose color…";
    // opens نافذة color picker برمجياً:
    colorPicker.click();
    // نُعدّ مستمعاً وحيداً لحدث "input" على colorPicker
    const onColorChosen = async (e) => {
        // أولاً ننظف (نزيل) هذا المستمع
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value; // اللون الذي اخترته
        // نضع UI على وضع التشغيل
        isAnimationRunning = true;
        currentAnim = "custom_fade";
        customFadeBtn.classList.add('active');
        customFadeBtn.textContent = 'Fade Colors - Custom (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Fade Colors - Custom";
        // نرسل طلب بدء أنيميشن custom_fade مع الـ hex_color الذي اخترته
        await sendRequest("/animate", {
            animation_type: "custom_fade",
            hex_color: chosenColor
        });
    };
    // نضيف مستمع input على colorPicker
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Blinking Pattern (Custom)” ────
async function startCustomBlinkAnimation() {
    if (isAnimationRunning && currentAnim === "custom_blink") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_blink") {
        await stopAnimation();
    }
    customBlinkBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_blink";
        customBlinkBtn.classList.add('active');
        customBlinkBtn.textContent = 'Blinking - Custom (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Blinking - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_blink",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ───  دالة “Breathing Effect (Custom)” ───
async function startCustomBreathingAnimation() {
    if (isAnimationRunning && currentAnim === "custom_breathing") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_breathing") {
        await stopAnimation();
    }
    customBreathingBtn2.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_breathing";
        customBreathingBtn2.classList.add('active');
        customBreathingBtn2.textContent = 'Breathing Effect - Custom (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Breathing Effect - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_breathing",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Meteor Shower (Custom)” ───
async function startCustomMeteorShower() {
    if (isAnimationRunning && currentAnim === "custom_meteor_shower") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_meteor_shower") {
        await stopAnimation();
    }
    customMeteorShowerBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_meteor_shower";
        customMeteorShowerBtn.classList.add('active');
        customMeteorShowerBtn.textContent = 'Meteor Shower (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Meteor Shower - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_meteor_shower",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Pulse Sync (Custom)” ───
async function startCustomPulseSync() {
    if (isAnimationRunning && currentAnim === "custom_pulse_sync") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_pulse_sync") {
        await stopAnimation();
    }
    customPulseSyncBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_pulse_sync";
        customPulseSyncBtn.classList.add('active');
        customPulseSyncBtn.textContent = 'Pulse Sync (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Pulse Sync - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_pulse_sync",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Glitch Flash (Custom)” ───
async function startCustomGlitchFlash() {
    if (isAnimationRunning && currentAnim === "custom_glitch_flash") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_glitch_flash") {
        await stopAnimation();
    }
    customGlitchFlashBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_glitch_flash";
        customGlitchFlashBtn.classList.add('active');
        customGlitchFlashBtn.textContent = 'Glitch Flash (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Glitch Flash - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_glitch_flash",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Heart Beat (Custom)” ───
async function startCustomHeartBeat() {
    if (isAnimationRunning && currentAnim === "custom_heart_beat") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_heart_beat") {
        await stopAnimation();
    }
    customHeartBeatBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_heart_beat";
        customHeartBeatBtn.classList.add('active');
        customHeartBeatBtn.textContent = 'Heart Beat (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Heart Beat - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_heart_beat",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Tunnel Effect (Custom)” ───
async function startCustomTunnelEffect() {
    if (isAnimationRunning && currentAnim === "custom_tunnel_effect") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_tunnel_effect") {
        await stopAnimation();
    }
    customTunnelEffectBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_tunnel_effect";
        customTunnelEffectBtn.classList.add('active');
        customTunnelEffectBtn.textContent = 'Tunnel Effect (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Tunnel Effect - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_tunnel_effect",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Laser Shot (Custom)” ───
async function startCustomLaserShot() {
    if (isAnimationRunning && currentAnim === "custom_laser_shot") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_laser_shot") {
        await stopAnimation();
    }
    customLaserShotBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_laser_shot";
        customLaserShotBtn.classList.add('active');
        customLaserShotBtn.textContent = 'Laser Shot (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Laser Shot - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_laser_shot",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Sparkling Stars (Custom)” ───
async function startCustomSparklingStars() {
    if (isAnimationRunning && currentAnim === "custom_sparkling_stars") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_sparkling_stars") {
        await stopAnimation();
    }
    customSparklingStarsBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_sparkling_stars";
        customSparklingStarsBtn.classList.add('active');
        customSparklingStarsBtn.textContent = 'Sparkling Stars (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Sparkling Stars - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_sparkling_stars",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Strobe Flash (Custom)” ───
async function startCustomStrobeFlash() {
    if (isAnimationRunning && currentAnim === "custom_strobe_flash") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_strobe_flash") {
        await stopAnimation();
    }
    customStrobeFlashBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_strobe_flash";
        customStrobeFlashBtn.classList.add('active');
        customStrobeFlashBtn.textContent = 'Strobe Flash (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Strobe Flash - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_strobe_flash",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Knight Rider (Custom)” ───
async function startCustomKnightRider() {
    if (isAnimationRunning && currentAnim === "custom_knight_rider") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_knight_rider") {
        await stopAnimation();
    }
    customKnightRiderBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_knight_rider";
        customKnightRiderBtn.classList.add('active');
        customKnightRiderBtn.textContent = 'Knight Rider (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Knight Rider - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_knight_rider",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Bounce Back (Custom)” ───
async function startCustomBounceBack() {
    if (isAnimationRunning && currentAnim === "custom_bounce_back") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_bounce_back") {
        await stopAnimation();
    }
    customBounceBackBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_bounce_back";
        customBounceBackBtn.classList.add('active');
        customBounceBackBtn.textContent = 'Bounce Back (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Bounce Back - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_bounce_back",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Ripple Touch (Custom)” ───
async function startCustomRippleTouch() {
    if (isAnimationRunning && currentAnim === "custom_ripple_touch") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_ripple_touch") {
        await stopAnimation();
    }
    customRippleTouchBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_ripple_touch";
        customRippleTouchBtn.classList.add('active');
        customRippleTouchBtn.textContent = 'Ripple Touch (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Ripple Touch - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_ripple_touch",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Fire Flicker (Custom)” ───
async function startCustomFireFlicker() {
    if (isAnimationRunning && currentAnim === "custom_fire_flicker") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_fire_flicker") {
        await stopAnimation();
    }
    customFireFlickerBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_fire_flicker";
        customFireFlickerBtn.classList.add('active');
        customFireFlickerBtn.textContent = 'Fire Flicker (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Fire Flicker - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_fire_flicker",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Color Wipe (Custom)” ───
async function startCustomColorWipe() {
    if (isAnimationRunning && currentAnim === "custom_color_wipe") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_color_wipe") {
        await stopAnimation();
    }
    customColorWipeBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_color_wipe";
        customColorWipeBtn.classList.add('active');
        customColorWipeBtn.textContent = 'Color Wipe (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Color Wipe - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_color_wipe",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Static Glow with Flicker (Custom)” ───
async function startCustomStaticGlow() {
    if (isAnimationRunning && currentAnim === "custom_static_glow") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_static_glow") {
        await stopAnimation();
    }
    customStaticGlowBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_static_glow";
        customStaticGlowBtn.classList.add('active');
        customStaticGlowBtn.textContent = 'Static Glow with Flicker (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Static Glow with Flicker - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_static_glow",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ──── دالة “Color Echo (Custom)” ───
async function startCustomColorEcho() {
    if (isAnimationRunning && currentAnim === "custom_color_echo") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_color_echo") {
        await stopAnimation();
    }
    customColorEchoBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_color_echo";
        customColorEchoBtn.classList.add('active');
        customColorEchoBtn.textContent = 'Color Echo (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Color Echo - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_color_echo",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Time Warp (Custom)” ───
async function startCustomTimeWarp() {
    if (isAnimationRunning && currentAnim === "custom_time_warp") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_time_warp") {
        await stopAnimation();
    }
    customTimeWarpBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_time_warp";
        customTimeWarpBtn.classList.add('active');
        customTimeWarpBtn.textContent = 'Time Warp (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Time Warp - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_time_warp",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Quantum Flicker (Custom)” ───
async function startCustomQuantumFlicker() {
    if (isAnimationRunning && currentAnim === "custom_quantum_flicker") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_quantum_flicker") {
        await stopAnimation();
    }
    customQuantumFlickerBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_quantum_flicker";
        customQuantumFlickerBtn.classList.add('active');
        customQuantumFlickerBtn.textContent = 'Quantum Flicker (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Quantum Flicker - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_quantum_flicker",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// ────  دالة “Running Lights (Custom)” ───
async function startCustomRunningLights() {
    if (isAnimationRunning && currentAnim === "custom_running_lights") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_running_lights") {
        await stopAnimation();
    }
    customRunningLightsBtn2.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_running_lights";
        customRunningLightsBtn2.classList.add('active');
        customRunningLightsBtn2.textContent = 'Running Lights (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Running Lights - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_running_lights",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}

// Custom Fireworks Burst
async function startCustomFireworksBurst() {
    if (isAnimationRunning && currentAnim === "custom_fireworks_burst") {
        await stopAnimation();
        return;
    }
    if (isAnimationRunning && currentAnim !== "custom_fireworks_burst") {
        await stopAnimation();
    }
    customFireworksBurstBtn.textContent = "Choose color…";
    colorPicker.click();
    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        isAnimationRunning = true;
        currentAnim = "custom_fireworks_burst";
        customFireworksBurstBtn.classList.add('active');
        customFireworksBurstBtn.textContent = 'Fireworks Burst (Custom) (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Fireworks Burst - Custom";
        await sendRequest("/animate", {
            animation_type: "custom_fireworks_burst",
            hex_color: chosenColor
        });
    };
    colorPicker.addEventListener("input", onColorChosen);
}


// تحديث الواجهة إلى اللون المعطى
function updateUI(color) {
    document.body.style.background     = color;
    document.body.style.boxShadow      = `0 0 80px ${color}80 inset`;
    colorDisplay.style.background      = color;
    colorDisplay.textContent           = color.toUpperCase();
    colorPicker.value                  = color;
}

// ربط الأحداث
lightOneBtn             .addEventListener("click", startFadeAnimation);
pulseSyncBtn            .addEventListener("click", startPulseSyncAnimation);
waveEffectBtn           .addEventListener("click", startWaveAnimation);
rainbowFlowBtn          .addEventListener("click", startRainbowAnimation);
blinkingPatternBtn      .addEventListener("click", startBlinkingPattern);
runningLightsBtn        .addEventListener("click", startRunningLights);
breathingEffectBtn      .addEventListener("click", startBreathingAnimation);
snakesChasingBtn        .addEventListener("click", startSnakesChasing);
meteorShowerNewBtn      .addEventListener("click", startSingleSnake);
randomColorsBtn         .addEventListener("click", startRandomColors);
fireworksBurstBtn       .addEventListener("click", startFireworksBurst);
offBtn                  .addEventListener("click", stopAnimation);
off2Btn                 .addEventListener("click", stopAnimation);
customFadeBtn           .addEventListener("click", startCustomFadeAnimation);
customBlinkBtn          .addEventListener("click", startCustomBlinkAnimation);
customBreathingBtn2     .addEventListener("click", startCustomBreathingAnimation);
customMeteorShowerBtn   .addEventListener("click", startCustomMeteorShower);
customPulseSyncBtn      .addEventListener("click", startCustomPulseSync);
customGlitchFlashBtn    .addEventListener("click", startCustomGlitchFlash);
customHeartBeatBtn      .addEventListener("click", startCustomHeartBeat);
customTunnelEffectBtn   .addEventListener("click", startCustomTunnelEffect);
customLaserShotBtn      .addEventListener("click", startCustomLaserShot);
customSparklingStarsBtn .addEventListener("click", startCustomSparklingStars);
customStrobeFlashBtn    .addEventListener("click", startCustomStrobeFlash);
customKnightRiderBtn    .addEventListener("click", startCustomKnightRider);
customBounceBackBtn     .addEventListener("click", startCustomBounceBack);
customRippleTouchBtn    .addEventListener("click", startCustomRippleTouch);
customFireFlickerBtn    .addEventListener("click", startCustomFireFlicker);
customColorWipeBtn      .addEventListener("click", startCustomColorWipe);
customStaticGlowBtn     .addEventListener("click", startCustomStaticGlow);
customColorEchoBtn      .addEventListener("click", startCustomColorEcho);
customTimeWarpBtn       .addEventListener("click", startCustomTimeWarp);
customQuantumFlickerBtn .addEventListener("click", startCustomQuantumFlicker);
customRunningLightsBtn2 .addEventListener("click", startCustomRunningLights);
customFireworksBurstBtn .addEventListener("click", startCustomFireworksBurst);


// عند تغيير اللون عبر Color Picker
colorPicker.addEventListener("input", e => {
    changeColor(e.target.value);
});

// === Color picker: local preview + debounced server update ===
(() => {
  const DEBOUNCE_MS = 700; // وقت الانتظار بعد آخر حركة قبل الإرسال
  let colorDebounceTimer = null;
  let lastSentColor = null;

  // Preview local UI immediately while user drags
  function previewColor(hex) {
    // فقط تحديث الواجهة المحلية — لا نرسل للسيرفر هنا
    updateUI(hex);
  }

  // Called when we decide user "stopped" — do the real send
  async function commitColor(hex) {
    if (!hex) return;
    // تجنّب الإعادة لو نفس اللون كان مرسل من قبل
    if (lastSentColor === hex) return;
    lastSentColor = hex;
    // changeColor يوقّف الأنيميشن لو شغّال ثم يرسل POST /color
    await changeColor(hex);
  }

  // on input: preview + restart debounce
  colorPicker.addEventListener('input', (e) => {
    const hex = e.target.value;
    previewColor(hex);

    if (colorDebounceTimer) clearTimeout(colorDebounceTimer);
    colorDebounceTimer = setTimeout(() => {
      commitColor(hex);
      colorDebounceTimer = null;
    }, DEBOUNCE_MS);
  });

  // on change (some browsers fire this at end) -> commit immediately
  colorPicker.addEventListener('change', (e) => {
    const hex = e.target.value;
    if (colorDebounceTimer) {
      clearTimeout(colorDebounceTimer);
      colorDebounceTimer = null;
    }
    commitColor(hex);
  });

  // pointerup/touchend for safety (user lifts finger) -> commit
  colorPicker.addEventListener('pointerup', (e) => {
    // Some browsers don't fire 'change' reliably for input[type=color]
    const hex = colorPicker.value;
    if (colorDebounceTimer) {
      clearTimeout(colorDebounceTimer);
      colorDebounceTimer = null;
    }
    commitColor(hex);
  }, { passive: true });

  // optional: if user navigates away, clear timer
  window.addEventListener('beforeunload', () => {
    if (colorDebounceTimer) {
      clearTimeout(colorDebounceTimer);
      colorDebounceTimer = null;
    }
  });
})();


// عند تحميل الصفحة أول مرة
document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndApplyState();
    setInterval(fetchAndApplyState, 2000);
});

// SSE لدفع الحالة تلقائيًا
const evtSource = new EventSource(`${API_BASE_URL}/stream`);
evtSource.onmessage = e => {
    try {
        const { animation, color } = JSON.parse(e.data);

        if (color) {
            updateUI(color);
            cardElement.style.background = "";
        } else {
            updateUI('#000000');
            cardElement.style.background = "";
        }

        if (animation === "fade_colors") {
            isAnimationRunning = true;
            currentAnim = "fade_colors";
            lightOneBtn.classList.add('active');
            lightOneBtn.textContent = 'Fade Colors (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fade Colors";
        } else {
            lightOneBtn.classList.remove('active');
            lightOneBtn.textContent = 'Fade Colors';
        }

        if (animation === "pulse_sync") {
            isAnimationRunning = true;
            currentAnim = "pulse_sync";
            pulseSyncBtn.classList.add('active');
            pulseSyncBtn.textContent = 'Pulse Sync (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Pulse Sync";
        } else {
            pulseSyncBtn.classList.remove('active');
            pulseSyncBtn.textContent = 'Pulse Sync';
        }

        if (animation === "wave_effect") {
            isAnimationRunning = true;
            currentAnim = "wave_effect";
            waveEffectBtn.classList.add('active');
            waveEffectBtn.textContent = 'Wave Effect (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Wave Effect";
        } else {
            waveEffectBtn.classList.remove('active');
            waveEffectBtn.textContent = 'Wave Effect';
        }

        if (animation === "rainbow_flow") {
            isAnimationRunning = true;
            currentAnim = "rainbow_flow";
            rainbowFlowBtn.classList.add('active');
            rainbowFlowBtn.textContent = 'Rainbow Flow (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Rainbow Flow";
        } else {
            rainbowFlowBtn.classList.remove('active');
            rainbowFlowBtn.textContent = 'Rainbow Flow';
        }

        if (animation === "blinking_pattern") {
            isAnimationRunning = true;
            currentAnim = "blinking_pattern";
            blinkingPatternBtn.classList.add('active');
            blinkingPatternBtn.textContent = 'Blinking Pattern (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Blinking Pattern";
        } else {
            blinkingPatternBtn.classList.remove('active');
            blinkingPatternBtn.textContent = 'Blinking Pattern';
        }

        if (animation === "running_lights") {
            isAnimationRunning = true;
            currentAnim = "running_lights";
            runningLightsBtn.classList.add('active');
            runningLightsBtn.textContent = 'Running Lights (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Running Lights";
        } else {
            runningLightsBtn.classList.remove('active');
            runningLightsBtn.textContent = 'Running Lights';
        }

        if (animation === "breathing_effect") {
            isAnimationRunning = true;
            currentAnim = "breathing_effect";
            breathingEffectBtn.classList.add('active');
            breathingEffectBtn.textContent = 'Breathing Effect (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect";
        } else {
            breathingEffectBtn.classList.remove('active');
            breathingEffectBtn.textContent = 'Breathing Effect';
        }

        if (animation === "meteor_shower") {
            isAnimationRunning = true;
            currentAnim = "meteor_shower";
            snakesChasingBtn.classList.add('active');
            snakesChasingBtn.textContent = 'Snakes Chasing (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Snakes Chasing";
        } else {
            snakesChasingBtn.classList.remove('active');
            snakesChasingBtn.textContent = 'Snakes Chasing';
        }

        if (animation === "single_snake") {
            isAnimationRunning = true;
            currentAnim = "single_snake";
            meteorShowerNewBtn.classList.add('active');
            meteorShowerNewBtn.textContent = 'Meteor Shower (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Meteor Shower";
        } else {
            meteorShowerNewBtn.classList.remove('active');
            meteorShowerNewBtn.textContent = 'Meteor Shower';
        }

        if (animation === "random_colors") {
            isAnimationRunning = true;
            currentAnim = "random_colors";
            randomColorsBtn.classList.add('active');
            randomColorsBtn.textContent = 'Random Colors (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Random Colors";
        } else {
            randomColorsBtn.classList.remove('active');
            randomColorsBtn.textContent = 'Random Colors';
        }

        if (animation === "fireworks_burst") {
            isAnimationRunning = true;
            currentAnim = "fireworks_burst";
            fireworksBurstBtn.classList.add('active');
            fireworksBurstBtn.textContent = 'Fireworks Burst (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fireworks Burst";
        } else {
            fireworksBurstBtn.classList.remove('active');
            fireworksBurstBtn.textContent = 'Fireworks Burst';
        }

        // ──── Custom Animation ────

        if (animation === "custom_fade") {
            isAnimationRunning = true;
            currentAnim = "custom_fade";
            customFadeBtn.classList.add('active');
            customFadeBtn.textContent = 'Fade Colors - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fade Colors - Custom";
        } else {
            customFadeBtn.classList.remove('active');
            customFadeBtn.textContent = 'Fade Colors - Custom';
        }

        if (animation === "custom_blink") {
            isAnimationRunning = true;
            currentAnim = "custom_blink";
            customBlinkBtn.classList.add('active');
            customBlinkBtn.textContent = 'Blinking - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Blinking - Custom";
        } else {
            customBlinkBtn.classList.remove('active');
            customBlinkBtn.textContent = 'Blinking - Custom';
        }

        if (animation === "custom_breathing") {
            isAnimationRunning = true;
            currentAnim = "custom_breathing";
            customBreathingBtn2.classList.add('active');
            customBreathingBtn2.textContent = 'Breathing Effect - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect - Custom";
        } else {
            customBreathingBtn2.classList.remove('active');
            customBreathingBtn2.textContent = 'Breathing Effect - Custom';
        }

        if (animation === "custom_meteor_shower") {
            isAnimationRunning = true;
            currentAnim = "custom_meteor_shower";
            customMeteorShowerBtn.classList.add('active');
            customMeteorShowerBtn.textContent = 'Meteor Shower (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Meteor Shower - Custom";
        } else {
            customMeteorShowerBtn.classList.remove('active');
            customMeteorShowerBtn.textContent = 'Meteor Shower';
        }

        if (animation === "custom_pulse_sync") {
            isAnimationRunning = true;
            currentAnim = "custom_pulse_sync";
            customPulseSyncBtn.classList.add('active');
            customPulseSyncBtn.textContent = 'Pulse Sync (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Pulse Sync - Custom";
        } else {
            customPulseSyncBtn.classList.remove('active');
            customPulseSyncBtn.textContent = 'Pulse Sync';
        }

        if (animation === "custom_glitch_flash") {
            isAnimationRunning = true;
            currentAnim = "custom_glitch_flash";
            customGlitchFlashBtn.classList.add('active');
            customGlitchFlashBtn.textContent = 'Glitch Flash (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Glitch Flash - Custom";
        } else {
            customGlitchFlashBtn.classList.remove('active');
            customGlitchFlashBtn.textContent = 'Glitch Flash';
        }

        if (animation === "custom_heart_beat") {
            isAnimationRunning = true;
            currentAnim = "custom_heart_beat";
            customHeartBeatBtn.classList.add('active');
            customHeartBeatBtn.textContent = 'Heart Beat (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Heart Beat - Custom";
        } else {
            customHeartBeatBtn.classList.remove('active');
            customHeartBeatBtn.textContent = 'Heart Beat';
        }

        if (animation === "custom_tunnel_effect") {
            isAnimationRunning = true;
            currentAnim = "custom_tunnel_effect";
            customTunnelEffectBtn.classList.add('active');
            customTunnelEffectBtn.textContent = 'Tunnel Effect (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Tunnel Effect - Custom";
        } else {
            customTunnelEffectBtn.classList.remove('active');
            customTunnelEffectBtn.textContent = 'Tunnel Effect';
        }

        if (animation === "custom_laser_shot") {
            isAnimationRunning = true;
            currentAnim = "custom_laser_shot";
            customLaserShotBtn.classList.add('active');
            customLaserShotBtn.textContent = 'Laser Shot (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Laser Shot - Custom";
        } else {
            customLaserShotBtn.classList.remove('active');
            customLaserShotBtn.textContent = 'Laser Shot';
        }

        if (animation === "custom_sparkling_stars") {
            isAnimationRunning = true;
            currentAnim = "custom_sparkling_stars";
            customSparklingStarsBtn.classList.add('active');
            customSparklingStarsBtn.textContent = 'Sparkling Stars (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Sparkling Stars - Custom";
        } else {
            customSparklingStarsBtn.classList.remove('active');
            customSparklingStarsBtn.textContent = 'Sparkling Stars';
        }

        if (animation === "custom_strobe_flash") {
            isAnimationRunning = true;
            currentAnim = "custom_strobe_flash";
            customStrobeFlashBtn.classList.add('active');
            customStrobeFlashBtn.textContent = 'Strobe Flash (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Strobe Flash - Custom";
        } else {
            customStrobeFlashBtn.classList.remove('active');
            customStrobeFlashBtn.textContent = 'Strobe Flash';
        }

        if (animation === "custom_knight_rider") {
            isAnimationRunning = true;
            currentAnim = "custom_knight_rider";
            customKnightRiderBtn.classList.add('active');
            customKnightRiderBtn.textContent = 'Knight Rider (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Knight Rider - Custom";
        } else {
            customKnightRiderBtn.classList.remove('active');
            customKnightRiderBtn.textContent = 'Knight Rider';
        }

        if (animation === "custom_bounce_back") {
            isAnimationRunning = true;
            currentAnim = "custom_bounce_back";
            customBounceBackBtn.classList.add('active');
            customBounceBackBtn.textContent = 'Bounce Back (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Bounce Back - Custom";
        } else {
            customBounceBackBtn.classList.remove('active');
            customBounceBackBtn.textContent = 'Bounce Back';
        }

        if (animation === "custom_ripple_touch") {
            isAnimationRunning = true;
            currentAnim = "custom_ripple_touch";
            customRippleTouchBtn.classList.add('active');
            customRippleTouchBtn.textContent = 'Ripple Touch (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Ripple Touch - Custom";
        } else {
            customRippleTouchBtn.classList.remove('active');
            customRippleTouchBtn.textContent = 'Ripple Touch';
        }

        if (animation === "custom_fire_flicker") {
            isAnimationRunning = true;
            currentAnim = "custom_fire_flicker";
            customFireFlickerBtn.classList.add('active');
            customFireFlickerBtn.textContent = 'Fire Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fire Flicker - Custom";
        } else {
            customFireFlickerBtn.classList.remove('active');
            customFireFlickerBtn.textContent = 'Fire Flicker';
        }

        if (animation === "custom_color_wipe") {
            isAnimationRunning = true;
            currentAnim = "custom_color_wipe";
            customColorWipeBtn.classList.add('active');
            customColorWipeBtn.textContent = 'Color Wipe (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Color Wipe - Custom";
        } else {
            customColorWipeBtn.classList.remove('active');
            customColorWipeBtn.textContent = 'Color Wipe';
        }

        if (animation === "custom_static_glow") {
            isAnimationRunning = true;
            currentAnim = "custom_static_glow";
            customStaticGlowBtn.classList.add('active');
            customStaticGlowBtn.textContent = 'Static Glow with Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Static Glow with Flicker - Custom";
        } else {
            customStaticGlowBtn.classList.remove('active');
            customStaticGlowBtn.textContent = 'Static Glow with Flicker';
        }

        if (animation === "custom_color_echo") {
            isAnimationRunning = true;
            currentAnim = "custom_color_echo";
            customColorEchoBtn.classList.add('active');
            customColorEchoBtn.textContent = 'Color Echo (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Color Echo - Custom";
        } else {
            customColorEchoBtn.classList.remove('active');
            customColorEchoBtn.textContent = 'Color Echo';
        }

        if (animation === "custom_time_warp") {
            isAnimationRunning = true;
            currentAnim = "custom_time_warp";
            customTimeWarpBtn.classList.add('active');
            customTimeWarpBtn.textContent = 'Time Warp (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Time Warp - Custom";
        } else {
            customTimeWarpBtn.classList.remove('active');
            customTimeWarpBtn.textContent = 'Time Warp';
        }

        if (animation === "custom_quantum_flicker") {
            isAnimationRunning = true;
            currentAnim = "custom_quantum_flicker";
            customQuantumFlickerBtn.classList.add('active');
            customQuantumFlickerBtn.textContent = 'Quantum Flicker (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Quantum Flicker - Custom";
        } else {
            customQuantumFlickerBtn.classList.remove('active');
            customQuantumFlickerBtn.textContent = 'Quantum Flicker';
        }

        if (animation === "custom_running_lights") {
            isAnimationRunning = true;
            currentAnim = "custom_running_lights";
            customRunningLightsBtn2.classList.add('active');
            customRunningLightsBtn2.textContent = 'Running Lights (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Running Lights - Custom";
        } else {
            customRunningLightsBtn2.classList.remove('active');
            customRunningLightsBtn2.textContent = 'Running Lights';
        }

        if (animation === "custom_fireworks_burst") {
            isAnimationRunning = true;
            currentAnim = "custom_fireworks_burst";
            customFireworksBurstBtn.classList.add('active');
            customFireworksBurstBtn.textContent = 'Fireworks Burst (Custom) (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fireworks Burst - Custom";
        } else {
            customFireworksBurstBtn.classList.remove('active');
            customFireworksBurstBtn.textContent = 'Fireworks Burst';
        }


    } catch (err) {
        console.error("SSE onmessage parse error:", err);
    }
};



// تكويد النجوم المتوهجة
document.addEventListener("DOMContentLoaded", function () {
    const starsContainer = document.querySelector(".stars-container");
    for (let i = 0; i < 7; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        star.innerHTML = "⋆";
        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.animationDelay = Math.random() * 3 + "s";
        star.addEventListener("animationiteration", () => {
            star.style.left = Math.random() * window.innerWidth + "px";
            star.style.top = Math.random() * window.innerHeight + "px";
        });
        starsContainer.appendChild(star);
    }
});


/* === Helper: hex -> "r,g,b" === */
function hexToRgbString(hex) {
  if (!hex) return '0,0,0';
  hex = hex.replace('#','').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  const int = parseInt(hex, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r},${g},${b}`;
}


function setUIColor(hexOrRgb) {
  let rgb;
  if (!hexOrRgb) {
    rgb = '0,0,0';
    document.documentElement.style.setProperty('--ui-color', '#000000');
  } else if (hexOrRgb.startsWith('rgb')) {
    const nums = hexOrRgb.replace(/rgba?$begin:math:text$|$end:math:text$|\s/g,'').split(',').slice(0,3);
    rgb = nums.join(',');
    document.documentElement.style.setProperty('--ui-color', `rgb(${rgb})`);
  } else if (hexOrRgb.indexOf(',') !== -1) {
    rgb = hexOrRgb;
    document.documentElement.style.setProperty('--ui-color', `rgb(${rgb})`);
  } else {
    rgb = hexToRgbString(hexOrRgb);
    document.documentElement.style.setProperty('--ui-color', hexOrRgb);
  }
  document.documentElement.style.setProperty('--ui-rgb', rgb);
}


function getCurrentColor() {
  const cp = document.getElementById('colorPicker');
  if (cp && cp.value) return cp.value;
  const display = document.getElementById('colorDisplay');
  if (display) {
    const style = window.getComputedStyle(display).backgroundColor;
    if (style) return style;
  }
  return '#000000';
}

function playCardOverlay() {
  const card = document.querySelector('.card');
  if (!card) return;
  // نضبط اللون الحالي
  setUIColor(getCurrentColor());
  // نضيف الكلاس اللي يشغل overlay
  card.classList.add('card-overlay');
    // إزالة الكلاس بعد انتهاء الانتقال
    setTimeout(() => {
        card.classList.remove('card-overlay');
    }, 500);
  // نشيل الكلاس بعد ما يخلص الانيميشن عشان يقدر يعيد التشغيل بالـreload
  card.addEventListener('animationend', () => {
    card.classList.remove('card-overlay');
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  //  overlay بنفس اللون الحالي
  setUIColor(getCurrentColor());

  const overlay = document.getElementById('page-overlay');
  if (overlay) {
    // شغل الانيميشن فوراt
    overlay.classList.add('fade-out');
    // بعد الانيميشن نشيل العنصر من الـDOM
    overlay.addEventListener('animationend', () => {
      overlay.remove();
    });
  }
});


function updateUI(color) {
    if (color) {
        document.body.style.background = color;
        document.body.style.boxShadow  = `0 0 80px ${ (color.startsWith('rgb') ? color.replace('rgb','rgba').replace(')', ',0.5)') : color + '80' ) } inset`;
        colorDisplay.style.background  = color;
        colorDisplay.textContent       = color.toUpperCase();
        colorPicker.value              = (color.startsWith('#') ? color : colorPicker.value);
    } else {
        document.body.style.background = '#000000';
        document.body.style.boxShadow  = `0 0 80px rgba(0,0,0,0.5) inset`;
        colorDisplay.style.background  = '#000000';
        colorDisplay.textContent       = 'OFF';
        colorPicker.value              = '#000000';
    }

    // هنا السطر اللي يربط overlay بالكارد
    const overlay = document.getElementById('page-overlay');
    if (overlay) {
        overlay.style.background = color || '#000000';
    }
}

