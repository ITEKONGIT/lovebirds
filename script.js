// Simple user database
const users = {
    'lover1': { password: 'password1', role: 'boyfriend' },
    'lover2': { password: 'password2', role: 'girlfriend' }
};

// Message storage
let currentMessage = localStorage.getItem('loveMessage') || 'My love, my heart blossoms for you like eternal chrysanthemums... 🌸';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const pageTitle = document.getElementById('pageTitle');
const contentArea = document.getElementById('contentArea');
const logoutBtn = document.getElementById('logoutBtn');

// Create floating hearts
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    document.body.appendChild(heartsContainer);

    const hearts = ['💖', '🌸', '🌺', '💐', '🌷', '🌹', '🥀', '🌼'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heartsContainer.appendChild(heart);
    }
}

// Screen management
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
        
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            role: users[username].role
        }));
        
        // Show main app after delay
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

// Load the main application screen
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
}

// Boyfriend view (can edit messages)
function loadBoyfriendView() {
    pageTitle.textContent = 'Write to My Blossom 💌';
    
    contentArea.innerHTML = `
        <div class="message-editor">
            <textarea id="romanticMessage" rows="6" placeholder="Let your heart bloom with words...">${currentMessage}</textarea>
            <button id="saveBtn" class="save-button">
                <span class="button-icon">🌸</span>
                Plant These Words in Our Garden
            </button>
        </div>
    `;
    
    document.getElementById('saveBtn').addEventListener('click', saveMessage);
}

// Girlfriend view (read-only)
function loadGirlfriendView() {
    pageTitle.textContent = 'My Love\'s Blossoms 📖';
    
    contentArea.innerHTML = `
        <div class="message-display">
            <p>"${currentMessage}"</p>
            <small>~ Your Beloved Gardener</small>
        </div>
    `;
}

// Save message functionality
function saveMessage() {
    const newMessage = document.getElementById('romanticMessage').value.trim();
    
    if (!newMessage) {
        showMessage('🌸 Please let your heart bloom with words! 🌸', 'error');
        return;
    }
    
    if (newMessage.length > 1000) {
        showMessage('🌿 Your garden of words is too vast! 🌿', 'error');
        return;
    }
    
    currentMessage = newMessage;
    localStorage.setItem('loveMessage', newMessage);
    
    showMessage('🌸 Planted in our garden! Your love will see this bloom soon. 🌸', 'success');
    
    // Update display
    setTimeout(() => {
        contentArea.innerHTML = `
            <div class="message-display">
                <p>"${newMessage}"</p>
                <small>~ Your Beloved Gardener</small>
            </div>
        `;
    }, 1500);
}

// Show temporary message
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
    localStorage.removeItem('currentUser');
    showScreen(loginScreen);
    loginForm.reset();
    loginMessage.textContent = '';
});

// Check if user is already logged in
function checkExistingLogin() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        loadAppScreen();
    } else {
        showScreen(loginScreen);
    }
}

// Auto-refresh message for girlfriend
function startMessageRefresh() {
    setInterval(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData && userData.role === 'girlfriend') {
            const savedMessage = localStorage.getItem('loveMessage') || currentMessage;
            if (savedMessage !== currentMessage) {
                currentMessage = savedMessage;
                loadGirlfriendView();
            }
        }
    }, 3000);
}

// Initialize the app
function init() {
    createFloatingHearts();
    checkExistingLogin();
    startMessageRefresh();
}

// Start the application
init();