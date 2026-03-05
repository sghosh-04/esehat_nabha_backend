document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        resetErrors();

        if (validateForm()) {
            submitForm();
        }
    });

    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');

    passwordField.addEventListener('input', validatePasswordStrength);
    confirmPasswordField.addEventListener('input', validatePasswordMatch);

    function validateForm() {
        let isValid = true;
        const fullName = document.getElementById('fullName').value.trim();
        if (fullName === '' || fullName.length < 2) {
            showError('fullNameError', 'Full name is required (min 2 chars)');
            isValid = false;
        }

        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            showError('phoneNumberError', 'Enter a valid 10-digit Indian phone number');
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailError', 'Enter a valid email');
            isValid = false;
        }

        const role = document.getElementById('role').value;
        if (!role) { showError('roleError', 'Select a role'); isValid = false; }

        const kioskLocation = document.getElementById('kioskLocation').value.trim();
        if (!kioskLocation) { showError('kioskLocationError', 'Enter kiosk location'); isValid = false; }

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password.length < 8) { showError('passwordError', 'Password min 8 chars'); isValid = false; }
        if (password !== confirmPassword) { showError('confirmPasswordError', 'Passwords do not match'); isValid = false; }

        if (!document.getElementById('terms').checked) {
            showError('termsError', 'You must accept terms'); isValid = false;
        }

        return isValid;
    }

    function showError(id, msg) {
        const el = document.getElementById(id);
        el.textContent = msg;
        el.style.display = 'block';
        const input = document.getElementById(id.replace('Error',''));
        if (input) input.style.borderColor = '#e74c3c';
    }

    function hideError(id) {
        const el = document.getElementById(id);
        el.style.display = 'none';
        const input = document.getElementById(id.replace('Error',''));
        if (input) input.style.borderColor = '#ddd';
    }

    function resetErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('input, select').forEach(el => el.style.borderColor = '#ddd');
    }

    function validatePasswordStrength() {
        const pw = document.getElementById('password').value;
        if (pw.length > 0 && pw.length < 8) showError('passwordError','Password min 8 chars');
        else hideError('passwordError');
    }

    function validatePasswordMatch() {
        const pw = document.getElementById('password').value;
        const cpw = document.getElementById('confirmPassword').value;
        if (cpw.length > 0 && pw !== cpw) showError('confirmPasswordError','Passwords do not match');
        else hideError('confirmPasswordError');
    }

    function submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('fullName').value,
            contact_number: document.getElementById('phoneNumber').value,
            email_address: document.getElementById('email').value,
            role: document.getElementById('role').value,
            address: document.getElementById('kioskLocation').value,
            password: document.getElementById('password').value
        };


        fetch('http://localhost:5004/api/kiosks/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = '../home-page/kiosk-login.html';
            } else {
                alert(data.message || 'Registration failed.');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Server error. Try again later.');
        })
        .finally(() => {
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
        });
    }
});
