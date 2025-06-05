// app.js


let host = window.location.hostname;
let API_BASE_URL;

if (host.includes("10.220")) {
    API_BASE_URL = "http://10.220.1.123:8000";
} else if (host.includes("192.168")) {
    API_BASE_URL = "http://192.168.1.247:8000";
} else {
    API_BASE_URL = "http://localhost:8000"; // احتياط
}

// DOM Elements
const colorDisplay         = document.getElementById('colorDisplay');
const lightOneBtn          = document.getElementById('lightOneBtn');
const offBtn               = document.getElementById('offBtn');
const off2Btn              = document.getElementById('off2Btn');
const colorPicker          = document.getElementById('colorPicker');

// أزرار الانيميشن القديمة
const waveEffectBtn        = document.getElementById('WaveEffectBtn');
const rainbowFlowBtn       = document.getElementById('RainbowFlowBtn');
const blinkingPatternBtn   = document.getElementById('BlinkingPatternBtn');
const runningLightsBtn     = document.getElementById('RunningLightsBtn');
const breathingEffectBtn   = document.getElementById('BreathingEffectBtn');

// هنا: الزرّ المسمّى "Snakes Chasing" (كان اسمه سابقاً MeteorShowerBtn)
const snakesChasingBtn     = document.getElementById('MeteorShowerBtn');

// زرّ الانيميشن الجديد "Meteor Shower"
const meteorShowerNewBtn   = document.getElementById('MeteorShowerNewBtn');

const pulseSyncBtn         = document.getElementById('PulseSyncBtn');
const fireworksBurstBtn    = document.getElementById('FireworksBurstBtn');
const customBreathingBtn = document.getElementById('customBreathingBtn');

const cardElement          = document.querySelector('.card');

let isAnimationRunning = false;
let currentAnim = null;

// ─── NEW: زرّ “Fade Colors (Custom)” ───
const customFadeBtn       = document.getElementById('customFadeBtn');


// ─── NEW: زرّ “Blinking Pattern (Custom)” ───
const customBlinkBtn = document.getElementById('customBlinkBtn');



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

        // إذا كان هناك لون ثابت، نظّمه في الواجهة
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

        // ——— Snakes Chasing (كان Meteor Shower) ———
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

        // ——— New Meteor Shower (الأفعى الوحيدة) ———
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

        // ──── NEW: Custom Fade Colors ────
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

        // ──── NEW: حالة “custom_blink” ────
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
            customBreathingBtn.classList.add('active');
            customBreathingBtn.textContent = 'Breathing Effect - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect - Custom";
        } else {
            customBreathingBtn.classList.remove('active');
            customBreathingBtn.textContent = 'Breathing Effect - Custom';
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
        fireworksBurstBtn.textContent = 'Fireworks Burst';
        customFadeBtn.classList.remove('active');
        customFadeBtn.textContent = 'Fade Colors - Custom';
        customBreathingBtn.classList.remove('active');
        customBreathingBtn.textContent = 'Breathing Effect - Custom';
        cardElement.style.background = "";
    }
}

// دالة تغيير اللون الثابت
async function changeColor(color) {
    if (isAnimationRunning) {
        await stopAnimation();
    }
    updateUI(color);
    cardElement.style.background = "";
    await sendRequest("/color", { hex_color: color });
}

// دالة إيقاف الأنيميشن (POST /stop)
async function stopAnimation() {
    isAnimationRunning = false;
    currentAnim = null;
    // نزيل الحالة النشطة من كل الأزرار
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
    fireworksBurstBtn.textContent = 'Fireworks Burst';
    customFadeBtn.classList.remove('active');
    customFadeBtn.textContent = 'Fade Colors - Custom';
    customBreathingBtn.classList.remove('active');
    customBreathingBtn.textContent = 'Breathing Effect - Custom';
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

// Snakes Chasing (كان Meteor Shower)
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

// ——— الانيميشن الجديد “Meteor Shower” (الأفعى الوحيدة) ———
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

// ──── NEW: دالة “Fade Colors (Custom)” ────
// عند الضغط على الزرّ customFadeBtn، نفتح colorPicker أولاً.
// عند اختيار اللون (حدث input)، نبعت الطلب باللون المختار.
// إذا ضغطت ثانيةً أثناء custom_fade، نوقف الأنيميشن.
//
// مثلاً: 
// - الضغط الأوّل “Choose color…”, يفتح نافذة اختيار اللون.
// - عندما تختار لوناً (input event)، يبدأ الأنيميشن على الفور.
// - الضغط على الزرّة أثناء تشغيل custom_fade يوقفه.
//
// لاحظ أنّنا نعتمد على حدث "input" حتى يظهر اللون فوراً عند كل تغيير في colorPicker.
//
async function startCustomFadeAnimation() {
    // إذا كان custom_fade يعمل الآن، نوقفه
    if (isAnimationRunning && currentAnim === "custom_fade") {
        await stopAnimation();
        return;
    }

    // إذا كان أي أنيميشن آخر قيد التشغيل، نوقفه أولاً
    if (isAnimationRunning && currentAnim !== "custom_fade") {
        await stopAnimation();
    }

    // الآن نطلب من المستخدم اختيار اللون:
    customFadeBtn.textContent = "Choose color…";
    // نفتح نافذة color picker برمجياً:
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

// ─── NEW: دالة “Breathing Effect (Custom)” ───
async function startCustomBreathingAnimation() {
    if (isAnimationRunning && currentAnim === "custom_breathing") {
        await stopAnimation();
        return;
    }

    if (isAnimationRunning && currentAnim !== "custom_breathing") {
        await stopAnimation();
    }

    customBreathingBtn.textContent = "Choose color…";
    colorPicker.click();

    const onColorChosen = async (e) => {
        colorPicker.removeEventListener("input", onColorChosen);
        const chosenColor = e.target.value;
        
        isAnimationRunning = true;
        currentAnim = "custom_breathing";
        customBreathingBtn.classList.add('active');
        customBreathingBtn.textContent = 'Breathing Effect - Custom (Running)';
        cardElement.style.background = "#000000";
        colorDisplay.textContent = "Breathing Effect - Custom";

        await sendRequest("/animate", {
            animation_type: "custom_breathing",
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
lightOneBtn          .addEventListener("click", startFadeAnimation);
pulseSyncBtn         .addEventListener("click", startPulseSyncAnimation);
waveEffectBtn        .addEventListener("click", startWaveAnimation);
rainbowFlowBtn       .addEventListener("click", startRainbowAnimation);
blinkingPatternBtn   .addEventListener("click", startBlinkingPattern);
runningLightsBtn     .addEventListener("click", startRunningLights);
breathingEffectBtn   .addEventListener("click", startBreathingAnimation);
// الزر القديم أصبح بإسم startSnakesChasing
snakesChasingBtn     .addEventListener("click", startSnakesChasing);
// الزر الجديد “Meteor Shower”
meteorShowerNewBtn   .addEventListener("click", startSingleSnake);
fireworksBurstBtn    .addEventListener("click", startFireworksBurst);
offBtn               .addEventListener("click", stopAnimation);
off2Btn              .addEventListener("click", stopAnimation);

// ──── NEW: ربط زرّ “Fade Colors (Custom)” ────
customFadeBtn        .addEventListener("click", startCustomFadeAnimation);

customBlinkBtn.addEventListener("click", startCustomBlinkAnimation);

customBreathingBtn.addEventListener("click", startCustomBreathingAnimation);

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

        // … ثم نفس المنطق السابق في fetchAndApplyState()

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

        // ──── NEW: حالة “custom_fade” عبر SSE ────
        if (animation === "custom_fade") {
            isAnimationRunning = true;
            currentAnim = "custom_fade";
            customFadeBtn.classList.add('active');
            customFadeBtn.textContent = 'Fade Colors - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Fade Colors - Custom";
        } else {
            customFadeBtn.classList.remove('active');
            customFadeBtn.textContent = 'Fade Colors - Custom';
        }
        // ──── NEW: حالة “custom_breathing” عبر SSE ────
        if (animation === "custom_breathing") {
            isAnimationRunning = true;
            currentAnim = "custom_breathing";
            customBreathingBtn.classList.add('active');
            customBreathingBtn.textContent = 'Breathing Effect - Custom (Running)';
            cardElement.style.background = "#000000";
            colorDisplay.textContent = "Breathing Effect - Custom";
        } else {
            customBreathingBtn.classList.remove('active');
            customBreathingBtn.textContent = 'Breathing Effect - Custom';
        }



    } catch (err) {
        console.error("SSE onmessage parse error:", err);
    }
};
