// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load user settings
    loadUserSettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize components
    initializeComponents();
});

// Load user settings from localStorage
function loadUserSettings() {
    const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    
    // Apply theme if set
    if (userSettings.theme) {
        applyTheme(userSettings.theme);
        document.querySelector(`.theme-option[data-theme="${userSettings.theme}"]`).classList.add('active');
    }
    
    // Apply font size if set
    if (userSettings.fontSize) {
        applyFontSize(userSettings.fontSize);
        document.querySelector(`.font-option[data-size="${userSettings.fontSize}"]`).classList.add('active');
    }
    
    // Apply language if set
    if (userSettings.language) {
        document.getElementById('languageSelect').value = userSettings.language;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Settings menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('data-target');
            showSettingsSection(targetId);
        });
    });
    
    // Save profile button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfileSettings);
    }
    
    // Change password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }
    
    // Delete account button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', openDeleteModal);
    }
    
    // Cancel delete button
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteAccount);
    }
    
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Delete account confirmation input
    const deleteConfirmInput = document.getElementById('deleteConfirm');
    if (deleteConfirmInput) {
        deleteConfirmInput.addEventListener('input', function() {
            const confirmText = document.querySelector('.confirm-text').textContent;
            const confirmDeleteBtn = document.getElementById('confirmDelete');
            confirmDeleteBtn.disabled = this.value !== confirmText;
        });
    }
    
    // Theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            themeOptions.forEach(o => o.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Apply theme
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            
            // Save theme preference
            saveSetting('theme', theme);
        });
    });
    
    // Font size options
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            fontOptions.forEach(o => o.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Apply font size
            const fontSize = this.getAttribute('data-size');
            applyFontSize(fontSize);
            
            // Save font size preference
            saveSetting('fontSize', fontSize);
        });
    });
    
    // Language select
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            saveSetting('language', this.value);
            alert('Language preference saved. Page will refresh to apply changes.');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
    
    // FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });
    
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Password strength check
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // Password match check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    // Close modals if clicked outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
}

// Initialize components
function initializeComponents() {
    // Check password match on page load
    checkPasswordMatch();
    
    // Check password strength on page load
    checkPasswordStrength();
}

// Show settings section
function showSettingsSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// Apply theme
function applyTheme(theme) {
    // Remove existing theme classes
    document.body.classList.remove('light-theme', 'dark-theme');
    
    // Apply selected theme
    if (theme !== 'default') {
        document.body.classList.add(`${theme}-theme`);
    }
}

// Apply font size
function applyFontSize(size) {
    // Remove existing font size classes
    document.body.classList.remove('small-text', 'medium-text', 'large-text');
    
    // Apply selected font size
    if (size !== 'medium') {
        document.body.classList.add(`${size}-text`);
    }
}

// Save setting to localStorage
function saveSetting(key, value) {
    const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    userSettings[key] = value;
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// Save profile settings
function saveProfileSettings() {
    // Get form values
    const profileData = {
        name: document.getElementById('settingsName').value,
        email: document.getElementById('settingsEmail').value,
        phone: document.getElementById('settingsPhone').value,
        dob: document.getElementById('settingsDob').value,
        gender: document.getElementById('settingsGender').value,
        bloodGroup: document.getElementById('settingsBlood').value,
        address: document.getElementById('settingsAddress').value
    };
    
    // In a real app, this would be an API call
    console.log('Saving profile data:', profileData);
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Update user data in localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    Object.assign(userData, profileData);
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // In a real app, this would be an API call
    console.log('Changing password...');
    
    // Show success message
    alert('Password changed successfully!');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.querySelector('.strength-progress');
    const strengthText = document.getElementById('strengthValue');
    
    // Calculate password strength
    let strength = 0;
    let tips = "";
    
    // Check password length
    if (password.length < 8) {
        tips += "Make the password at least 8 characters. ";
    } else {
        strength += 1;
    }
    
    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
    } else {
        tips += "Use both lowercase and uppercase letters. ";
    }
    
    // Check for numbers
    if (password.match(/\d/)) {
        strength += 1;
    } else {
        tips += "Include at least one number. ";
    }
    
    // Check for special characters
    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
    } else {
        tips += "Include at least one special character. ";
    }
    
    // Update strength bar and text
    let strengthValue = '';
    let width = 0;
    let color = '';
    
    switch(strength) {
        case 0:
            strengthValue = 'Very Weak';
            width = 20;
            color = '#e74c3c';
            break;
        case 1:
            strengthValue = 'Weak';
            width = 40;
            color = '#e67e22';
            break;
        case 2:
            strengthValue = 'Fair';
            width = 60;
            color = '#f1c40f';
            break;
        case 3:
            strengthValue = 'Good';
            width = 80;
            color = '#2ecc71';
            break;
        case 4:
            strengthValue = 'Strong';
            width = 100;
            color = '#27ae60';
            break;
    }
    
    strengthBar.style.width = `${width}%`;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = strengthValue;
    strengthText.style.color = color;
}

// Check password match
function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchElement = document.getElementById('passwordMatch');
    
    if (!newPassword || !confirmPassword) {
        matchElement.textContent = '';
        return;
    }
    
    if (newPassword === confirmPassword) {
        matchElement.textContent = 'Passwords match';
        matchElement.style.color = '#27ae60';
    } else {
        matchElement.textContent = 'Passwords do not match';
        matchElement.style.color = '#e74c3c';
    }
}

// Open delete account modal
function openDeleteModal() {
    document.getElementById('deleteAccountModal').style.display = 'flex';
}

// Close delete account modal
function closeDeleteModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
    document.getElementById('deleteConfirm').value = '';
    document.getElementById('confirmDelete').disabled = true;
}

// Delete account
function deleteAccount() {
    // In a real app, this would be an API call
    console.log('Deleting account...');
    
    // Show confirmation message
    alert('Your account has been deleted successfully.');
    
    // Redirect to home page
    window.location.href = '../index.html';
    
    // Clear localStorage
    localStorage.clear();
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
}