// --- DOM Element Selectors ---
const passwordDisplay = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const copyText = document.getElementById('copy-text');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');

const generateBtn = document.getElementById('generate-btn');
const errorMessage = document.getElementById('error-message');
const strengthText = document.getElementById('strength-text');
const strengthBar = document.getElementById('strength-bar');

// --- Character Dictionary ---
const characterPools = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// --- Helper Functions ---

// Main logic
function generatePassword() {
    const length = +lengthSlider.value;
    let availableCharacters = '';
    
    // Build pool based on active checkboxes
    if (uppercaseEl.checked) availableCharacters += characterPools.uppercase;
    if (lowercaseEl.checked) availableCharacters += characterPools.lowercase;
    if (numbersEl.checked) availableCharacters += characterPools.numbers;
    if (symbolsEl.checked) availableCharacters += characterPools.symbols;

    // Validation: Require at least one pool configuration
    if (availableCharacters === '') {
        errorMessage.classList.remove('error-hidden');
        passwordDisplay.value = '';
        updateStrengthMeter(0);
        return;
    }
    
    errorMessage.classList.add('error-hidden');
    
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        generatedPassword += availableCharacters[randomIndex];
    }

    passwordDisplay.value = generatedPassword;
    calculateStrength(generatedPassword);
}

// Calculate strength based on entropy rules (length + pool distribution)
function calculateStrength(password) {
    let score = 0;
    if (!password) return updateStrengthMeter(score);

    // Criteria rules
    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    updateStrengthMeter(score);
}

// UI representation of password quality
function updateStrengthMeter(score) {
    // Mapping scores (0-6 scale) to states
    if (score === 0) {
        strengthText.innerText = 'None';
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'transparent';
    } else if (score <= 2) {
        strengthText.innerText = 'Weak';
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = '#ef4444'; // Red
    } else if (score <= 4) {
        strengthText.innerText = 'Medium';
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = '#f59e0b'; // Amber
    } else {
        strengthText.innerText = 'Strong';
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#10b981'; // Emerald Green
    }
}

// --- Event Listeners ---

// Track real-time slider changes
lengthSlider.addEventListener('input', (e) => {
    lengthVal.innerText = e.target.value;
    generatePassword(); // Enhancement: Auto-update on slider shift
});

// Explicit click configuration execution
generateBtn.addEventListener('click', generatePassword);

// Enhancement: Re-generate whenever checkboxes switch states
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

// Copy handling logic using modern Clipboard APIs
copyBtn.addEventListener('click', async () => {
    const password = passwordDisplay.value;
    
    if (!password) return;

    try {
        await navigator.clipboard.writeText(password);
        copyText.innerText = 'Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#ffffff';

        
        setTimeout(() => {
            copyText.innerText = 'Copy';
            copyBtn.style.background = '#38bdf8';
            copyBtn.style.color = '#0f172a';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
});

// Auto-run single execution cycle on initial boot up configuration
generatePassword(); 