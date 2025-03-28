// DOM Elements
const passwordInput = document.getElementById('password');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBars = document.querySelectorAll('.bar');
const strengthText = document.querySelector('.strength-text');

// Character sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Feedback System
const stars = document.querySelectorAll('.stars i');
const feedbackText = document.getElementById('feedback-text');
const submitFeedbackBtn = document.getElementById('submit-feedback');
const feedbackContainer = document.getElementById('feedback-container');

let selectedRating = 0;

// Update length value display
lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
    updateStrengthMeter();
});

// Checkbox change handler
[uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', updateStrengthMeter);
});

// Calculate password strength
function calculateStrength(password) {
    let strength = 0;
    
    // Length contribution (up to 25 points)
    strength += Math.min(password.length * 2, 25);
    
    // Character type contribution
    if (password.match(/[A-Z]/)) strength += 10;
    if (password.match(/[a-z]/)) strength += 10;
    if (password.match(/[0-9]/)) strength += 10;
    if (password.match(/[^A-Za-z0-9]/)) strength += 15;
    
    // Deduct points for common patterns
    if (password.match(/^[A-Za-z]+$/) || password.match(/^[0-9]+$/)) strength -= 10;
    if (password.match(/^[A-Z]+$/) || password.match(/^[a-z]+$/)) strength -= 5;
    
    return Math.max(0, Math.min(100, strength));
}

// Update strength meter
function updateStrengthMeter() {
    const password = passwordInput.value;
    const strength = calculateStrength(password);
    
    // Update strength bars
    strengthBars.forEach((bar, index) => {
        const threshold = (index + 1) * 25;
        if (strength >= threshold) {
            bar.style.background = getStrengthColor(strength);
        } else {
            bar.style.background = '#e2e8f0';
        }
    });
    
    // Update strength text
    strengthText.textContent = getStrengthText(strength);
    strengthText.style.color = getStrengthColor(strength);
}

// Get strength color
function getStrengthColor(strength) {
    if (strength < 25) return '#ef4444'; // Red
    if (strength < 50) return '#f59e0b'; // Orange
    if (strength < 75) return '#10b981'; // Green
    return '#059669'; // Dark Green
}

// Get strength text
function getStrengthText(strength) {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Strong';
    return 'Very Strong';
}

// Generate password function
function generatePassword() {
    let chars = '';
    let password = '';
    
    // Build character set based on selected options
    if (uppercaseCheckbox.checked) chars += uppercaseChars;
    if (lowercaseCheckbox.checked) chars += lowercaseChars;
    if (numbersCheckbox.checked) chars += numberChars;
    if (symbolsCheckbox.checked) chars += symbolChars;
    
    // If no options are selected, use all characters
    if (!chars) {
        chars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
    }
    
    // Generate password
    const length = parseInt(lengthInput.value);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    
    return password;
}

// Generate button click handler
generateBtn.addEventListener('click', () => {
    const password = generatePassword();
    passwordInput.value = password;
    updateStrengthMeter();
    
    // Add animation to generate button
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        generateBtn.style.transform = 'scale(1)';
    }, 100);
});

// Copy button click handler
copyBtn.addEventListener('click', () => {
    if (passwordInput.value) {
        passwordInput.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalColor = copyBtn.style.color;
        copyBtn.style.color = '#10b981';
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            copyBtn.style.color = originalColor;
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
    }
});

// Star rating functionality
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = parseInt(star.dataset.rating);
        highlightStars(rating);
    });
    
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        highlightStars(selectedRating);
    });
});

// Reset stars when mouse leaves the container
document.querySelector('.stars').addEventListener('mouseleave', () => {
    highlightStars(selectedRating);
});

function highlightStars(rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit feedback
submitFeedbackBtn.addEventListener('click', () => {
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const feedback = feedbackText.value.trim();
    if (!feedback) {
        alert('Please enter your feedback');
        return;
    }
    
    // Create feedback object
    const feedbackObj = {
        rating: selectedRating,
        text: feedback,
        date: new Date().toLocaleDateString(),
        id: Date.now()
    };
    
    // Add feedback to the list
    addFeedbackToList(feedbackObj);
    
    // Clear form
    feedbackText.value = '';
    selectedRating = 0;
    highlightStars(0);
    
    // Show success message
    showSuccessMessage();
});

function addFeedbackToList(feedback) {
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'feedback-item';
    feedbackElement.dataset.id = feedback.id;
    feedbackElement.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-rating">
                ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}
            </div>
            <div class="feedback-actions">
                <div class="feedback-date">${feedback.date}</div>
                <button class="delete-feedback" title="Delete feedback">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        <div class="feedback-content">${feedback.text}</div>
    `;
    
    // Add delete button functionality
    const deleteBtn = feedbackElement.querySelector('.delete-feedback');
    deleteBtn.addEventListener('click', () => {
        // Add fade out animation
        feedbackElement.style.opacity = '0';
        feedbackElement.style.transform = 'translateX(20px)';
        
        // Remove the element after animation
        setTimeout(() => {
            feedbackElement.remove();
        }, 300);
    });
    
    // Add to the beginning of the list
    feedbackContainer.insertBefore(feedbackElement, feedbackContainer.firstChild);
    
    // Limit to 5 feedback items
    if (feedbackContainer.children.length > 5) {
        feedbackContainer.removeChild(feedbackContainer.lastChild);
    }
}

function showSuccessMessage() {
    submitFeedbackBtn.textContent = 'Thank you!';
    submitFeedbackBtn.style.background = '#10b981';
    
    setTimeout(() => {
        submitFeedbackBtn.textContent = 'Submit Feedback';
        submitFeedbackBtn.style.background = '#667eea';
    }, 2000);
}

// Generate initial password
generateBtn.click(); 