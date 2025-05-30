// at school
// const API_BASE_URL = "http://10.220.1.123:// // // // app.js

// at home
const API_BASE_URL = "http://192.168.1.247:8000";

// DOM Elements
const colorDisplay    = document.getElementById('colorDisplay');
const lightOneBtn     = document.getElementById('lightOneBtn');
const offBtn          = document.getElementById('offBtn');
const off2Btn         = document.getElementById('off2Btn');
const colorPicker     = document.getElementById('colorPicker');

let isAnimationRunning = false;

async function sendRequest(endpoint, data) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (e) {
        console.error("API Error:", e);
        return { status: "error", message: e.message };
    }
}

async function changeColor(color) {
    if (isAnimationRunning) {
        await stopAnimation();
    }
    updateUI(color);
    await sendRequest("/color", { hex_color: color });
}

async function stopAnimation() {
    await sendRequest("/stop");
    isAnimationRunning = false;
    lightOneBtn.classList.remove('active');
    lightOneBtn.textContent = 'Fade Colors';
    updateUI('#000000');
}

async function startFadeAnimation() {
    if (isAnimationRunning) {
        await stopAnimation();
        return;
    }
    isAnimationRunning = true;
    lightOneBtn.classList.add('active');
    lightOneBtn.textContent = 'Fade Colors (Running)';
    await sendRequest("/animate", { animation_type: "fade_colors" });
}

function resetUI() {
    // not used anymore
}

// Update page visuals
function updateUI(color) {
    document.body.style.background     = color;
    document.body.style.boxShadow      = `0 0 80px ${color}80 inset`;
    colorDisplay.style.background      = color;
    colorDisplay.textContent           = color.toUpperCase();
    colorPicker.value                  = color;
}

// Event Listeners
lightOneBtn.addEventListener("click", startFadeAnimation);
offBtn       .addEventListener("click", stopAnimation);
off2Btn      .addEventListener("click", stopAnimation);

// Color picker hookup
colorPicker.addEventListener("input", e => changeColor(e.target.value));

// Initialize UI on load
document.addEventListener("DOMContentLoaded", () => {
    // Rename the button immediately on load
    lightOneBtn.textContent = 'Fade Colors';
    updateUI('#ff0000');
});
