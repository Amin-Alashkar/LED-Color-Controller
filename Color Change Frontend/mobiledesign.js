// mobiledesign.js

(function() {
    'use strict';
    
    const CONFIG = {
        sessionStorageKey: 'mobileWarningDismissed',
        maxMobileWidth: 1024, 
        showDelay: 300,
        checkOnResize: true 
    };
    
    const FUNNY_PHRASES = [
        "I'm lazy and I can't open my computer",
        "I'm broke and I don't have a computer",
        "Yeah, I understand",
        "I got you",
        "Understood",
        "Fine, I'll suffer",
        "My computer is taking a nap",
        "I live dangerously",
        "My cat is using the computer",
        "I prefer challenges",
        "Let's see what happens",
        "I'll risk it",
        "My computer ran away",
        "I'm on a tiny screen adventure",
        "Mobile is my life"
    ];
    
    let mobileWarningOverlay = null;
    let mobileWarningPanel = null;
    let mobileWarningCheckbox = null;
    let mobileWarningDismissBtn = null;
    
    let tabSessionId = null;
    
    function initMobileWarning() {
        if (document.getElementById('mobile-warning-overlay')) {
            return;
        }
        
        initTabSessionId();
        
        createMobileWarningPanel();
        
        if (shouldShowWarning()) {
            setTimeout(showMobileWarning, CONFIG.showDelay);
        }
        
        setupEventListeners();
    }
    
    function initTabSessionId() {
        let existingSessionId = sessionStorage.getItem('tabSessionId');
        
        if (!existingSessionId) {
            tabSessionId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('tabSessionId', tabSessionId);
        } else {
            tabSessionId = existingSessionId;
        }
    }
    
    function createMobileWarningPanel() {
        mobileWarningOverlay = document.createElement('div');
        mobileWarningOverlay.id = 'mobile-warning-overlay';
        mobileWarningOverlay.className = 'mobile-warning-hidden';
        
        mobileWarningPanel = document.createElement('div');
        mobileWarningPanel.id = 'mobile-warning-panel';
        
        mobileWarningPanel.innerHTML = `
            <h2>📱 Mobile Experience Notice</h2>
            <p>This version of the LED Color Controller is optimized for desktop computers and may not provide the best experience on mobile devices.</p>
            
            <div class="mobile-warning-features">
                <h3>For the best experience:</h3>
                <ul>
                    <li>Use a computer with a larger screen</li>
                    <li>Enjoy full animation capabilities</li>
                    <li>Access all controls easily</li>
                    <li>Experience smoother performance</li>
                </ul>
            </div>
            
            <div id="mobile-warning-checkbox-container">
                <input type="checkbox" id="mobile-warning-checkbox">
                <label for="mobile-warning-checkbox" id="mobile-warning-checkbox-label">
                    Don't show this again
                </label>
            </div>
            
            <button id="mobile-warning-dismiss-btn">Dismiss</button>
            
            <p class="mobile-warning-note">You can still use the mobile version, but some features may be limited.</p>
        `;
        
        mobileWarningOverlay.appendChild(mobileWarningPanel);
        
        document.body.appendChild(mobileWarningOverlay);
        
        mobileWarningCheckbox = document.getElementById('mobile-warning-checkbox');
        mobileWarningDismissBtn = document.getElementById('mobile-warning-dismiss-btn');
        
        setRandomFunnyPhrase();
        
        if (mobileWarningCheckbox) {
            mobileWarningCheckbox.setAttribute('title', 'This setting only applies to the current browser tab');
        }
    }
    
    function setRandomFunnyPhrase() {
        if (!mobileWarningDismissBtn) return;
        
        const randomIndex = Math.floor(Math.random() * FUNNY_PHRASES.length);
        mobileWarningDismissBtn.textContent = FUNNY_PHRASES[randomIndex];
    }
    
    function shouldShowWarning() {
        const dismissedForTab = sessionStorage.getItem(`${CONFIG.sessionStorageKey}_${tabSessionId}`);
        if (dismissedForTab === 'true') {
            return false;
        }
        
        const isMobileWidth = window.innerWidth <= CONFIG.maxMobileWidth;
        
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUserAgent = /mobile|android|iphone|ipad|ipod|windows phone/i.test(userAgent);
        
        return isMobileWidth || isMobileUserAgent;
    }
    
    function showMobileWarning() {
        if (!mobileWarningOverlay) return;
        
        mobileWarningOverlay.classList.remove('mobile-warning-hidden');
        
        document.body.style.overflow = 'hidden';
    }
    
    function hideMobileWarning() {
        if (!mobileWarningOverlay) return;
        
        mobileWarningOverlay.classList.add('mobile-warning-closing');
        
        setTimeout(() => {
            mobileWarningOverlay.classList.add('mobile-warning-hidden');
            mobileWarningOverlay.classList.remove('mobile-warning-closing');
            
            document.body.style.overflow = '';
        }, 400);
    }
    
    function dismissWarning() {
        if (mobileWarningCheckbox && mobileWarningCheckbox.checked) {
            sessionStorage.setItem(`${CONFIG.sessionStorageKey}_${tabSessionId}`, 'true');
        }
        
        hideMobileWarning();
    }
    
    function setupEventListeners() {
        if (mobileWarningDismissBtn) {
            mobileWarningDismissBtn.addEventListener('click', dismissWarning);
        }
        
        if (mobileWarningOverlay) {
            mobileWarningOverlay.addEventListener('click', function(e) {
                if (e.target === mobileWarningOverlay) {
                    dismissWarning();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && 
                mobileWarningOverlay && 
                !mobileWarningOverlay.classList.contains('mobile-warning-hidden')) {
                dismissWarning();
            }
        });
        
        if (CONFIG.checkOnResize) {
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    if (mobileWarningOverlay && 
                        mobileWarningOverlay.classList.contains('mobile-warning-hidden') &&
                        shouldShowWarning()) {
                        showMobileWarning();
                    }
                }, 250);
            });
        }
        
        window.addEventListener('beforeunload', function() {
        });
    }
    
    function resetMobileWarningForCurrentTab() {
        if (tabSessionId) {
            sessionStorage.removeItem(`${CONFIG.sessionStorageKey}_${tabSessionId}`);
        }
        console.log('Mobile warning preference has been reset for current tab. It will show again on next reload.');
    }
    
    function resetAllMobileWarnings() {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(CONFIG.sessionStorageKey)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        sessionStorage.removeItem('tabSessionId');
        
        console.log('All mobile warning preferences have been cleared.');
    }
    
    window.resetMobileWarningForCurrentTab = resetMobileWarningForCurrentTab;
    window.resetAllMobileWarnings = resetAllMobileWarnings;
    window.getTabSessionId = function() { return tabSessionId; };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileWarning);
    } else {
        initMobileWarning();
    }
    
})();
