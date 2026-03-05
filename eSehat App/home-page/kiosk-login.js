document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordField = document.getElementById('password');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const emailField = document.getElementById('email');

    const API_BASE_URL = 'http://localhost:5004/api';

    // ---------------- Password Toggle ----------------
    passwordToggle.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        const eyeIcon = this.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });

    // ---------------- Form Submit ----------------
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        resetErrors();
        if (validateForm()) submitLogin();
    });

    emailField.addEventListener('blur', validateEmail);
    passwordField.addEventListener('blur', validatePassword);

    // ---------------- Validation ----------------
    function validateForm() {
        return validateEmail() && validatePassword();
    }

    function validateEmail() {
        const email = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showError('emailError', 'Email address is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            return false;
        }
        hideError('emailError');
        return true;
    }

    function validatePassword() {
        const password = passwordField.value;
        if (!password) {
            showError('passwordError', 'Password is required');
            return false;
        }
        if (password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long');
            return false;
        }
        hideError('passwordError');
        return true;
    }

    function showError(id, message) {
        const el = document.getElementById(id);
        el.textContent = message;
        el.style.display = 'block';
    }

    function hideError(id) {
        const el = document.getElementById(id);
        el.style.display = 'none';
    }

    function resetErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    }

    // ---------------- REAL LOGIN ----------------
    async function submitLogin() {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/kiosks/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailField.value.trim(),
                    password: passwordField.value
                })
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Store kiosk session
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userData', JSON.stringify(data.data.user));
            localStorage.setItem('kioskId', data.data.user.kiosk_code);
            localStorage.setItem('kioskName', data.data.user.kiosk_name);
            localStorage.setItem('kioskLocation', data.data.user.kiosk_location);

            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('kioskRememberMe', 'true');
                localStorage.setItem('kioskUserEmail', emailField.value.trim());
            }

            showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'kiosk-dashboard.html';
            }, 1000);

        } catch (err) {
            showNotification(err.message || 'Login failed', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    // ---------------- Notification ----------------
    function showNotification(message, type) {
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 4000);
    }

    // ---------------- Remember Me ----------------
    function checkRememberedLogin() {
        if (localStorage.getItem('kioskRememberMe') === 'true') {
            const savedEmail = localStorage.getItem('kioskUserEmail');
            if (savedEmail) {
                emailField.value = savedEmail;
                document.getElementById('rememberMe').checked = true;
            }
        }
    }

    checkRememberedLogin();
});
