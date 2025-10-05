// Simple user database
const users = {
    'lover1': { password: 'password1', role: 'boyfriend' },
    'lover2': { password: 'password2', role: 'girlfriend' }
};

// Message storage
let currentMessage = localStorage.getItem('loveMessage') || 'My love, my heart blossoms for you like eternal chrysanthemums... Every moment with you feels like walking through our secret garden, where each flower represents a beautiful memory we\'ve created together. Your smile is the sunshine that helps our love grow, and your laughter is the sweetest melody in our garden of affection. 🌸💖';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const pageTitle = document.getElementById('pageTitle');
const contentArea = document.getElementById('contentArea');
const logoutBtn = document.getElementById('logoutBtn');

// Create floating flowers - ALWAYS PLENTY
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

// Create floating leaves
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

// Scroll functionality
function setupScroll() {
    const scroll = document.querySelector('.scroll-container');
    const clasp = document.querySelector('.clasp');
    
    if (scroll && clasp) {
        clasp.addEventListener('click', () => {
            scroll.classList.toggle('open');
        });
    }
}

// Character counter for boyfriend
function setupCharacterCounter() {
    const textarea = document.getElementById('romanticMessage');
    const charCounter = document.querySelector('.char-counter');
    
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
        });
        
        // Initialize counter
        charCounter.textContent = `${textarea.value.length}/2000 characters`;
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

// Boyfriend view (IMPROVED for long texts)
function loadBoyfriendView() {
    pageTitle.textContent = 'Write to My Blossom 💌';
    
    contentArea.innerHTML = `
        <div class="message-editor">
            <div class="char-counter">${currentMessage.length}/2000 characters</div>
            <textarea id="romanticMessage" placeholder="Pour your heart out... write as much as you want!">${currentMessage}</textarea>
            <button id="saveBtn" class="save-button">
                <span class="button-icon">🌸</span>
                Send to My Love
            </button>
        </div>
    `;
    
    document.getElementById('saveBtn').addEventListener('click', saveMessage);
    setupCharacterCounter();
}

// Girlfriend view (FIXED - no static signature)
function loadGirlfriendView() {
    pageTitle.textContent = 'My Love\'s Message 📖';
    
    contentArea.innerHTML = `
        <div class="scroll-container" id="loveScroll">
            <div class="rod top"></div>
            <div class="clasp" id="scrollClasp"></div>
            <div class="scroll-text">
                ${currentMessage.split('\n').map(paragraph => 
                    paragraph.trim() ? `<p style="margin-bottom: 1rem; line-height: 1.6;">${paragraph}</p>` : ''
                ).join('')}
            </div>
            <div class="rod bottom"></div>
        </div>
    `;
    
    // Setup scroll functionality
    setTimeout(() => {
        setupScroll();
    }, 100);
}

// Save message functionality
function saveMessage() {
    const newMessage = document.getElementById('romanticMessage').value.trim();
    
    if (!newMessage) {
        showMessage('🌸 Please write something from your heart! 🌸', 'error');
        return;
    }
    
    if (newMessage.length > 2000) {
        showMessage('🌿 Your message is a bit too long (max 2000 characters) 🌿', 'error');
        return;
    }
    
    currentMessage = newMessage;
    localStorage.setItem('loveMessage', newMessage);
    
    showMessage('🌸 Message sent! Your love will see it soon. 🌸', 'success');
    
    // Show preview
    setTimeout(() => {
        contentArea.innerHTML = `
            <div class="message-display">
                <p>"Your beautiful message has been saved!"</p>
                <small>Ready for your beloved to read 💖</small>
            </div>
        `;
    }, 2000);
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
    createFloatingFlowers();
    createFloatingLeaves();
    checkExistingLogin();
    startMessageRefresh();
}

// Start the application
init();