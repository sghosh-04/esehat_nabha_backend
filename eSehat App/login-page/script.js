const backendUrl = "http://localhost:5004";

document.addEventListener('DOMContentLoaded', function() {
    // Toggle between patient and doctor login
    const viewToggle = document.getElementById('viewToggle');
    const patientOption = document.querySelector('.patient-option');
    const doctorOption = document.querySelector('.doctor-option');
    const patientForm = document.querySelector('.patient-form');
    const doctorForm = document.querySelector('.doctor-form');

    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            patientOption.classList.remove('active');
            doctorOption.classList.add('active');
            patientForm.classList.remove('active');
            doctorForm.classList.add('active');
        } else {
            patientOption.classList.add('active');
            doctorOption.classList.remove('active');
            patientForm.classList.add('active');
            doctorForm.classList.remove('active');
        }
    });

    // Toggle password visibility for doctor login
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});

    // Patient OTP functionality
    const mobileInput = document.getElementById('mobile');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const backToMobile = document.getElementById('backToMobile');
    const resendOtp = document.getElementById('resendOtp');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const mobileSection = document.querySelector('.mobile-section');
    const otpSection = document.querySelector('.otp-section');
    const mobileNumberDisplay = document.getElementById('mobileNumberDisplay');
    const countdownElement = document.getElementById('countdown');
    const otpInput = document.getElementById('otp');

    let countdown;
    let otpSent = false;
    let userId = null;

    // Countdown timer
    function startCountdown(duration) {
        let timer = duration, minutes, seconds;
        clearInterval(countdown);

        countdown = setInterval(function() {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            countdownElement.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(countdown);
                countdownElement.textContent = "00:00";
                resendOtp.style.pointerEvents = 'auto';
                resendOtp.style.opacity = '1';
            }
        }, 1000);
    }

    // Send OTP
    sendOtpBtn.addEventListener('click', function() {
        const mobileNumber = mobileInput.value.trim();

        if (!mobileNumber || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending OTP...';

        fetch(`${backendUrl}/api/auth/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: mobileNumber })
        })
        .then(res => res.json())
        .then(data => {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';

            if (data.success) {
                otpSent = true;
                userId = data.data.userId;

                mobileNumberDisplay.textContent = mobileNumber;
                mobileSection.classList.remove('active');
                otpSection.classList.add('active');

                startCountdown(60);
                resendOtp.style.pointerEvents = 'none';
                resendOtp.style.opacity = '0.5';
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            console.error(err);
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
            alert('Failed to send OTP. Try again.');
        });
    });

    // Back to mobile input
    backToMobile.addEventListener('click', function() {
        otpSection.classList.remove('active');
        mobileSection.classList.add('active');
        clearInterval(countdown);
    });

    // Resend OTP
    resendOtp.addEventListener('click', function(e) {
        e.preventDefault();
        if (!otpSent) return;

        const mobileNumber = mobileInput.value.trim();

        fetch(`${backendUrl}/api/auth/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: mobileNumber })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                startCountdown(60);
                resendOtp.style.pointerEvents = 'none';
                resendOtp.style.opacity = '0.5';
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
    });

    // Verify OTP
    verifyOtpBtn.addEventListener('click', function() {
        const enteredOtp = otpInput.value.trim();

        if (!enteredOtp || enteredOtp.length !== 6) {
            alert('Please enter the 6-digit verification code');
            return;
        }

        fetch(`${backendUrl}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, enteredOTP: enteredOtp })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
            alert('OTP verified successfully! Redirecting...');

            // ✅ Save patient data locally
            localStorage.setItem("patientPhone", mobileInput.value.trim());
            localStorage.setItem("patientUserId", userId);

            // Redirect to patient dashboard
            window.location.href = '../login-page/dashboard.html';
        } else {
            alert(data.message);
        }

        })
        .catch(err => console.error(err));
    });





    

    // Doctor login
    /*const doctorLoginBtn = document.getElementById('doctorLoginBtn');
    if (doctorLoginBtn) {
        doctorLoginBtn.addEventListener('click', function() {
            const doctorId = document.getElementById('doctorId').value.trim();
            const password = document.getElementById('password').value;

            if (!doctorId) {
                alert('Please enter your Doctor ID');
                return;
            }

            if (!password) {
                alert('Please enter your password');
                return;
            }

            alert('Doctor login functionality would be implemented here');
        });
    }
});*/


// Forgot Password Functionality
const forgotPasswordLink = document.querySelector('.forgot');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeModal = document.querySelector('.close');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthProgress = document.querySelector('.strength-progress');
const strengthValue = document.getElementById('strengthValue');
const passwordMatch = document.getElementById('passwordMatch');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

// Open modal when Forgot Password is clicked
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
    });
}

// Close modal when X is clicked
if (closeModal) {
    closeModal.addEventListener('click', function() {
        forgotPasswordModal.style.display = 'none';
    });
}

// Close modal when clicking outside the modal
window.addEventListener('click', function(e) {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
});

// Password strength meter
if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthProgress.style.width = strength.percentage + '%';
        strengthProgress.style.backgroundColor = strength.color;
        
        // Update strength text
        strengthValue.textContent = strength.value;
        strengthValue.style.color = strength.color;
    });
}

// Check password match
if (confirmPasswordInput && newPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
        const password = newPasswordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword === '') {
            passwordMatch.textContent = '';
            passwordMatch.style.color = '';
        } else if (password === confirmPassword) {
            passwordMatch.textContent = 'Passwords match';
            passwordMatch.style.color = '#4CAF50';
        } else {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.style.color = '#F44336';
        }
    });
}

// Reset password button
if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener('click', function() {
        const email = document.getElementById('doctorEmail').value;
        const doctorId = document.getElementById('doctorIdForgot').value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Basic validation
        if (!email || !doctorId || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real application, you would send this data to the server
        console.log('Password reset request:', { email, doctorId, newPassword });
        alert('Password reset instructions have been sent to your email if the account exists.');
        
        // Close the modal
        forgotPasswordModal.style.display = 'none';
        
        // Clear the form
        document.getElementById('doctorEmail').value = '';
        document.getElementById('doctorIdForgot').value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        strengthProgress.style.width = '0';
        strengthValue.textContent = 'None';
        passwordMatch.textContent = '';
    });
}

// Password strength calculation function
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length > 0) {
        // Length check
        if (password.length > 7) strength += 1;
        
        // Contains both uppercase and lowercase
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
        
        // Contains numbers
        if (password.match(/([0-9])/)) strength += 1;
        
        // Contains special characters
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)) strength += 1;
    }
    
    // Determine strength value and color
    let value, color, percentage;
    
    switch(strength) {
        case 0:
            value = "None";
            color = "#F44336";
            percentage = 0;
            break;
        case 1:
            value = "Weak";
            color = "#F44336";
            percentage = 25;
            break;
        case 2:
            value = "Medium";
            color = "#FF9800";
            percentage = 50;
            break;
        case 3:
            value = "Strong";
            color = "#4CAF50";
            percentage = 75;
            break;
        case 4:
            value = "Very Strong";
            color = "#2E7D32";
            percentage = 100;
            break;
    }
    
    return { value, color, percentage };
}

// Add toggle password functionality to new password fields
document.querySelectorAll('#newPassword + .toggle-password, #confirmPassword + .toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});



// Doctor login
const doctorLoginBtn = document.getElementById('doctorLoginBtn');
if (doctorLoginBtn) {
    doctorLoginBtn.addEventListener('click', function() {
        const licenseNumber = document.getElementById('doctorId').value.trim(); // License Number as ID
        const password = document.getElementById('password').value; // Same password field (with toggle)

        if (!licenseNumber) {
            alert('Please enter your License Number');
            return;
        }

        if (!password) {
            alert('Please enter your password');
            return;
        }

        // ✅ Login API call
        fetch(`http://localhost:5004/api/doctors/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ license_number: licenseNumber, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("doctorToken", data.token);
                localStorage.setItem("doctorId", data.doctor.id);
                localStorage.setItem("doctorName", data.doctor.name);
                localStorage.setItem("doctorLicense", data.doctor.license_number); // <-- add this

                alert("🎉 Login successful!");
                window.location.href = "doctor-dashboard.html";
            }       
            else {
                alert(data.message || "❌ Login failed");
            }
        })
        .catch(err => {
            console.error("Doctor login error:", err);
            alert("⚠️ Server error. Please try again.");
        });
    });
}

// Voice command functionality
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');

if (voiceBtn) {
    let recognition;
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = 'Listening...';
        };
        
        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(command);
        };
        
        recognition.onerror = function(event) {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Error: ' + event.error;
        };
        
        recognition.onend = function() {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Click to start voice command';
        };
        
        voiceBtn.addEventListener('click', function() {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        voiceStatus.textContent = 'Voice commands not supported';
        voiceBtn.disabled = true;
    }
}

// Process voice commands
function processVoiceCommand(command) {
    console.log('Voice command:', command);
    
    // Simple command processing
    if (command.includes('enter mobile number')) {
        const number = command.replace('enter mobile number', '').trim();
        document.getElementById('mobile').value = number;
    } else if (command.includes('send otp')) {
        document.getElementById('sendOtpBtn').click();
    } else if (command.includes('enter otp')) {
        const otp = command.replace('enter otp', '').trim();
        document.getElementById('otp').value = otp;
    } else if (command.includes('verify otp')) {
        document.getElementById('verifyOtpBtn').click();
    } else if (command.includes('switch to doctor login')) {
        document.getElementById('viewToggle').checked = true;
        document.getElementById('viewToggle').dispatchEvent(new Event('change'));
    } else if (command.includes('switch to patient login')) {
        document.getElementById('viewToggle').checked = false;
        document.getElementById('viewToggle').dispatchEvent(new Event('change'));
    } else if (command.includes('enter doctor id')) {
        const id = command.replace('enter doctor id', '').trim();
        document.getElementById('doctorId').value = id;
    } else if (command.includes('enter password')) {
        const password = command.replace('enter password', '').trim();
        document.getElementById('password').value = password;
    } else if (command.includes('login')) {
        document.getElementById('doctorLoginBtn').click();
    } else if (command.includes('back')) {
        document.getElementById('backToMobile').click();
    } else if (command.includes('help')) {
        // Show help modal
        document.getElementById('voiceHelpModal').style.display = 'block';
    }
}

// Close voice help modal
const voiceHelpModal = document.getElementById('voiceHelpModal');
if (voiceHelpModal) {
    const closeVoiceHelp = voiceHelpModal.querySelector('.close');
    closeVoiceHelp.addEventListener('click', function() {
        voiceHelpModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === voiceHelpModal) {
            voiceHelpModal.style.display = 'none';
        }
    });
}


