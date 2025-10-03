// DOM Elements for Admin
const vipBtn = document.getElementById('vipBtn');
const modal = document.getElementById('adminModal');
const closeBtn = document.querySelector('.close-btn');
const adminFeatures = document.getElementById('adminFeatures');

let is_admin = false;

// Show modal when VIP button is clicked
vipBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.classList.remove('closing');
});

// Close modal function
function closeModal() {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 600);
}

// Close modal events
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});

// Admin login function
async function adminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('.submit-btn');

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accessing…';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === "success") {
                is_admin = true;
                closeModal();               
                updateUIForAdmin();         
            } else {
                throw new Error('Login failed. Please check your credentials.');
            }
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.innerHTML = 'Access Dashboard';
        submitBtn.disabled = false;
    }
}

// Update UI for admin
function updateUIForAdmin() {
    if (is_admin) {
        adminFeatures.style.display = 'block';
        adminFeatures.innerHTML = `
            <h2 class="button-title">Admin Controls</h2>
            <div class="button-container">
                <button id="resetSystemBtn" onclick="systemReset()">Reset System</button>
                <button id="rebootDeviceBtn" onclick="rebootDevice()">Reboot Device</button>
                <button id="shutdownSystemBtn" onclick="shutdownSystem()">Shutdown</button>
                <button id="adminLogoutBtn" onclick="adminLogout()">Logout</button>
            </div>
        `;
    } else {
        adminFeatures.style.display = 'none';
        adminFeatures.innerHTML = '';
    }
}

// Admin control functions
async function systemReset() {
    await fetch(`${API_BASE_URL}/admin/reset`, {
        method: 'POST',
        credentials: 'include'
    });
    alert('System reset!');
}

async function rebootDevice() {
    await fetch(`${API_BASE_URL}/admin/reboot`, {
        method: 'POST',
        credentials: 'include'
    });
    alert('Device rebooting...');
}

async function shutdownSystem() {
    await fetch(`${API_BASE_URL}/admin/shutdown`, {
        method: 'POST',
        credentials: 'include'
    });
    alert('System shutting down...');
}

async function adminLogout() {
    await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    is_admin = false;
    updateUIForAdmin();
    alert('You have been logged out');
}

// Check admin status on page load
async function checkAdminStatus() {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/status`, {
            credentials: 'include'
        });
        const data = await res.json();
        is_admin = data.is_admin;
        updateUIForAdmin();
    } catch (error) {
        console.error('Failed to check admin status:', error);
    }
}

// Bind login function to submit button
document.querySelector('.submit-btn').addEventListener('click', adminLogin);

// Check admin status when page loads
document.addEventListener("DOMContentLoaded", async () => {
    await checkAdminStatus();
});
