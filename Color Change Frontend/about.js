// about.js

const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const aboutClose = document.getElementById('aboutClose');

// Animation System Class
class AnimationSystem {
    constructor(container) {
        this.container = container;
        this.currentAnimation = null;
        this.animations = [
            'particleNetwork',
            'floatingBubbles',
            'magneticField',
            'hologramGrid'
        ];
    }

    // Get random animation
    getRandomAnimation() {
        const randomIndex = Math.floor(Math.random() * this.animations.length);
        return this.animations[randomIndex];
    }

    // Start random animation
    startRandomAnimation() {
        this.stopCurrentAnimation();
        
        const animationName = this.getRandomAnimation();
        console.log(`Starting animation: ${animationName}`);
        
        switch(animationName) {
            case 'particleNetwork':
                this.currentAnimation = new ParticleNetworkAnimation(this.container);
                break;
            case 'floatingBubbles':
                this.currentAnimation = new FloatingBubblesAnimation(this.container);
                break;
            case 'magneticField':
                this.currentAnimation = new MagneticFieldAnimation(this.container);
                break;
            case 'hologramGrid':
                this.currentAnimation = new HologramGridAnimation(this.container);
                break;
        }
        
        if (this.currentAnimation) {
            this.currentAnimation.start();
        }
    }

    // Stop current animation
    stopCurrentAnimation() {
        if (this.currentAnimation && this.currentAnimation.stop) {
            this.currentAnimation.stop();
        }
        this.currentAnimation = null;
        
        // Remove all canvas elements
        const canvases = this.container.querySelectorAll('canvas');
        canvases.forEach(canvas => canvas.remove());
    }
}

// 1. Particle Network Animation (Original)
class ParticleNetworkAnimation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.animationId = null;
    }

    init() {
        this.canvas.className = 'animation-canvas';
        this.container.appendChild(this.canvas);
        this.resize();
        this.createParticles();
        
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(${106 + Math.random() * 150}, ${92 + Math.random() * 100}, ${255}, ${0.3 + Math.random() * 0.4})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x <= 0 || p.x >= this.canvas.width) p.speedX *= -1;
            if (p.y <= 0 || p.y >= this.canvas.height) p.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(106, 92, 255, ${0.2 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
            
            const distanceToMouse = Math.sqrt((p.x - this.mouse.x) ** 2 + (p.y - this.mouse.y) ** 2);
            if (distanceToMouse < this.mouse.radius) {
                p.x += (p.x - this.mouse.x) * 0.02;
                p.y += (p.y - this.mouse.y) * 0.02;
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 2. Floating Bubbles Animation
class FloatingBubblesAnimation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bubbles = [];
        this.animationId = null;
    }

    init() {
        this.canvas.className = 'animation-canvas';
        this.container.appendChild(this.canvas);
        this.resize();
        this.createBubbles();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createBubbles() {
        const bubbleCount = 15;
        this.bubbles = [];
        
        for (let i = 0; i < bubbleCount; i++) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                radius: Math.random() * 30 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, `
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.bubbles.length; i++) {
            const bubble = this.bubbles[i];
            
            bubble.y -= bubble.speed;
            bubble.opacity -= 0.002;
            
            if (bubble.y < -bubble.radius || bubble.opacity <= 0) {
                bubble.y = this.canvas.height + bubble.radius;
                bubble.x = Math.random() * this.canvas.width;
                bubble.opacity = Math.random() * 0.3 + 0.1;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = bubble.color + bubble.opacity + ')';
            this.ctx.fill();
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 6. Magnetic Field Animation
class MagneticFieldAnimation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
    }

    init() {
        this.canvas.className = 'animation-canvas';
        this.container.appendChild(this.canvas);
        this.resize();
        this.createParticles();
        
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.createParticles();
    }

    createParticles() {
        const particleCount = 50;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                color: `rgba(${106 + Math.random() * 150}, 92, 255, ${0.5 + Math.random() * 0.5})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Magnetic field effect towards mouse
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = 0.1;
                p.vx += (dx / distance) * force;
                p.vy += (dy / distance) * force;
            }
            
            // Apply velocity and friction
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Draw field lines
            if (distance < 150) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(106, 92, 255, ${0.2 * (1 - distance/150)})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 10. Hologram Grid Animation
class HologramGridAnimation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.animationId = null;
    }

    init() {
        this.canvas.className = 'animation-canvas';
        this.container.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 0.02;
        
        const gridSize = 40;
        const pulse = Math.sin(this.time) * 5;
        
        // Draw vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + pulse, 0);
            this.ctx.lineTo(x + pulse, this.canvas.height);
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(this.time + x * 0.01) * 0.1})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + pulse);
            this.ctx.lineTo(this.canvas.width, y + pulse);
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.cos(this.time + y * 0.01) * 0.1})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        // Draw central point
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        this.ctx.fill();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.init();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize Animation System
let animationSystem = null;

// Enhanced modal functions
async function openAbout() {
    if (!aboutModal) return;
    
    // Prevent multiple openings
    if (aboutModal.classList.contains('show')) return;
    
    // Add loading state to button
    aboutBtn.classList.add('loading');
    aboutBtn.innerHTML = 'Loading...';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Show modal with animation
    aboutModal.classList.add('show');
    aboutModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Initialize animation system and start random animation
    if (!animationSystem) {
        animationSystem = new AnimationSystem(aboutModal);
    }
    animationSystem.startRandomAnimation();

    const title = document.querySelector('.about-header h1');
    if (title) {
        title.textContent = 'Smart Light Controller';
    }

    // Restore button state
    aboutBtn.classList.remove('loading');
    aboutBtn.innerHTML = 'About';
    
    // Focus management
    aboutClose.focus();
}

function closeAbout() {
    if (!aboutModal) return;
    
    // Stop current animation
    if (animationSystem) {
        animationSystem.stopCurrentAnimation();
    }
    
    // Add closing animation
    aboutModal.style.animation = 'aboutFadeOut 0.25s ease-in both';
    
    setTimeout(() => {
        aboutModal.classList.remove('show');
        aboutModal.setAttribute('aria-hidden', 'true');
        aboutModal.style.animation = '';
        document.body.classList.remove('modal-open');
        aboutBtn.focus();
    }, 250);
}

// Enhanced event listeners
if (aboutBtn) {
    aboutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await openAbout();
    });
    
    // Add ripple effect to button
    aboutBtn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

if (aboutClose) {
    aboutClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeAbout();
    });
}

// Enhanced backdrop click
aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        closeAbout();
    }
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal.classList.contains('show')) {
        closeAbout();
    }
    
    // Tab key trapping inside modal
    if (e.key === 'Tab' && aboutModal.classList.contains('show')) {
        const focusableElements = aboutModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes aboutFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
    }
    
    .about-btn.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .animation-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }
    
    /* إزالة الأنيميشنات للعناصر الداخلية */
    .about-section {
        opacity: 1;
        transform: none;
    }
    
    .feature-item, .tech-stack-item {
        opacity: 1;
        transform: none;
    }
    
    /* Enhanced feature list items */
    .feature-list li {
        transition: all 0.3s ease;
        cursor: default;
    }
    
    .feature-list li:hover {
        transform: translateX(8px);
        background: rgba(106, 92, 255, 0.05);
        border-radius: 8px;
        padding: 8px 12px;
        margin-left: -12px;
    }
    
    .feature-list li::before {
        transition: all 0.3s ease;
    }
    
    .feature-list li:hover::before {
        color: #FF8A00;
        transform: scale(1.5);
    }
`;

document.head.appendChild(style);

// Initialize hover effects for feature list
document.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelectorAll('.feature-list li');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});

// Performance optimization
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (animationSystem && animationSystem.currentAnimation && animationSystem.currentAnimation.resize) {
            animationSystem.currentAnimation.resize();
        }
    }, 250);
});

// Export for global access
window.AboutModal = {
    open: openAbout,
    close: closeAbout,
    animationSystem
};
