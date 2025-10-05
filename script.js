// =============================================
// CONFIGURATION - JSONBin.io Setup
// =============================================

// REPLACE THESE WITH YOUR ACTUAL VALUES:
const JSONBIN_API_KEY = '$2a$10$dw5t4xCTlK2qd021U4REyOXvKb7XGGT38BEDOlAdluAmIkY0QNhVy'; // Get from jsonbin.io dashboard
const JSONBIN_BIN_ID = '68e1f3cdd0ea881f4095aeca'; // We'll create this first

// =============================================
// CORE APPLICATION CODE
// =============================================

// Simple user database
const users = {
    'lover1': { password: 'password1', role: 'boyfriend' },
    'lover2': { password: 'password2', role: 'girlfriend' }
};

// Message storage
let currentMessage = 'My love, my heart blossoms for you like eternal chrysanthemums... 🌸💖';
let lastMessageVersion = '0';

// Real-time update interval
const UPDATE_INTERVAL = 3000;
let updateInterval;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const pageTitle = document.getElementById('pageTitle');
const contentArea = document.getElementById('contentArea');
const logoutBtn = document.getElementById('logoutBtn');

// =============================================
// JSONBin.io CLOUD STORAGE FUNCTIONS
// =============================================

async function initializeStorage() {
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
    
    try {
        console.log('🔄 Initializing JSONBin storage...');
        const response = await fetch(JSONBIN_URL + '/latest', {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.record && data.record.message) {
                currentMessage = data.record.message;
                lastMessageVersion = data.record.version || '0';
                console.log('✅ Loaded message from cloud:', currentMessage.substring(0, 50) + '...');
            } else {
                console.log('📝 No existing message, creating initial...');
                await saveMessageToCloud(currentMessage, '0');
            }
        } else if (response.status === 404) {
            console.log('❌ Bin not found, please create it first');
            showGlobalError('Please create your JSONBin first - see instructions');
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Cloud initialization failed:', error);
        // Fallback to localStorage
        currentMessage = localStorage.getItem('loveMessage') || currentMessage;
        lastMessageVersion = localStorage.getItem('messageVersion') || '0';
        console.log('📱 Using local storage as fallback');
    }
}

async function saveMessageToCloud(message, version) {
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
    const data = {
        message: message,
        version: version,
        lastUpdated: new Date().toISOString(),
        updatedBy: JSON.parse(localStorage.getItem('currentUser'))?.username || 'unknown'
    };
    
    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log('💾 Message saved to cloud');
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Cloud save failed:', error);
        // Fallback to localStorage
        localStorage.setItem('loveMessage', message);
        localStorage.setItem('messageVersion', version);
        return false;
    }
}

async function loadMessageFromCloud() {
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
    
    try {
        const response = await fetch(JSONBIN_URL + '/latest', {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return {
                message: data.record.message,
                version: data.record.version,
                success: true,
                lastUpdated: data.record.lastUpdated
            };
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Cloud load failed:', error);
        // Fallback to localStorage
        return {
            message: localStorage.getItem('loveMessage') || currentMessage,
            version: localStorage.getItem('messageVersion') || '0',
            success: false
        };
    }
}

// =============================================
// REAL-TIME UPDATE SYSTEM
// =============================================

function startRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    updateInterval = setInterval(async () => {
        await checkForMessageUpdates();
    }, UPDATE_INTERVAL);
    
    console.log('🔄 Real-time updates started');
}

function stopRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('🛑 Real-time updates stopped');
    }
}

async function checkForMessageUpdates() {
    const cloudData = await loadMessageFromCloud();
    
    if (cloudData.version !== lastMessageVersion && cloudData.message !== currentMessage) {
        console.log('📬 New message detected from cloud!');
        currentMessage = cloudData.message;
        lastMessageVersion = cloudData.version;
        
        // Update view if needed
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData && userData.role === 'girlfriend') {
            showNewMessageNotification();
            reloadGirlfriendView();
        }
        
        // Also update boyfriend's view if he's just reading
        if (userData && userData.role === 'boyfriend' && !document.getElementById('romanticMessage')) {
            reloadBoyfriendView();
        }
    }
}

function showNewMessageNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = '💖 New message from your love!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff69b4, #98fb98);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 20px rgba(255, 105, 180, 0.4);
        z-index: 10000;
        font-weight: bold;
        animation: slideDown 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-in forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `❌ ${message}`;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(255, 107, 107, 0.4);
        z-index: 10000;
        font-weight: bold;
        text-align: center;
        max-width: 90%;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// =============================================
// UI FUNCTIONS
// =============================================

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
        
        .message-saved-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(152, 251, 152, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
            animation: fadeInOut 2s ease-in-out;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-10px); }
            50% { opacity: 1; transform: translateY(0); }
        }
        
        .last-updated {
            text-align: center;
            margin-top: 15px;
            color: #88c9a1;
            font-size: 0.9rem;
        }
        
        .editor-tips {
            margin-top: 10px;
            text-align: center;
            color: #c8a2c8;
            font-size: 0.8rem;
        }
        
        .cloud-status {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.9);
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 0.7rem;
            color: #666;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}

function createFloatingFlowers() {
    const flowersContainer = document.createElement('div');
    flowersContainer.className = 'floating-flowers';
    document.body.appendChild(flowersContainer);

    const flowers = ['🌸', '🌺', '💮', '🏵️', '🌻', '🌼', '🌷', '🌹', '🥀', '💐', '🪷', '🪻'];
    
    for (let i = 0; i < 15; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDelay = Math.random() * 30 + 's';
        flower.style.fontSize = (20 + Math.random() * 12) + 'px';
        flowersContainer.appendChild(flower);
    }
}

function createFloatingLeaves() {
    const leavesContainer = document.createElement('div');
    leavesContainer.className = 'floating-leaves';
    document.body.appendChild(leavesContainer);

    const leaves = ['🌿', '🍃', '🍂', '🍁', '🎋'];
    
    for (let i = 0; i < 6; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 12 + 's';
        leavesContainer.appendChild(leaf);
    }
}

function setupScroll() {
    const scroll = document.querySelector('.scroll-container');
    const clasp = document.querySelector('.clasp');
    
    if (scroll && clasp) {
        clasp.addEventListener('click', () => {
            scroll.classList.toggle('open');
        });
    }
}

function setupCharacterCounter() {
    const textarea = document.getElementById('romanticMessage');
    const charCounter = document.querySelector('.char-counter');
    let autoSaveTimeout;
    
    if (textarea && charCounter) {
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/2000 characters`;
            
            if (length > 1800) {
                charCounter.style.color = '#ff6b6b';
            } else if (length > 1500) {
                charCounter.style.color = '#ffa500';
            } else {
                charCounter.style.color = '#88c9a1';
            }
            
            // Auto-save draft every 3 seconds of inactivity
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                if (this.value !== currentMessage) {
                    saveDraft(this.value);
                }
            }, 3000);
        });
        
        // Initialize counter
        charCounter.textContent = `${textarea.value.length}/2000 characters`;
    }
}

function saveDraft(message) {
    localStorage.setItem('messageDraft', message);
    showDraftSaved();
}

function showDraftSaved() {
    const existingIndicator = document.querySelector('.message-saved-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'message-saved-indicator';
    indicator.textContent = '💾 Draft saved';
    
    const messageEditor = document.querySelector('.message-editor');
    if (messageEditor) {
        messageEditor.style.position = 'relative';
        messageEditor.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
}

function showScreen(screen) {
    loginScreen.classList.remove('active');
    appScreen.classList.remove('active');
    screen.classList.add('active');
}

// Login functionality
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        loginMessage.textContent = '🌸 Our hearts blossom together! 🌸';
        loginMessage.className = 'message success';
        
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: users[username].role
        }));
        
        setTimeout(() => {
            loadAppScreen();
        }, 1000);
        
    } else {
        loginMessage.textContent = '🌿 Our paths diverge... Try again. 🌿';
        loginMessage.className = 'message error';
        loginScreen.classList.add('shake');
        setTimeout(() => loginScreen.classList.remove('shake'), 500);
    }
});

function loadAppScreen() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!userData) {
        showScreen(loginScreen);
        return;
    }

    showScreen(appScreen);
    
    if (userData.role === 'boyfriend') {
        loadBoyfriendView();
    } else {
        loadGirlfriendView();
    }
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Add cloud status indicator
    addCloudStatusIndicator();
}

function addCloudStatusIndicator() {
    const status = document.createElement('div');
    status.className = 'cloud-status';
    status.textContent = '☁️ Cloud Connected';
    status.id = 'cloudStatus';
    document.body.appendChild(status);
}

function loadBoyfriendView() {
    pageTitle.textContent = 'Write to My Blossom 💌';
    
    // Load draft if exists, otherwise current message
    const draft = localStorage.getItem('messageDraft');
    const displayMessage = draft || currentMessage;
    
    contentArea.innerHTML = `
        <div class="message-editor">
            <div class="char-counter">${displayMessage.length}/2000 characters</div>
            <textarea id="romanticMessage" placeholder="Pour your heart out... write as much as you want!">${displayMessage}</textarea>
            <button id="saveBtn" class="save-button">
                <span class="button-icon">💖</span>
                Send to My Love
            </button>
            <div class="editor-tips">
                <small>💡 Tip: Your draft saves automatically as you type!</small>
            </div>
        </div>
    `;
    
    document.getElementById('saveBtn').addEventListener('click', saveMessage);
    setupCharacterCounter();
}

function reloadBoyfriendView() {
    if (document.querySelector('.message-editor')) {
        loadBoyfriendView();
    }
}

function loadGirlfriendView() {
    pageTitle.textContent = 'My Love\'s Message 📖';
    
    contentArea.innerHTML = `
        <div class="scroll-container open" id="loveScroll">
            <div class="rod top"></div>
            <div class="clasp" id="scrollClasp"></div>
            <div class="scroll-text">
                ${formatMessageForDisplay(currentMessage)}
            </div>
            <div class="rod bottom"></div>
        </div>
        <div class="last-updated">
            <small>🕒 Updates in real-time across devices</small>
        </div>
    `;
    
    // Setup scroll functionality
    setTimeout(() => {
        setupScroll();
    }, 100);
}

function reloadGirlfriendView() {
    if (document.querySelector('.scroll-container')) {
        loadGirlfriendView();
    }
}

function formatMessageForDisplay(message) {
    if (!message) return '<p>No message yet... 💌</p>';
    
    return message.split('\n').map(paragraph => 
        paragraph.trim() ? `<p style="margin-bottom: 1rem; line-height: 1.6; text-align: left;">${paragraph}</p>` : '<br>'
    ).join('');
}

// Save message functionality
async function saveMessage() {
    const newMessage = document.getElementById('romanticMessage').value.trim();
    
    if (!newMessage) {
        showMessage('🌸 Please write something from your heart! 🌸', 'error');
        return;
    }
    
    if (newMessage.length > 2000) {
        showMessage('🌿 Your message is a bit too long (max 2000 characters) 🌿', 'error');
        return;
    }
    
    // Update message with new version
    currentMessage = newMessage;
    const newVersion = Date.now().toString();
    lastMessageVersion = newVersion;
    
    // Save to cloud
    const cloudSuccess = await saveMessageToCloud(newMessage, newVersion);
    
    if (cloudSuccess) {
        showMessage('💖 Message sent! Your love will see it on their phone!', 'success');
        document.getElementById('cloudStatus').textContent = '☁️ Message Delivered';
    } else {
        showMessage('💝 Message saved locally (check internet connection)', 'success');
        document.getElementById('cloudStatus').textContent = '📱 Local Only';
    }
    
    localStorage.removeItem('messageDraft');
    
    setTimeout(() => {
        contentArea.innerHTML = `
            <div class="message-display">
                <p>"${cloudSuccess ? 'Message delivered across devices! 💌' : 'Saved locally 📱'}"</p>
                <small>${cloudSuccess ? 'Your love will see it on their phone!' : 'Connect to internet for cross-device sync'}</small>
            </div>
        `;
    }, 2000);
}

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    contentArea.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Logout functionality
logoutBtn.addEventListener('click', function() {
    stopRealTimeUpdates();
    localStorage.removeItem('currentUser');
    showScreen(loginScreen);
    loginForm.reset();
    loginMessage.textContent = '';
    
    // Remove cloud status
    const status = document.getElementById('cloudStatus');
    if (status) status.remove();
});

function checkExistingLogin() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        loadAppScreen();
    } else {
        showScreen(loginScreen);
    }
}

// =============================================
// INITIALIZATION
// =============================================

async function init() {
    addNotificationStyles();
    createFloatingFlowers();
    createFloatingLeaves();
    
    // Initialize cloud storage first
    await initializeStorage();
    
    checkExistingLogin();
}

// Start the application
init();
