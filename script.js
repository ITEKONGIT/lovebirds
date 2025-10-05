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
const flowerBackground = document.querySelector('.flower-background');
const densityButtons = document.querySelectorAll('.density-btn');

// Flower density control
function setupFlowerControls() {
    densityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            densityButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get density level
            const density = this.getAttribute('data-density');
            
            // Remove all density classes
            flowerBackground.classList.remove(
                'flower-density-minimal',
                'flower-density-light', 
                'flower-density-medium',
                'flower-density-lush'
            );
            
            // Add selected density class
            flowerBackground.classList.add(`flower-density-${density}`);
            
            // Save preference to localStorage
            localStorage.setItem('flowerDensity', density);
        });
    });
    
    // Load saved density preference
    const savedDensity = localStorage.getItem('flowerDensity') || 'lush'; // Default to lush now
    const savedButton = document.querySelector(`[data-density="${savedDensity}"]`);
    if (savedButton) {
        savedButton.click();
    }
}

// Create abundant floating flowers
function createFloatingFlowers() {
    const flowersContainer = document.createElement('div');
    flowersContainer.className = 'floating-flowers';
    document.body.appendChild(flowersContainer);

    const flowers = ['🌸', '🌺', '💮', '🏵️', '🌻', '🌼', '🌷', '🌹', '🥀', '💐', '🪷', '🪻'];
    
    // Create 30 flowers instead of 8
    for (let i = 0; i < 30; i++) {
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
    
    // Create 10 leaves
    for (let i = 0; i < 10; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 12 + 's';
        leavesContainer.appendChild(leaf);
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
    setupFlowerControls();
    createFloatingFlowers();
    createFloatingLeaves();
    checkExistingLogin();
    startMessageRefresh();
}

// Start the application
init();