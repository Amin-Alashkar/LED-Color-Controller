// API Configuration
const API_BASE_URL = 'http://192.168.1.146:8000';
const GET_MESSAGE_ENDPOINT = `${API_BASE_URL}/message`;
const POST_MESSAGE_ENDPOINT = `${API_BASE_URL}/message`;

// DOM Elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const demoBtn = document.getElementById('demo-btn');
const serverResponse = document.getElementById('server-response');
const connectionDot = document.getElementById('connection-dot');
const connectionText = document.getElementById('connection-text');
const apiStatus = document.getElementById('api-status');
const deviceStatus = document.getElementById('device-status');
const lastSentTime = document.getElementById('last-sent-time');
const charCount = document.getElementById('char-count');
const ledStripPreview = document.querySelector('.led-strip-preview');
const playPreviewBtn = document.getElementById('play-preview');
const resetPreviewBtn = document.getElementById('reset-preview');
const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
const refreshMessagesBtn = document.getElementById('refresh-messages');
const clearHistoryBtn = document.getElementById('clear-history');
const recentMessages = document.getElementById('recent-messages');
const apiDocsBtn = document.getElementById('api-docs-btn');
const simulateDeviceBtn = document.getElementById('simulate-device-btn');

// State Variables
let isConnected = false;
let autoRefreshInterval = null;
let recentMessagesList = [];
let ledAnimationInterval = null;
let isAnimating = false;

// LED Mapping (A=0, B=1, ... Z=25)
const letterToLedIndex = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
    'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16,
    'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
};

// Color palette for LEDs
const ledColors = [
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16'  // Lime
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {

    createLedStrip();
    

    await checkConnection();
    

    setupEventListeners();
    
    loadRecentMessages();
    
    if (autoRefreshToggle.checked) {
        startAutoRefresh();
    }
    
    fetchLastMessage();
    
    updateCharCount();
}

function setupEventListeners() {
    messageInput.addEventListener('input', updateCharCount);
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearInput);
    demoBtn.addEventListener('click', loadDemoMessage);
    playPreviewBtn.addEventListener('click', playLedAnimation);
    resetPreviewBtn.addEventListener('click', resetLedPreview);
    refreshMessagesBtn.addEventListener('click', fetchLastMessage);
    clearHistoryBtn.addEventListener('click', clearMessageHistory);
    apiDocsBtn.addEventListener('click', showApiDocs);
    simulateDeviceBtn.addEventListener('click', simulateDevicePolling);
    
    autoRefreshToggle.addEventListener('change', toggleAutoRefresh);
}

async function checkConnection() {
    try {
        const response = await fetch(GET_MESSAGE_ENDPOINT, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            setConnectionStatus(true);
            apiStatus.textContent = 'Connected';
            apiStatus.style.color = '#10b981';
        } else {
            setConnectionStatus(false);
            apiStatus.textContent = `Error: ${response.status}`;
            apiStatus.style.color = '#ef4444';
        }
    } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus(false);
        apiStatus.textContent = 'Cannot connect to backend';
        apiStatus.style.color = '#ef4444';
    }
}

function setConnectionStatus(connected) {
    isConnected = connected;
    
    if (connected) {
        connectionDot.className = 'dot connected';
        connectionText.textContent = 'Connected to backend';
        connectionText.style.color = '#10b981';
        deviceStatus.textContent = 'Ready to receive messages';
        deviceStatus.style.color = '#10b981';
    } else {
        connectionDot.className = 'dot disconnected';
        connectionText.textContent = 'Disconnected from backend';
        connectionText.style.color = '#ef4444';
        deviceStatus.textContent = 'Cannot connect to backend';
        deviceStatus.style.color = '#ef4444';
    }
}

async function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) {
        showResponse('Please enter a message before sending.', 'error');
        messageInput.focus();
        return;
    }
    
    const dirtyWords = ["shit", "fuck", "ass", "bitch", "nigga", "nigger", "negro", "puta", "shite", "pussy"];
    const hasDirtyWord = dirtyWords.some(word => text.toLowerCase().includes(word));
    
    if (hasDirtyWord) {
        showResponse('Message contains blocked content. Please use appropriate language.', 'error');
        return;
    }
    
    setButtonLoading(sendBtn, true);
    
    try {
        const response = await fetch(POST_MESSAGE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        if (response.ok) {
            const data = await response.json();
            showResponse(`Message sent successfully! LED strip will now display: "${data.last_message}"`, 'success');
            
            addRecentMessage(text);
            
            updateLastSentTime();
            
            updateLedPreview(text);
            
            messageInput.value = '';
            updateCharCount();
            
            setConnectionStatus(true);
        } else {
            showResponse(`Error: Server returned status ${response.status}`, 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showResponse('Error: Could not connect to the server. Please check your connection.', 'error');
        setConnectionStatus(false);
    } finally {
        setButtonLoading(sendBtn, false);
    }
}
async function fetchLastMessage() {
    try {
        const response = await fetch(GET_MESSAGE_ENDPOINT);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.last_message) {
                updateLedPreview(data.last_message);
                
                setConnectionStatus(true);
            }
        }
    } catch (error) {
        console.error('Error fetching message:', error);
        setConnectionStatus(false);
    }
}

function createLedStrip() {
    ledStripPreview.innerHTML = '';
    
    for (let i = 0; i < 26; i++) {
        const led = document.createElement('div');
        led.className = 'led';
        led.dataset.index = i;
        led.title = `LED ${i} (${String.fromCharCode(65 + i)})`;
        ledStripPreview.appendChild(led);
    }
}

function updateLedPreview(message) {
    resetLedPreview();
    
    if (!message) return;
    
    const chars = message.toUpperCase().split('');
    let delay = 0;
    
    chars.forEach((char, index) => {
        setTimeout(() => {
            if (char >= 'A' && char <= 'Z') {
                const ledIndex = letterToLedIndex[char];
                if (ledIndex !== undefined) {
                    lightLed(ledIndex, 'letter');
                }
            } else if (char >= '0' && char <= '9') {
                const num = parseInt(char);
                if (num >= 1 && num <= 26) {
                    for (let i = 0; i < num; i++) {
                        setTimeout(() => {
                            lightLed(i, 'sequence');
                        }, i * 100);
                    }
                }
            } else if (char !== ' ') {
                flashAllLeds();
            }
        }, delay * 300);
        
        delay++;
    });
}

function lightLed(index, type = 'letter') {
    const leds = document.querySelectorAll('.led');
    if (index >= 0 && index < leds.length) {
        leds[index].className = 'led';
        
        setTimeout(() => {
            leds[index].classList.add(type === 'sequence' ? 'sequence' : 'on');
            
            const color = ledColors[Math.floor(Math.random() * ledColors.length)];
            leds[index].style.backgroundColor = color;
            leds[index].style.boxShadow = `0 0 15px ${color}`;
        }, 10);
    }
}

function flashAllLeds() {
    const leds = document.querySelectorAll('.led');
    
    leds.forEach(led => {
        led.classList.add('special');
        led.style.backgroundColor = '#ef4444';
        led.style.boxShadow = '0 0 15px #ef4444';
    });
    
    setTimeout(() => {
        leds.forEach(led => {
            led.className = 'led';
            led.style.backgroundColor = '';
            led.style.boxShadow = '';
        });
    }, 500);
}

function resetLedPreview() {
    const leds = document.querySelectorAll('.led');
    leds.forEach(led => {
        led.className = 'led';
        led.style.backgroundColor = '';
        led.style.boxShadow = '';
    });
}

function playLedAnimation() {
    if (isAnimating) {
        stopLedAnimation();
        playPreviewBtn.innerHTML = '<i class="fas fa-play"></i> Play Animation';
        isAnimating = false;
        return;
    }
    
    const message = messageInput.value.trim() || "HELLO 123!";
    isAnimating = true;
    playPreviewBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Animation';
    
    resetLedPreview();
    
    const chars = message.toUpperCase().split('');
    let currentChar = 0;
    
    ledAnimationInterval = setInterval(() => {
        if (currentChar >= chars.length) {
            currentChar = 0;
            resetLedPreview();
        }
        
        const char = chars[currentChar];
        
        if (char >= 'A' && char <= 'Z') {
            const ledIndex = letterToLedIndex[char];
            if (ledIndex !== undefined) {
                lightLed(ledIndex, 'letter');
            }
        } else if (char >= '0' && char <= '9') {
            const num = parseInt(char);
            if (num >= 1 && num <= 26) {
                for (let i = 0; i < num; i++) {
                    setTimeout(() => {
                        lightLed(i, 'sequence');
                    }, i * 100);
                }
            }
        } else if (char !== ' ') {
            flashAllLeds();
        }
        
        currentChar++;
    }, 800);
}

function stopLedAnimation() {
    if (ledAnimationInterval) {
        clearInterval(ledAnimationInterval);
        ledAnimationInterval = null;
    }
    resetLedPreview();
}

function showResponse(message, type = 'info') {
    serverResponse.className = 'response-box';
    
    if (type === 'success') {
        serverResponse.classList.add('success');
    } else if (type === 'error') {
        serverResponse.classList.add('error');
    }
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
    
    serverResponse.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 15px;">
            <i class="${icon}" style="font-size: 2rem; color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}"></i>
            <div>
                <p style="font-weight: 500; margin-bottom: 8px;">${type === 'error' ? 'Error' : 'Success'}</p>
                <p>${message}</p>
                <p style="font-size: 0.9rem; color: #6b7280; margin-top: 10px;">
                    <i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    `;
}

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/100 characters`;
    

    if (count > 80) {
        charCount.style.color = '#ef4444';
    } else if (count > 50) {
        charCount.style.color = '#f59e0b';
    } else {
        charCount.style.color = '#6b7280';
    }
}

// Clear input
function clearInput() {
    messageInput.value = '';
    updateCharCount();
    messageInput.focus();
    showResponse('Input cleared', 'success');
}

// Load demo message
function loadDemoMessage() {
    const demoMessages = [
        "HELLO WORLD 123!",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "CIRCUITPYTHON ROCKS",
        "LED STRIP FUN 789",
        "MAKE IT GLOW!"
    ];
    
    const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
    messageInput.value = randomMessage;
    updateCharCount();
    updateLedPreview(randomMessage);
    showResponse(`Loaded demo message: "${randomMessage}"`, 'success');
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    if (autoRefreshToggle.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(fetchLastMessage, 5000); // 5 seconds
    showResponse('Auto-refresh enabled (updates every 5 seconds)', 'success');
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    showResponse('Auto-refresh disabled', 'info');
}

// Update last sent time
function updateLastSentTime() {
    const now = new Date();
    lastSentTime.textContent = now.toLocaleTimeString();
    lastSentTime.style.color = '#10b981';
}

// Add message to recent list
function addRecentMessage(message) {
    const messageObj = {
        text: message,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    };
    
    recentMessagesList.unshift(messageObj);
    
    // Keep only last 5 messages
    if (recentMessagesList.length > 5) {
        recentMessagesList = recentMessagesList.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('ledMessages', JSON.stringify(recentMessagesList));
    
    // Update display
    updateRecentMessagesDisplay();
}

// Load recent messages from localStorage
function loadRecentMessages() {
    const saved = localStorage.getItem('ledMessages');
    if (saved) {
        try {
            recentMessagesList = JSON.parse(saved);
            updateRecentMessagesDisplay();
        } catch (e) {
            console.error('Error loading recent messages:', e);
        }
    }
}

// Update recent messages display
function updateRecentMessagesDisplay() {
    if (recentMessagesList.length === 0) {
        recentMessages.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No messages sent yet</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    recentMessagesList.forEach((msg, index) => {
        html += `
            <div class="message-item">
                <div class="message-content">${escapeHtml(msg.text)}</div>
                <div class="message-time">${msg.date} ${msg.time}</div>
            </div>
        `;
    });
    
    recentMessages.innerHTML = html;
}

// Clear message history
function clearMessageHistory() {
    recentMessagesList = [];
    localStorage.removeItem('ledMessages');
    updateRecentMessagesDisplay();
    showResponse('Message history cleared', 'success');
}

// Show API documentation
function showApiDocs() {
    const docs = `
        <h3>Backend API Documentation</h3>
        <p><strong>Base URL:</strong> http://192.168.1.146:8000</p>
        
        <h4>Endpoints:</h4>
        <p><code>GET /message</code> - Retrieve the last message sent</p>
        <p><code>POST /message</code> - Send a new message</p>
        
        <h4>POST Request Body:</h4>
        <pre><code>{
    "text": "Your message here"
}</code></pre>
        
        <h4>CircuitPython Integration:</h4>
        <p>The CircuitPython device polls <code>/message</code> every second and displays new messages on the LED strip using the <code>msg_display()</code> function.</p>
    `;
    
    showResponse(docs, 'info');
}

// Simulate device polling
function simulateDevicePolling() {
    showResponse('Simulating CircuitPython device behavior... The device polls /message every second and displays new messages on the LED strip.', 'info');
    
    // Simulate a few polling cycles
    let count = 0;
    const simInterval = setInterval(() => {
        count++;
        fetchLastMessage();
        
        if (count >= 3) {
            clearInterval(simInterval);
            showResponse('Device simulation complete. The CircuitPython device would continue polling every second.', 'success');
        }
    }, 1000);
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize syntax highlighting
hljs.highlightAll();
