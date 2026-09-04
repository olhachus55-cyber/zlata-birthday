// PASSWORD LOCK SYSTEM
const CORRECT_PASSWORD = '0509';
let passwordInput = '';

function addDigit(digit) {
    if (passwordInput.length < 4) {
        passwordInput += digit;
        updateDisplay();
    }
}

function deleteDigit() {
    passwordInput = passwordInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    const display = passwordInput.split('').map(() => '⏺').join(' ');
    document.getElementById('passwordDisplay').textContent = display || '⏺ ⏺ ⏺ ⏺';
    
    if (passwordInput.length === 4) {
        setTimeout(checkPassword, 300);
    }
}

function checkPassword() {
    if (passwordInput === CORRECT_PASSWORD) {
        unlockDevice();
    } else {
        shakeAnimation();
        passwordInput = '';
        updateDisplay();
    }
}

function shakeAnimation() {
    const lockScreen = document.getElementById('lockScreen');
    lockScreen.style.animation = 'shake 0.5s';
    setTimeout(() => {
        lockScreen.style.animation = '';
    }, 500);
}

function unlockDevice() {
    const lockScreen = document.getElementById('lockScreen');
    lockScreen.style.opacity = '0';
    setTimeout(() => {
        lockScreen.classList.add('hidden');
        document.getElementById('mainMenu').classList.add('active');
    }, 500);
}

// ADD SHAKE ANIMATION
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// PAGE NAVIGATION
function showPage(pageId) {
    // Hide all pages and menu
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('mainMenu').classList.remove('active');
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

function goToMenu() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('mainMenu').classList.add('active');
}

function goToAssociations() {
    showPage('associationsPage');
}

function goToGame() {
    showPage('gamePage');
}

function goToLetter() {
    showPage('letterPage');
}

// ASSOCIATIONS TEXT TOGGLE
function toggleText(button) {
    const hiddenText = button.nextElementSibling;
    const isVisible = hiddenText.classList.contains('visible');
    
    if (isVisible) {
        hiddenText.classList.remove('visible');
        button.textContent = 'Узнать больше →';
    } else {
        // Hide all other texts
        document.querySelectorAll('.hidden-text.visible').forEach(text => {
            text.classList.remove('visible');
            text.previousElementSibling.textContent = 'Узнать больше →';
        });
        
        // Show this text
        hiddenText.classList.add('visible');
        button.textContent = '← Скрыть';
    }
}

// CAKE GAME LOGIC
let cakeState = {
    base: null,
    cream: null,
    cooked: false,
    decoration: null
};

const baseColors = {
    'Ванильный': '#F5DEB3',
    'Шоколадный': '#8B4513',
    'Клубничный': '#FFB6C1'
};

const creamColors = {
    'Сливочный': '#FFF8DC',
    'Шоколадный': '#8B7355',
    'Ягодный': '#DDA0DD'
};

const decorations = {
    'Свечи': '🕯️',
    'Ягоды': '🫐',
    'Посыпка': '✨'
};

function selectBase(baseType) {
    cakeState.base = baseType;
    updateCakePreview();
    showLevel(2);
}

function selectCream(creamType) {
    cakeState.cream = creamType;
    updateCakePreview();
    showLevel(3);
}

function selectDecoration(decorType) {
    cakeState.decoration = decorType;
    updateCakePreview();
    showLevel(5);
}

function updateCakePreview() {
    const cakeBase = document.getElementById('cakeBase');
    const cakeCream = document.getElementById('cakeCream');
    const cakeDecoration = document.getElementById('cakeDecoration');

    if (cakeState.base) {
        cakeBase.textContent = cakeState.base;
        cakeBase.style.backgroundColor = baseColors[cakeState.base];
        cakeBase.style.color = cakeState.base === 'Шоколадный' ? 'white' : 'black';
    }

    if (cakeState.cream) {
        cakeCream.style.backgroundColor = creamColors[cakeState.cream];
    }

    if (cakeState.decoration) {
        cakeDecoration.textContent = decorations[cakeState.decoration];
    }
}

function showLevel(levelNumber) {
    for (let i = 1; i <= 5; i++) {
        const level = document.getElementById(`level${i}`);
        if (i === levelNumber) {
            level.classList.remove('hidden');
        } else if (i > levelNumber || i < levelNumber) {
            level.classList.add('hidden');
        }
    }
}

function cookCake() {
    const cookingProgress = document.getElementById('cookingProgress');
    const level3 = document.getElementById('level3');
    
    // Show progress
    cookingProgress.classList.remove('hidden');
    
    setTimeout(() => {
        cakeState.cooked = true;
        cookingProgress.classList.add('hidden');
        showLevel(4);
    }, 3000);
}

function blowCandles() {
    if (cakeState.base && cakeState.cream && cakeState.cooked && cakeState.decoration) {
        // Mark game as completed
        localStorage.setItem('gameCompleted', 'true');
        checkUnlockConditions();
        
        // Show celebration animation
        showCelebration();
        
        setTimeout(() => {
            goToMenu();
        }, 2000);
    }
}

function showCelebration() {
    const cake = document.getElementById('cakePreview');
    cake.innerHTML += '<div style="font-size: 60px; animation: bounce 1s;">🎉</div>';
}

// UNLOCK CONDITIONS
function checkUnlockConditions() {
    const associationsVisited = localStorage.getItem('allAssociationsViewed') === 'true';
    const gameCompleted = localStorage.getItem('gameCompleted') === 'true';
    
    if (associationsVisited && gameCompleted) {
        unlockLetter();
    }
}

function unlockLetter() {
    const letterBtn = document.getElementById('letterBtn');
    letterBtn.disabled = false;
    letterBtn.style.opacity = '1';
    letterBtn.style.cursor = 'pointer';
}

// TRACK ASSOCIATION VIEWS
function trackAssociationView() {
    const cards = document.querySelectorAll('.association-card');
    let viewedCount = 0;
    
    cards.forEach(card => {
        const text = card.querySelector('.hidden-text');
        if (text.classList.contains('visible')) {
            viewedCount++;
        }
    });
    
    if (viewedCount === cards.length) {
        localStorage.setItem('allAssociationsViewed', 'true');
        checkUnlockConditions();
    }
}

// Update toggleText to track views
const originalToggleText = toggleText;
toggleText = function(button) {
    originalToggleText(button);
    trackAssociationView();
};

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    // Check if letter should be unlocked on load
    checkUnlockConditions();
    
    // Add keyboard support for lock screen
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lockScreen').classList.contains('hidden')) {
            if (e.key >= '0' && e.key <= '9') {
                addDigit(e.key);
            } else if (e.key === 'Backspace') {
                deleteDigit();
            } else if (e.key === 'Enter') {
                checkPassword();
            }
        }
    });
});