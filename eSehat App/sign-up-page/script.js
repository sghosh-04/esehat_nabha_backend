// ------------------- Global Error Handlers -------------------
window.addEventListener("error", function (e) {
  alert("❌ JS Error: " + e.message);
  console.error("❌ Global JS error:", e);
});

window.addEventListener("unhandledrejection", function (e) {
  alert("❌ Promise error: " + e.reason);
  console.error("❌ Unhandled Promise:", e);
});

// ------------------- DOMContentLoaded -------------------
document.addEventListener('DOMContentLoaded', function() {
    // Toggle between patient and doctor forms
    const viewToggle = document.getElementById('viewToggle');
    const patientOption = document.querySelector('.patient-option');
    const doctorOption = document.querySelector('.doctor-option');
    const patientForm = document.getElementById('patientForm');
    const doctorForm = document.getElementById('doctorForm');

    // Toggle form view based on switch
    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            patientForm.classList.remove('active');
            doctorForm.classList.add('active');
            patientOption.classList.remove('active');
            doctorOption.classList.add('active');
        } else {
            doctorForm.classList.remove('active');
            patientForm.classList.add('active');
            doctorOption.classList.remove('active');
            patientOption.classList.add('active');
        }
    });

    // Allow clicking on options to toggle
    patientOption.addEventListener('click', function() {
        viewToggle.checked = false;
        viewToggle.dispatchEvent(new Event('change'));
    });
    doctorOption.addEventListener('click', function() {
        viewToggle.checked = true;
        viewToggle.dispatchEvent(new Event('change'));
    });

    // Password visibility toggles
    setupPasswordToggle('toggleDoctorPassword', 'doctorPassword');
    setupPasswordToggle('toggleConfirmDoctorPassword', 'confirmDoctorPassword');

    // Password strength meter
    setupPasswordStrengthMeter('doctorPassword', 'doctorPasswordStrength');

    // Form validation
    setupFormValidation('patientForm', validatePatientForm);
    setupFormValidation('doctorForm', validateDoctorForm);

    // Input formatting
    setupInputFormatting();
});

// ------------------- Password Toggle -------------------
function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.addEventListener('click', function() {
            const passwordInput = document.getElementById(inputId);
            if (!passwordInput) return;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
}

// ------------------- Password Strength Meter -------------------
function setupPasswordStrengthMeter(passwordId, strengthMeterId) {
    const passwordInput = document.getElementById(passwordId);
    const strengthMeter = document.getElementById(strengthMeterId);
    if (!passwordInput || !strengthMeter) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = strengthMeter.querySelector('.strength-bar');
        const strengthText = strengthMeter.querySelector('.strength-text');

        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;

        strengthBar.style.width = strength + '%';
        if (strength < 40) {
            strengthBar.style.backgroundColor = '#e03131';
            strengthText.textContent = 'Weak';
        } else if (strength < 80) {
            strengthBar.style.backgroundColor = '#fcc419';
            strengthText.textContent = 'Medium';
        } else {
            strengthBar.style.backgroundColor = '#2f9e44';
            strengthText.textContent = 'Strong';
        }
    });
}

// ------------------- Form Validation Setup -------------------
function setupFormValidation(formId, validationFunction) {
    const form = document.getElementById(formId);
    if (form) form.addEventListener('submit', validationFunction);
}

// ------------------- Input Formatting -------------------
function setupInputFormatting() {
    // Mobile inputs
    const mobileInputs = [document.getElementById("mobile"), document.getElementById("doctorPhone")];
    mobileInputs.forEach(input => {
        if (input) {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/\D/g, "").slice(0, 10);
            });
        }
    });

    // Pincode
    const pincode = document.getElementById("pincode");
    if (pincode) {
        pincode.addEventListener("input", () => {
            pincode.value = pincode.value.replace(/\D/g, "").slice(0, 6);
        });
    }

    // Experience
    const experience = document.getElementById("experience");
    if (experience) {
        experience.addEventListener("input", () => {
            experience.value = experience.value.replace(/\D/g, "").slice(0, 2);
        });
    }
}

// ------------------- Patient Signup -------------------
function validatePatientForm(event) {
    event.preventDefault();
    let isValid = true;
    const errors = document.querySelectorAll('#patientForm .error-message');
    errors.forEach(e => e.textContent = '');

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const terms = document.getElementById('patientTerms');

    if (!fullName) { document.getElementById('nameError').textContent = 'Full name is required'; isValid = false; }
    if (!email) { document.getElementById('emailError').textContent = 'Email is required'; isValid = false; }
    if (!mobile.match(/^[0-9]{10}$/)) { document.getElementById('mobileError').textContent = 'Enter valid 10-digit mobile'; isValid = false; }
    if (!dob) { document.getElementById('dobError').textContent = 'Date of birth is required'; isValid = false; }
    if (!gender) { document.getElementById('genderError').textContent = 'Select gender'; isValid = false; }
    if (!terms.checked) { document.getElementById('termsError').textContent = 'Accept terms'; isValid = false; }

    if (!isValid) return false;

    const patientData = { fullName, email: email || null, mobile, dob, gender, address: address || null, city: city || null, pincode: pincode || null };

    fetch("http://localhost:5004/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("🎉 Patient registered successfully!");
            document.getElementById('patientForm').reset();
        } else {
            alert(`❌ Signup failed: ${data.error || data.message}`);
        }
    })
    .catch(err => console.error("Patient signup error:", err));
}

// ------------------- Doctor Signup -------------------
function validateDoctorForm(event) {
    event.preventDefault();
    let isValid = true;
    const errors = document.querySelectorAll('#doctorForm .error-message');
    errors.forEach(e => e.textContent = '');

    const name = document.getElementById('doctorName').value.trim();
    const email = document.getElementById('doctorEmail').value.trim();
    const phonenumber = document.getElementById('doctorPhone').value.trim();
    const specialization = document.getElementById('specialization').value.trim();
    const qualifications = document.getElementById('qualifications').value.trim();
    const license_number = document.getElementById('license_number').value.trim();
    const clinic_name = document.getElementById('clinic_name').value.trim();
    const clinic_address = document.getElementById('clinic_address').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const password = document.getElementById('doctorPassword').value;
    const confirmPassword = document.getElementById('confirmDoctorPassword').value;
    const terms = document.getElementById('doctorTerms');

    if (!name) { document.getElementById('doctorNameError').textContent = 'Full name required'; isValid = false; }
    if (!phonenumber.match(/^[0-9]{10}$/)) { document.getElementById('doctorPhoneError').textContent = 'Enter valid 10-digit phone'; isValid = false; }
    if (!email) { document.getElementById('doctorEmailError').textContent = 'Email required'; isValid = false; }
    if (!specialization) { document.getElementById('specializationError').textContent = 'Specialization required'; isValid = false; }
    if (!qualifications) { document.getElementById('qualificationError').textContent = 'Qualifications required'; isValid = false; }
    if (!license_number) { document.getElementById('licenseError').textContent = 'License number required'; isValid = false; }
    if (!clinic_name) { document.getElementById('clinicError').textContent = 'Clinic name required'; isValid = false; }
    if (!clinic_address) { document.getElementById('clinicAddressError').textContent = 'Clinic address required'; isValid = false; }
    if (!terms.checked) { document.getElementById('doctorTermsError').textContent = 'Accept terms'; isValid = false; }
    if (password.length < 8) { document.getElementById('doctorPasswordError').textContent = 'Password min 8 chars'; isValid = false; }
    if (password !== confirmPassword) { document.getElementById('confirmDoctorPasswordError').textContent = 'Passwords do not match'; isValid = false; }

    if (!isValid) return false;

    const payload = { name, email, phonenumber, specialization, qualifications, license_number, clinic_name, clinic_address, experience, password };

    fetch("http://localhost:5004/api/doctors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success || data.message === "Doctor registered successfully") {
            alert("🎉 Doctor registered successfully!");
            document.getElementById('doctorForm').reset();
        } else {
            alert(`❌ Signup failed: ${data.error || data.message}`);
        }
    })
    .catch(err => console.error("Doctor signup error:", err));
}

