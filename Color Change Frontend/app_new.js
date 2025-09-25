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
    if (isAnimationRunning && currentAnim !== "Random Colors") {
        await stopAnimation();
    }
    if (isAnimationRunning && currentAnim === "Random Colors") {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    currentAnim = "Random Colors";
    randomColorsBtn.classList.add('active');
    randomColorsBtn.textContent = 'Random Colors (Running)';
    cardElement.style.background = "#000000";
    colorDisplay.textContent = "Random Colors";
    await sendRequest("/animate", { animation_type: "Random Colors" });
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

        // ثم نفس المنطق السابق في fetchAndApplyState()
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
    for (let i = 0; i < 20; i++) {
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
  return '#00ff00';
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

// بيانات التلميحات لكل زر
const tooltipData = {
    // أزرار الألوان
    'redBtn'                    : { title: 'Red Color' },
    'blueBtn'                   : { title: 'Blue Color' },
    'greenBtn'                  : { title: 'Green Color' },
    'orangeBtn'                 : { title: 'Orange Color' },
    'yellowBtn'                 : { title: 'Yellow Color' },
    'purpleBtn'                 : { title: 'Purple Color' },
    'whiteBtn'                  : { title: 'White Color' },
    'offBtn'                    : { title: 'Turn Off' },
    'off2Btn'                   : { title: 'Turn Off'},
    
    // أزرار الأنيميشن الأساسية

    'lightOneBtn'               : { title: 'Fade Colors' },
    'WaveEffectBtn'             : { title: 'Wave Effect' },
    'RainbowFlowBtn'            : { title: 'Rainbow Flow' },
    'BlinkingPatternBtn'        : { title: 'Blinking Pattern' },
    'RunningLightsBtn'          : { title: 'Running Lights' },
    'BreathingEffectBtn'        : { title: 'Breathing Effect' },
    'MeteorShowerBtn'           : { title: 'Snakes Chasing' },
    'RandomColorsBtn'           : { title: 'Random Colors' },
    'PulseSyncBtn'              : { title: 'Pulse Sync' },
    'FireworksBurstBtn'         : { title: 'Fireworks Burst' },
    'MeteorShowerNewBtn'        : { title: 'Meteor Shower' },
    

    // أزرار الأنيميشن المخصصة  
    'customFadeBtn'             : { title: 'Custom Fade'},
    'customBlinkBtn'            : { title: 'Custom Blink'},
    'customBreathingBtn'        : { title: 'Custom Breathing' },
    'customMeteorShowerBtn'     : { title: 'Custom Meteor Shower' },
    'customPulseSyncBtn'        : { title: 'Custom Pulse Sync' },
    'customGlitchFlashBtn'      : { title: 'Custom Glitch Flash' },
    'customHeartBeatBtn'        : { title: 'Custom Heart Beat' },
    'customTunnelEffectBtn'     : { title: 'Custom Tunnel Effect' },
    'customLaserShotBtn'        : { title: 'Custom Laser Shot' },
    'customSparklingStarsBtn'   : { title: 'Custom Sparkling Stars' },
    'customStrobeFlashBtn'      : { title: 'Custom Strobe Flash' },
    'customKnightRiderBtn'      : { title: 'Custom Knight Rider' },
    'customBounceBackBtn'       : { title: 'Custom Bounce Back' },
    'customRippleTouchBtn'      : { title: 'Custom Ripple Touch' },
    'customFireFlickerBtn'      : { title: 'Custom Fire Flicker' },
    'customColorWipeBtn'        : { title: 'Custom Color Wipe' },
    'customStaticGlowBtn'       : { title: 'Custom Static Glow' },
    'customColorEchoBtn'        : { title: 'Custom Color Echo' },
    'customTimeWarpBtn'         : { title: 'Custom Time Warp' },
    'customQuantumFlickerBtn'   : { title: 'Custom Quantum Flicker' },
    'customRunningLightsBtn'    : { title: 'Custom Running Lights' },
    'customFireworksBurstBtn'   : { title: 'Custom Fireworks Burst' }
};

const fadeDescriptions = [
    'Colors appear, then vanish—tweak the brightness, set your vibe.',
    'Random shades flash in and out, never settling. Adjust the glow to match your mood.',
    'It feels like controlled chaos—one moment the light is here, the next it’s gone, returning differently each time. You can dial the brightness to your liking.',
    'A hypnotic rhythm of colors fading in and out, syncing only with their own unpredictable flow. Control the intensity and let it breathe in your space.',
    'The LEDs move gently, swapping shades, disappearing, then returning like they were never gone. Adjust the brightness—make it subtle or let it shine boldly.',
    'A cycle of presence and absence—colors vanish before you even get used to them, only to reappear in new shades. You control the glow, the mood, the flow.',
    'Think of it as meditative light—colors show up, fade, and renew endlessly. Brightness is yours to command.',
    
];

const waveDescriptions = [
    'Waves of light moving through the strip—control the glow, set your pace.',
    'Colors travel in rhythm, sweeping LED by LED. Adjust brightness to match the flow.',
    'Imagine a pulse of color stretching and shifting forward, one LED at a time. You decide how strong it shines.',
    'CoA continuous wave of motion—colors ripple through the strip, alive and flowing. Dial the brightness to suit your vibe.',
    'It’s more than movement; it’s choreography in light. Each LED joins the wave at the perfect moment. Control the glow to make it yours.',
    'Every shift feels like momentum—a tide of color rolling endlessly. Adjust brightness, let it be subtle or striking.',
    'Think of it as energy made visible—waves of light flowing in sequence. Brightness is in your hands.'
];

const RainbomDescriptions = [
    'A spectrum that never stops—adjust the brightness, set your vibe.',
    'Colors chase each other endlessly. You decide how bright or soft they shine.',
    'Every shade flows into the next, never pausing. Dial the brightness to match your mood.',
    'It’s less about the rainbow, more about the journey—colors fading, blending, shifting endlessly. Control the glow and make it yours.',
    'Not just colors—it’s a cycle that refuses to settle, each shade slipping into the next before you can even name it. You can tweak the brightness to set the room’s energy exactly how you like.',
    'Think of it as a story of motion and color—light traveling, shifting, never repeating itself. Push the brightness up or keep it subtle; it’s your scene to control.',
    'A continuous flow of color, alive and unpredictable. Adjust the glow to make the effect your own.'
]

const BlinkingDescriptions = [
    'Fast flashes, random, gone in an instant.',
    'LEDs blink sharp and sudden, each color a quick spark that disappears before you catch it—brightness stays in your hands.',
    'No rhythm, no pattern—just a restless storm of colors flashing in and out, like the strip is alive with hidden energy. One moment bright, the next completely gone, leaving you waiting for the next unpredictable strike.',
    'Sudden sparks of light—blink and you’ll miss it.',
    'A strobe-like effect, but wilder—random flashes that feel like coded signals only your eyes can decode.',
    'This isn’t gentle or calm—it’s electricity in motion. The LEDs erupt in quick bursts, each blink random and impatient, as if the strip is trying to get your attention with every flash. You decide how blinding or subtle it gets with brightness control.',
    'Flashes of color hit at random, then vanish as quickly as they came, keeping the whole effect tense and alive.'
]

const RunningLightsDescriptions = [
  'Colors racing down the strip—fast, random, alive.',
  'Tiny sparks keep running, one after another, colors changing as they fall—like light chasing itself. Brightness? You’re in charge.',
  'It feels like streaks of energy are being released from hidden points, racing endlessly toward the bottom. Each spark dies only to be reborn in a new shade, creating an endless cycle of movement. With brightness control, you choose if it’s a quiet run or a blinding chase.',
  'Flashes on the run—never stopping, never the same color twice.',
  'Random bursts of light keep dropping in sequence, like rain made of neon sparks, looping forever.',
  'The strip becomes a track for colors—each light sprinting downward, resetting, and starting over. It’s chaotic but rhythmic, infinite but always new. Dial the brightness, and the race feels either calm or explosive.',
  'Running sparks—falling, resetting, glowing again. It never really stops, just keeps moving in its own strange rhythm.'
]

const BreathingEffectDescriptions = [
  'Lights that inhale and exhale—slow, soft, alive.',
  'Colors fade in and fade out at their own pace, like the strip itself is breathing. Adjust the brightness, and you control how gentle or intense each breath feels.',
  'It’s not a blink, not a flash—it’s a rhythm of presence and absence. Each shade appears slowly, settles in the room, then dissolves as if the LEDs are sighing. The cycle never repeats the same way twice, and with brightness in your hands, you decide if it feels like calm meditation or something deeper.',
  'Random tones emerge quietly, glow for a moment, then slip away like they were never there.',
  'Think of it as heartbeat energy—soft pulses of color flowing in and out, too slow to chase, too real to ignore.',
  'The effect feels alive, like the LEDs are syncing with a hidden rhythm you can’t quite catch. Lower the brightness and it whispers; raise it, and it feels like the room itself is breathing fire.',
  'Colors dissolve into nothing, only to return smoother and slower, like a light practicing patience.'
]

const SnakesChasingDescriptions = [
  'Snakes of light racing after each other, never stopping.',
  'Each LED forms a serpent—random colors sliding forward, one chasing the next. Adjust the brightness to decide if they slither smooth or strike sharp.',
  'It’s a hunt made of color—multiple snakes twisting through the strip, every body a random shade, every chase endless. They don’t move in chaos but in pursuit, like coded signals of light chasing their own reflections. You choose if the scene glows faint like whispers or burns hot like fire with brightness control.',
  'Fast trails of color that look alive, like light has found its own prey.',
  'Think of it as neon serpents, each with its own shade, weaving across the strip in an endless pursuit.',
  'The effect isn’t static—it’s alive, serpents of color looping through the LEDs, chasing endlessly but never catching. Lower the brightness for subtle motion, raise it and the chase becomes electric.',
  'Lines of light slither forward, random in color but unified in motion, like snakes racing into the dark.'
]

const PulseSyncDescriptions = [
  'A serpent runs right to left, then another returns—endless back-and-forth.',
  'Light travels across the strip like a pulse: one snake slides to the end, then a new one rises from the other side in a fresh random shade. Brightness control makes it either smooth or intense.',
  'It’s symmetry in motion—snakes of color taking turns crossing the strip, first one direction, then the other. Each carries a random hue, disappearing as soon as it arrives. The pattern loops like a heartbeat, but you decide if it glows soft like breath or burns sharp like lightning with brightness control.',
  'One path forward, another back—an infinite chase between colors.',
  'Every run feels like a reply: a serpent crosses, then another answers from the opposite side in its own tone.',
  'The strip becomes a corridor of movement—light snakes sliding right, then left, endlessly. The flow is balanced, yet unpredictable in color. Lower brightness for subtle dialogue, raise it to watch the strip scream with energy.',
  'A constant rhythm of departure and return—color snakes moving in opposite directions, never the same shade twice.'
]

const FireworksBurstDescriptions = [
  'A rocket of light, gone in a flash, exploding where you least expect.',
  'Colors launch fast, racing up the strip before bursting into random sparks. Brightness decides if it’s a quiet pop or a blinding explosion.',
  'It feels like celebration coded into LEDs—single rockets darting forward, each in its own shade, before erupting in bursts of light at random spots. Every explosion is different, unpredictable, alive. With brightness under your hand, it shifts from subtle shimmer to firework chaos.',
  'One second it’s a streak, the next it’s gone—only sparks left behind.',
  'Think of it as neon fireworks—fast, random, always surprising.',
  'The strip becomes a sky for digital rockets—colors shooting, exploding, fading away. Dial down the brightness for gentle sparks, or push it up and flood the strip with wild energy.',
  'Unpredictable bursts of color, each one short-lived but impossible to ignore.'
]

const MeteorShowerDescriptions = [
  'Sudden streaks of light, blazing across the strip—each meteor unique in color, length, and speed.',
  'Random meteors shoot fast, unpredictable, each one a different flash. Brightness controls whether it’s a soft glow or a blinding streak.',
  'The LEDs become a night sky—meteors appear when they feel like it, some short, some long, all racing across with their own random colors and speeds. You never know which one will hit next.',
  'Fast, fleeting, random flashes—blink and a meteor is gone.',
  'Like a digital night sky in motion—chaotic, vibrant, and alive.',
  'Every meteor is its own story: color, speed, length all randomized. Tweak the brightness to make them whisper past or scream across the strip.',
  'Unpredictable streaks of light, zipping across at random intervals—keeping the whole effect tense, alive, and hypnotic.'
]


const FadeColorsCustomDescriptions = [
  'Pick your vibe, let it fade—smooth transitions, one chosen color drifting across the strip.',
  'Your color, your rhythm. LEDs breathe slowly in and out, like the strip itself is alive, whispering your chosen shade.',
  'Custom color fades in a hypnotic loop—slow, deliberate, mesmerizing. Brightness in your hands, every blink is controlled by you.',
  'One color takes over, flowing gently across the strip, fading in and out as if it has a mind of its own.',
  'It’s not random, it’s personal—select your color and watch it pulse, fade, and glow, perfectly synced with your mood.',
  'A single hue, endless possibilities. Smooth, slow fades that let you control the intensity and make the strip feel alive.',
  'Fade in, fade out, repeat. Your color, your rules. The LEDs obey, moving in rhythm with your choice and brightness.'
]

const BlinkingCustomDescriptions = [
  'Your color, your chaos—LEDs blink sharp and sudden, controlled by your choice.',
  'Pick a shade, watch it pop. Random flashes, but now you decide the hue and intensity.',
  'Blink in your style—your color dances across the strip in unpredictable bursts, brightness in your hands.',
  'LEDs obey your color command, flashing in short bursts, long pulses, or anything in between.',
  'This isn’t random anymore—it’s your custom blink, each spark chosen by you, every flash a signature.',
  'Short, long, medium—your color sets the pace. Quick bursts or slow blinks, the strip listens.',
  'Blinking isn’t just a pattern—it’s your vibe. You pick the hue, the LEDs do the magic, fading in and out as you like.'
]

const BreathingCustomDescriptions = [
  'Your color, your chill—LEDs breathe slowly, fading in and out like they’re alive, all in the hue you picked.',
  'Pick a shade, watch it inhale and exhale. Slow, hypnotic pulses that you control.',
  'Breathing in your vibe—LEDs swell and fade, rhythm set by your chosen color and brightness.',
  'Soft glow, long fade, short pulse—your color dances through the strip, calm but alive.',
  'The strip isn’t just breathing, it’s syncing to your color choice. Each fade a signature of your style.',
  'Choose the color, adjust the brightness, let the LEDs take their slow, hypnotic ride across the strip.',
  'Breathing effect but make it yours—your hue, your intensity, your mood, all wrapped in a smooth pulse.'
]

const MeteorShowerCustomDescriptions = [
  'Random meteors, now in your color—zap across the strip at insane speeds, each streak unique, brightness under your control.',
  'You pick the hue, the meteor decides the chaos—fast, bright, and fleeting. Colors chase, vanish, repeat.',
  'A cosmic storm, but you hold the palette. Meteors shoot in random timing, length, and speed, leaving a trail that’s all yours.',
  'Speedy streaks explode in your chosen color, unpredictable yet under your command.',
  'It’s your color, your chaos—meteors appear when they want, fly fast, fade fast, and keep the strip alive.',
  'Blink, and you’ll miss it. Each meteor bursts in the color you picked, racing across the LEDs in random flashes.'
]

const PulseSyncCustomDescriptions = [
  'Your color, your pulse—fades in and out unpredictably, each blink arriving like it owns its own timeline.',
  'Fade-in, fade-out, random beats—but all in your chosen hue. The strip breathes your color in chaotic harmony.',
  'Each pulse dances alone, yet part of the flow, fading up and down at random times. You control the shade, not the chaos.',
  'Colors rise and vanish at their own pace, synced in randomness—your chosen hue runs the show.',
  'It’s like the LEDs are breathing your color, each fade coming when it wants, unpredictable but hypnotic.',
  'Your hue takes center stage. Pulses fade-in and fade-out at random intervals, creating a living rhythm across the strip.'
]

const CustomGlitchFlashDescriptions = [
  'Your color, but unpredictable—LEDs glitch on and off like they’ve got a mind of their own.',
  'No pause, no repeat, just chaotic flashes of your chosen hue, like the strip is alive and rebellious.',
  'Random pops of your color—blink and it’s gone, only to reappear somewhere else, always moving, never static.',
  'Feels like digital static in your hue, LEDs jumping on and off in a glitchy rhythm you control.',
  'Endless flashes, no loop to catch—your color explodes in bursts, then vanishes before you even blink.',
  'Like the strip is trolling your eyes—your chosen shade flickers unpredictably, chaos in control.'
]


const CustomHeartBeatDescriptions = [
  'Two quick pulses of your color, then a moment to breathe—repeat endlessly.',
  'Your hue beats like a hidden heart, quick and fleeting, pausing before the next thump.',
  'Heart pulses in neon rhythm, bright then dim, a living LED heartbeat under your control.',
  'Blink, blink—then pause. A heartbeat you can see and tweak.',
  'Rapid twin pulses, color you pick, then silence; hypnotic, alive, yours.',
  'Each beat like a secret signal, fading fast, waiting for the next.',
  'Your color throbs twice, then stillness—LEDs keeping time with invisible rhythm.'
]

const CustomTunnelEffectDescriptions = [
  'Snakes from edges slither to the center, fading in your chosen color, then explode midstrip.',
  'Your color rushes inward, trails fading gracefully, bursts of light like a tunnel vision.',
  'LED snakes converge, then vanish in an epic center flash, pause, repeat unpredictably.',
  'Colors collide at the center, fading tails chasing, your control over chaos.',
  'Center-bound snakes, slow build, dramatic fade-out—your color runs the show.',
  'Inward-moving trails, fading as they go, meeting at midline and bursting into brilliance.',
  'From edges to center, your shade dances, fades, then vanishes—hypnotic, alive.'
]

const CustomLaserShotDescriptions = [
  'Bright laser streaks forward and backward, fading trails like neon whispers of your color.',
  'Your color zips with velocity, trailing shadows, a laser dance you control.',
  'Flash, fade, reverse—laser pulses slice the strip in your hue.',
  'Neon streaks, fading trails, forward and back, hypnotic in rhythm and color.',
  'Laser trail in your chosen shade, fast, bright, relentless.',
  'Moving light, fading behind, bouncing back—your color, your tempo.',
  'Forward surge, backward echo, a sleek laser of your making.'
]

const CustomSparklingStarsDescriptions = [
  'Stars in your color twinkle randomly, no pattern, endless sparkle chaos.',
  'Random flickers of your hue, like cosmic whispers across the LED strip.',
  'Twinkle, fade, pause, repeat—LED constellations you command.',
  'Your color bursts as tiny stars, scattered unpredictably, hypnotic shimmer.',
  'LEDs sparkle like a galaxy you can color, fade, and orchestrate.',
  'Random shimmer, fading in and out, your hue dancing like starlight.',
  'Controlled chaos of twinkling LEDs, each sparkle a secret in your chosen color.'
]

const CustomStrobeFlashDescriptions = [
  'All LEDs blink fast in your color—pulse, vanish, repeat relentlessly.',
  'Rapid strobe, your hue flashing, hypnotic bursts with no mercy.',
  'Flash and disappear, a color beat that controls your strip.',
  'Light pulses in your shade, sharp and edgy, a visual heartbeat.',
  'Relentless blink-fest, your color, your rhythm, shocking and crisp.',
  'Rapid on/off bursts, LEDs obeying your color command.',
  'Strobe chaos, bright, fleeting, alive with your chosen hue.'
]

const CustomKnightRiderDescriptions = [
  'Pulses dance inwards and outwards, your color bouncing across the strip.',
  'LED pairs glide like a sci-fi chase, fading trails in your hue.',
  'Inward, outward, rhythmical dance, hypnotic color movement.',
  'Center-to-edge pulses, your chosen shade painting motion.',
  'LED beats moving in symmetry, alive with your color choice.',
  'Dancing pulses, inward then outward, hypnotic loop of light.',
  'Your color chasing itself, LED pairs racing the strip in endless flow.'
]

const CustomBounceBackDescriptions = [
  'Segments appear, move, fade, randomly spaced—your color in motion.',
  'LED blocks parade endlessly, gaps and moves, a chaotic color march.',
  'Bounce, fade, repeat—your chosen hue runs wild across the strip.',
  'Segments sprint forward, fade behind, unpredictable but mesmerizing.',
  'LED fragments in your shade, spacing random, alive, breathing color.',
  'Motion, fade, restart—segments showing your color in kinetic art.',
  'Your hue jumps, flows, fades, an endless parade of light chaos.'
]

const RedDescriptions = [
    'Red… because drama is mandatory.',
    'Warning: not for beginners.',
    'Red vibes only—stand out or go home.',
    'Red… the color that says ‘watch me.’',
    'When you’re mad but make it visual.',
    'Red: because black is basic and blue is boring.',
    'Red… the official color of overthinkers.'
]


const CustomFireworksBurstDescriptions = [
  'Launch your color rocket—blasts randomly across the strip, colors explode in chaos.',
  'Your chosen hue shoots skyward, then bursts in neon chaos—each explosion unique.',
  'Firework streaks in your shade, flying fast, detonating bright and random.',
  'Pick a color, ignite, watch LEDs explode in unpredictable brilliance.',
  'Rocket launch! Your color arcs, explodes, fades—every burst alive.',
  'Color rockets zoom, explode, vanish—controlled chaos at your fingertips.',
  'Random explosions of your hue, dazzling, fast, ephemeral—a visual symphony.'
]


const BlueDescriptions = [
    'Blue… because apparently you have bad taste.',
    'I’m cooler than your life choices.',
    'Blue vibes… like your mood, I guess.',
    'I chill… unlike your chaotic brain.',
    'Try choosing me, maybe you’ll finally get it right.',
    'I’m literally carrying this strip while you scroll.',
    'Blue, smarter than you, obviously.',
    'Go ahead… stare. I see your poor taste'

]

const GreenDescriptions = [
    'Green… because you’re basic like that.',
    'Green vibes… because you can’t decide.',
    'I’m the color of envy, just like your life choices.',
    'Green… because you’re too indecisive for red or blue.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'Green… because you’re trying to be different but failing.',
    'I’m the color of nature, which is ironic for your tech obsession.',
    'I’m the grass you’ll never step on… careful.',
    'Yeah, I’m green… look at me, maybe you’ll learn patience.',
    'I’m nature’s flex… and you’re just staring.',
    'Try picking me… but don’t mess it up like usual.',
    'I’m fresh, alive… unlike your choices. Who am I?',
    'Leaf it alone? Nah… I dare you to try.',
    'Go touch some grass…',
    'Yeah, I’m green… unlike your decision-making.',
    'Fresh, alive… just not like your brain. who am I?'

]

const YellowDescriptions = [
    'Pick me… if your brain even remembers how.',
    'I shine brighter than your life choices.',
    'Yeah, I’m golden… unlike your decision-making.',
    'Go on… pick me, maybe I’ll save you from boring.',
    'I’m the only thing lighting up while your ideas stay dim.',
    'Try me, you might learn something for once.',
    'I glow… because clearly, you need guidance.',
    'Yes, me. Don’t overthink it… or do, whatever.',
    'Choose me, or live with regret… your call, human.'
]


const OrangeDescriptions = [
    'I shine bright… unlike your ability to choose wisely.',
    'Orange doesn’t panic… you, on the other hand, can’t even pick me right.',
    'Bold, unapologetic… unlike your last 10 failed decisions.',
    'I’m alive, vivid… you’re just buffering.',
    'I burn with purpose… you burn with regret.',
    'Orange rules the scene… you just follow the wrong crowd.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.'
]

const PurpleDescriptions = [
    'I’m mysterious, powerful… you’re just confused.',
    'Purple owns the vibe… you barely own your choices.',
    'Deep, rich, timeless… unlike your last 3 decisions.',
    'I rule quietly… you trip over your own thoughts.',
    'Elegant, rare… your logic? Common and lost.',
    'I’m the secret you’ll never figure out… keep trying, champ'
]

const WhiteDescriptions = [
    'I’m clear, simple… you’re still confused.',
    'White shines… you just stumble in the dark.',
    'Pure, obvious… your logic? Not so much.',
    'I’m everywhere… you barely exist.',
    'Bright, calm… you’re still lost.',
    'I’m basic, essential… you’re just extra.',
    'I reflect everything… but you reflect nothing.'
]


const OffDescriptions = [
    'Off? Yeah, that’s just black. You want darkness, you got it… obviously, you can’t handle colors anyway.',
    'Black = off. Simple. Not like you, who can’t keep it simple.',
    'This is the end… literally. Off = black. W dev.',
    'You chose nothing. Classic. ',
    'Off is black. Black is nothing. Nothing… like your choices. W smart dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W smart dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W dev.',
]

const RandomColorsDescriptions = [
    'Nothing yet'
]

// تهيئة الـ Tooltip
function initTooltips() {
    const tooltip = document.getElementById('animationTooltip');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipDescription = document.getElementById('tooltipDescription');

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

    function getRandomDescriptionFor(buttonId) {
        if (buttonId === 'lightOneBtn') {
            if (Array.isArray(fadeDescriptions) && fadeDescriptions.length) {
                return fadeDescriptions[Math.floor(Math.random() * fadeDescriptions.length)];
            }
        }
        if (buttonId === 'WaveEffectBtn') {
            if (Array.isArray(waveDescriptions) && waveDescriptions.length) {
                return waveDescriptions[Math.floor(Math.random() * waveDescriptions.length)];
            }
        }
        if (buttonId === 'RainbowFlowBtn') {
            if (Array.isArray(RainbomDescriptions) && RainbomDescriptions.length) {
                return RainbomDescriptions[Math.floor(Math.random() * RainbomDescriptions.length)];
            }
        }
        if (buttonId === 'BlinkingPatternBtn') {
            if (Array.isArray(BlinkingDescriptions) && BlinkingDescriptions.length) {
                return BlinkingDescriptions[Math.floor(Math.random() * BlinkingDescriptions.length)];
            }
        }

        if (buttonId === 'RunningLightsBtn') {
            if (Array.isArray(RunningLightsDescriptions) && RunningLightsDescriptions.length) {
                return RunningLightsDescriptions[Math.floor(Math.random() * RunningLightsDescriptions.length)];
            }
        }
        if (buttonId === 'BreathingEffectBtn') {
            if (Array.isArray(BreathingEffectDescriptions) && BreathingEffectDescriptions.length) {
                return BreathingEffectDescriptions[Math.floor(Math.random() * BreathingEffectDescriptions.length)];
            }
        }

        if (buttonId === 'MeteorShowerBtn') {
            if (Array.isArray(SnakesChasingDescriptions) && SnakesChasingDescriptions.length) {
                return SnakesChasingDescriptions[Math.floor(Math.random() * SnakesChasingDescriptions.length)];
            }
        }

        if (buttonId === 'PulseSyncBtn') {
            if (Array.isArray(PulseSyncDescriptions) && PulseSyncDescriptions.length) {
                return PulseSyncDescriptions[Math.floor(Math.random() * PulseSyncDescriptions.length)];
            }
        }

        if (buttonId === 'FireworksBurstBtn') {
            if (Array.isArray(FireworksBurstDescriptions) && FireworksBurstDescriptions.length) {
                return FireworksBurstDescriptions[Math.floor(Math.random() * FireworksBurstDescriptions.length)];
            }
        }

        if (buttonId === 'MeteorShowerNewBtn') {
            if (Array.isArray(MeteorShowerDescriptions) && MeteorShowerDescriptions.length) {
                return MeteorShowerDescriptions[Math.floor(Math.random() * MeteorShowerDescriptions.length)];
            }
        }

        if (buttonId === 'customFadeBtn') {
            if (Array.isArray(FadeColorsCustomDescriptions) && FadeColorsCustomDescriptions.length) {
                return FadeColorsCustomDescriptions[Math.floor(Math.random() * FadeColorsCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customBlinkBtn') {
            if (Array.isArray(BlinkingCustomDescriptions) && BlinkingCustomDescriptions.length) {
                return BlinkingCustomDescriptions[Math.floor(Math.random() * BlinkingCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customBreathingBtn') {
            if (Array.isArray(BreathingCustomDescriptions) && BreathingCustomDescriptions.length) {
                return BreathingCustomDescriptions[Math.floor(Math.random() * BreathingCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customMeteorShowerBtn') {
            if (Array.isArray(MeteorShowerCustomDescriptions) && MeteorShowerCustomDescriptions.length) {
                return MeteorShowerCustomDescriptions[Math.floor(Math.random() * MeteorShowerCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customPulseSyncBtn') {
            if (Array.isArray(PulseSyncCustomDescriptions) && PulseSyncCustomDescriptions.length) {
                return PulseSyncCustomDescriptions[Math.floor(Math.random() * PulseSyncCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customGlitchFlashBtn') {
            if (Array.isArray(CustomGlitchFlashDescriptions) && CustomGlitchFlashDescriptions.length) {
                return CustomGlitchFlashDescriptions[Math.floor(Math.random() * CustomGlitchFlashDescriptions.length)];
            }
        }

        if (buttonId === 'customHeartBeatBtn') {
            if (Array.isArray(CustomHeartBeatDescriptions) && CustomHeartBeatDescriptions.length) {
                return CustomHeartBeatDescriptions[Math.floor(Math.random() * CustomHeartBeatDescriptions.length)];
            }
        }

        if (buttonId === 'customTunnelEffectBtn') {
            if (Array.isArray(CustomTunnelEffectDescriptions) && CustomTunnelEffectDescriptions.length) {
                return CustomTunnelEffectDescriptions[Math.floor(Math.random() * CustomTunnelEffectDescriptions.length)];
            }
        }

        if (buttonId === 'customLaserShotBtn') {
            if (Array.isArray(CustomLaserShotDescriptions) && CustomLaserShotDescriptions.length) {
                return CustomLaserShotDescriptions[Math.floor(Math.random() * CustomLaserShotDescriptions.length)];
            }
        }

        if (buttonId === 'customSparklingStarsBtn') {
            if (Array.isArray(CustomSparklingStarsDescriptions) && CustomSparklingStarsDescriptions.length) {
                return CustomSparklingStarsDescriptions[Math.floor(Math.random() * CustomSparklingStarsDescriptions.length)];
            }
        }

        if (buttonId === 'customStrobeFlashBtn') {
            if (Array.isArray(CustomStrobeFlashDescriptions) && CustomStrobeFlashDescriptions.length) {
                return CustomStrobeFlashDescriptions[Math.floor(Math.random() * CustomStrobeFlashDescriptions.length)];
            }   
        }

        if (buttonId === 'customKnightRiderBtn') {
            if (Array.isArray(CustomKnightRiderDescriptions) && CustomKnightRiderDescriptions.length) {
                return CustomKnightRiderDescriptions[Math.floor(Math.random() * CustomKnightRiderDescriptions.length)];
            }
        }

        if (buttonId === 'customBounceBackBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customRippleTouchBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customFireFlickerBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }


        if (buttonId === 'customColorWipeBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customStaticGlowBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customColorEchoBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customTimeWarpBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customQuantumFlickerBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customRunningLightsBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customFireworksBurstBtn') {
            if (Array.isArray(CustomFireworksBurstDescriptions) && CustomFireworksBurstDescriptions.length) {
                return CustomFireworksBurstDescriptions[Math.floor(Math.random() * CustomFireworksBurstDescriptions.length)];
            }
        }

        if (buttonId === 'redBtn') {
            if (Array.isArray(RedDescriptions) && RedDescriptions.length) {
                return RedDescriptions[Math.floor(Math.random() * RedDescriptions.length)];
            }
        }

        if (buttonId === 'blueBtn') {
            if (Array.isArray(BlueDescriptions) && BlueDescriptions.length) {
                return BlueDescriptions[Math.floor(Math.random() * BlueDescriptions.length)];
            }
        }

        if (buttonId === 'greenBtn') {
            if (Array.isArray(GreenDescriptions) && GreenDescriptions.length) {
                return GreenDescriptions[Math.floor(Math.random() * GreenDescriptions.length)];
            }
        }

        if (buttonId == 'yellowBtn') {
            if (Array.isArray(YellowDescriptions) && YellowDescriptions.length) {
                return YellowDescriptions[Math.floor(Math.random() * YellowDescriptions.length)];
            }
        }

        if (buttonId == 'orangeBtn') {
            if (Array.isArray(OrangeDescriptions) && OrangeDescriptions.length) {
                return OrangeDescriptions[Math.floor(Math.random() * OrangeDescriptions.length)];
            }
        }

        if (buttonId == 'purpleBtn') {
            if (Array.isArray(PurpleDescriptions) && PurpleDescriptions.length) {
                return PurpleDescriptions[Math.floor(Math.random() * PurpleDescriptions.length)];
            }
        }

        if (buttonId == 'whiteBtn') {
            if (Array.isArray(WhiteDescriptions) && WhiteDescriptions.length) {
                return WhiteDescriptions[Math.floor(Math.random() * WhiteDescriptions.length)]
            }
        }

        if (buttonId == 'offBtn') {
            if (Array.isArray(OffDescriptions) && OffDescriptions.length) {
                return OffDescriptions[Math.floor(Math.random() * OffDescriptions.length)]
            }
        }

        if (buttonId == 'off2Btn') {
            if (Array.isArray(OffDescriptions) && OffDescriptions.length) {
                return OffDescriptions[Math.floor(Math.random() * OffDescriptions.length)]
            }
        }
        
        if (buttonId == 'RandomColorsBtn') {
            if (Array.isArray(RandomColorsDescriptions) && RandomColorsDescriptions.length) {
                return RandomColorsDescriptions[Math.floor(Math.random() * RandomColorsDescriptions.length)]
            }
        }

        return (tooltipData[buttonId] && tooltipData[buttonId].description) || '';
    }

    // إضافة حدث لجميع الأزرار
    document.querySelectorAll('button').forEach(button => {
        const buttonId = button.id;

        if (tooltipData[buttonId]) {
            // mouseenter
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();

                tooltipTitle.textContent = tooltipData[buttonId].title || '';

                tooltipDescription.textContent = getRandomDescriptionFor(buttonId);

                // توليد ألوان عشوائية جديدة
                const [color1, color2, color3] = generateRandomColors();

                tooltip.style.setProperty('--random-color-1', color1);
                tooltip.style.setProperty('--random-color-2', color2);
                tooltip.style.setProperty('--random-color-3', color3);

                tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';

                tooltip.classList.add('show');

                const buttonColor = window.getComputedStyle(button).backgroundColor;
                if (buttonColor && buttonColor !== 'rgba(0, 0, 0, 0)') {
                    tooltip.style.setProperty('--ui-color', buttonColor);
                }
            });

            // mouseleave
            button.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }
    });
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initTooltips);




// -------- About modal logic --------
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const aboutClose = document.getElementById('aboutClose');

function openAbout() {
  if (!aboutModal) return;
  aboutModal.classList.add('show');
  aboutModal.setAttribute('aria-hidden', 'false');
  
  // منع التمرير في الخلفية
  document.body.classList.add('modal-open');
  
  // focus للوصولية
  aboutClose.focus();
}

function closeAbout() {
  if (!aboutModal) return;
  aboutModal.classList.remove('show');
  aboutModal.setAttribute('aria-hidden', 'true');
  
  // إعادة التمرير في الخلفية
  document.body.classList.remove('modal-open');
  
  aboutBtn.focus();
}

// open
if (aboutBtn) aboutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openAbout();
});

// close by close button
if (aboutClose) aboutClose.addEventListener('click', (e) => {
  e.preventDefault();
  closeAbout();
});

// close when clicking on backdrop (outside modal content)
aboutModal.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    closeAbout();
  }
});

// close on ESC
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Escape' || e.key === 'Esc') && aboutModal && aboutModal.classList.contains('show')) {
    closeAbout();
  }
});
