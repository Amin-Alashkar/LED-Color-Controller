const API_BASE_URL = "http://10.220.1.123:8000";

// DOM Elements
const colorDisplay = document.getElementById('colorDisplay');
const lightOneBtn = document.getElementById('lightOneBtn');
const offBtn = document.getElementById('offBtn');

// Animation state
let isAnimationRunning = false;

async function sendRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { status: "error", message: error.message };
    }
}

async function setColor(color) {
    updateUI(color);
    await sendRequest("/color", { hex_color: color });
}

async function startLightOneByOne() {
    if (isAnimationRunning) return;
    
    isAnimationRunning = true;
    lightOneBtn.classList.add('active');
    lightOneBtn.textContent = 'Running...';
    
    const response = await sendRequest("/animate", {
        animation_type: "light_one_by_one",
        color_index: 0
    });
    
    if (response.status === "queued") {
        // Animation started successfully
    } else {
        resetAnimationState();
    }
}

async function stopAnimation() {
    const response = await sendRequest("/stop");
    resetAnimationState();
    updateUI('#000000');
}

function resetAnimationState() {
    isAnimationRunning = false;
    lightOneBtn.classList.remove('active');
    lightOneBtn.textContent = 'Light One by One';
}

function updateUI(color) {
    document.body.style.background = color;
    document.body.style.boxShadow = `0 0 80px ${color}80 inset`;
    colorDisplay.style.background = color;
    colorDisplay.textContent = color.toUpperCase();
    document.getElementById('colorPicker').value = color;
    setTextColor(color);
}

function setTextColor(color) {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    document.querySelector('h1').style.color = luminance > 0.5 ? '#333' : '#fff';
    document.querySelector('.card').style.background = luminance > 0.5 ? 'white' : 'rgba(0,0,0,0.7)';
}

// Event Listeners
lightOneBtn.addEventListener("click", startLightOneByOne);
offBtn.addEventListener("click", stopAnimation);

// Initialize
updateUI('#ff0000');
