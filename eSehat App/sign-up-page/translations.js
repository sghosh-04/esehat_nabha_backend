// translations.js - Multi-language support for e-Sehat Nabha
const translations = {
    en: {
        // App & Page
        "app_title": "e-Sehat",
        "create_account": "Create Your Account",
        "already_have_account": "Already have an account?",
        "log_in": "Log In",
        
        // Form Types
        "patient_signup": "Patient Sign Up",
        "doctor_signup": "Doctor Sign Up",
        
        // Sections
        "personal_info": "Personal Information",
        "professional_info": "Professional Information",
        "account_security": "Account Security",
        "additional_info": "Additional Information",
        "clinic_info": "Clinic Information",
        
        // Labels
        "full_name": "Full Name",
        "email_address": "Email Address",
        "mobile_number": "Mobile Number",
        "date_of_birth": "Date of Birth",
        "gender": "Gender",
        "password": "Password",
        "confirm_password": "Confirm Password",
        "address": "Address",
        "city": "City",
        "pincode": "Pincode",
        "specialization": "Specialization",
        "qualifications": "Qualifications",
        "license_number": "Medical License Number",
        "clinic_name": "Clinic/Hospital Name",
        "clinic_address": "Clinic Address",
        "experience": "Years of Experience",
        
        // Placeholders
        "enter_full_name": "Enter your full name",
        "enter_email": "Enter your email address",
        "enter_professional_email": "Enter your professional email",
        "enter_phone_number": "Enter your phone number",
        "create_password": "Create a password",
        "enter_address": "Enter your address",
        "enter_city": "Enter your city",
        "enter_pincode": "Enter pincode",
        "enter_qualifications": "Enter your qualifications",
        "enter_license_number": "Enter license number",
        "enter_clinic_name": "Enter clinic/hospital name",
        "enter_clinic_address": "Enter clinic address",
        "enter_experience": "Enter years of experience",
        
        // Options
        "select_gender": "Select Gender",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "select_specialization": "Select Specialization",
        "cardiology": "Cardiology",
        "neurology": "Neurology",
        "pediatrics": "Pediatrics",
        "orthopedics": "Orthopedics",
        "dermatology": "Dermatology",
        "gynecology": "Gynecology",
        "general_medicine": "General Medicine",
        
        // Terms
        "agree_terms": "I agree to the",
        "terms_of_service": "Terms of Service",
        "privacy_policy": "Privacy Policy",
        
        // Buttons
        "create_patient_account": "Create Patient Account",
        "create_doctor_account": "Create Doctor Account",
        
        // Password Strength
        "password_strength": "Password strength",
        "weak": "Weak",
        "medium": "Medium",
        "strong": "Strong",
        
        // Voice Control
        "voice_click_to_start": "Click to start voice command",
        "voice_listening": "Listening... Speak now",
        "voice_not_supported": "Voice recognition not supported",
        "voice_commands_guide": "Voice Commands Guide",
        "available_commands": "Available Voice Commands:",
        "form_navigation": "Form Navigation:",
        "patient_commands": "Patient Form Commands:",
        "doctor_commands": "Doctor Form Commands:",
        "general_commands": "General Commands:",
        
        // Voice Commands
        "command_switch_patient": "\"Switch to patient sign up\"",
        "command_switch_doctor": "\"Switch to doctor sign up\"",
        "command_next_field": "\"Next field\"",
        "command_previous_field": "\"Previous field\"",
        "command_enter_name": "\"Enter full name [name]\"",
        "command_enter_email": "\"Enter email [email]\"",
        "command_enter_mobile": "\"Enter mobile number [number]\"",
        "command_enter_dob": "\"Enter date of birth [date]\"",
        "command_select_gender": "\"Select gender [male/female/other]\"",
        "command_enter_password": "\"Enter password [password]\"",
        "command_enter_address": "\"Enter address [address]\"",
        "command_enter_city": "\"Enter city [city]\"",
        "command_enter_pincode": "\"Enter pincode [code]\"",
        "command_enter_doctor_name": "\"Enter doctor name [name]\"",
        "command_enter_doctor_email": "\"Enter doctor email [email]\"",
        "command_enter_doctor_phone": "\"Enter doctor phone [number]\"",
        "command_select_specialization": "\"Select specialization [specialization]\"",
        "command_enter_qualifications": "\"Enter qualifications [qualifications]\"",
        "command_enter_license": "\"Enter license number [number]\"",
        "command_enter_clinic_name": "\"Enter clinic name [name]\"",
        "command_enter_clinic_address": "\"Enter clinic address [address]\"",
        "command_enter_experience": "\"Enter experience [years]\"",
        "command_submit": "\"Submit form\"",
        "command_clear": "\"Clear form\"",
        "command_agree_terms": "\"Agree to terms\"",
        "command_show_password": "\"Show password\" / \"Hide password\"",
        "command_help": "\"Help\"",
        
        // Voice Command Descriptions
        "desc_switch_patient": "Switch to patient form",
        "desc_switch_doctor": "Switch to doctor form",
        "desc_next_field": "Move to next input field",
        "desc_previous_field": "Move to previous input field",
        "desc_enter_name": "Enter full name",
        "desc_enter_email": "Enter email address",
        "desc_enter_mobile": "Enter phone number",
        "desc_enter_dob": "Enter birth date",
        "desc_select_gender": "Select gender",
        "desc_enter_password": "Enter password",
        "desc_enter_address": "Enter address",
        "desc_enter_city": "Enter city",
        "desc_enter_pincode": "Enter pincode",
        "desc_enter_doctor_name": "Enter doctor name",
        "desc_enter_doctor_email": "Enter professional email",
        "desc_enter_doctor_phone": "Enter doctor phone",
        "desc_select_specialization": "Choose specialization",
        "desc_enter_qualifications": "Enter qualifications",
        "desc_enter_license": "Enter license number",
        "desc_enter_clinic_name": "Enter clinic name",
        "desc_enter_clinic_address": "Enter clinic address",
        "desc_enter_experience": "Enter years of experience",
        "desc_submit": "Submit the current form",
        "desc_clear": "Reset the current form",
        "desc_agree_terms": "Check terms and conditions",
        "desc_toggle_password": "Toggle password visibility",
        "desc_help": "Show this help dialog",
        
        // Validation Messages
        "validation_required": "This field is required",
        "validation_invalid_email": "Please enter a valid email address",
        "validation_invalid_phone": "Please enter a valid 10-digit phone number",
        "validation_password_mismatch": "Passwords do not match",
        "validation_password_weak": "Password is too weak",
        "validation_terms": "You must agree to the terms and conditions"
    },
    
    hi: {
        "app_title": "ई-स्वस्थ",
        "create_account": "अपना खाता बनाएं",
        "already_have_account": "पहले से ही एक खाता है?",
        "log_in": "लॉग इन",
        "patient_signup": "मरीज साइन अप",
        "doctor_signup": "डॉक्टर साइन अप",
        "personal_info": "व्यक्तिगत जानकारी",
        "professional_info": "पेशेवर जानकारी",
        "account_security": "खाता सुरक्षा",
        "additional_info": "अतिरिक्त जानकारी",
        "clinic_info": "क्लिनिक जानकारी",
        "full_name": "पूरा नाम",
        "email_address": "ईमेल पता",
        "mobile_number": "मोबाइल नंबर",
        "date_of_birth": "जन्म तिथि",
        "gender": "लिंग",
        "password": "पासवर्ड",
        "confirm_password": "पासवर्ड की पुष्टि करें",
        "address": "पता",
        "city": "शहर",
        "pincode": "पिनकोड",
        "specialization": "विशेषज्ञता",
        "qualifications": "योग्यताएं",
        "license_number": "मेडिकल लाइसेंस नंबर",
        "clinic_name": "क्लिनिक/अस्पताल का नाम",
        "clinic_address": "क्लिनिक का पता",
        "experience": "अनुभव के वर्ष"
    },
    
    pa: {
        "app_title": "ਈ-ਸਿਹਤ",
        "create_account": "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ",
        "already_have_account": "ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਖਾਤਾ ਹੈ?",
        "log_in": "ਲਾਗ ਇਨ",
        "patient_signup": "ਮਰੀਜ਼ ਸਾਈਨ ਅੱਪ",
        "doctor_signup": "ਡਾਕਟਰ ਸਾਈਨ ਅੱਪ",
        "personal_info": "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
        "professional_info": "ਪੇਸ਼ੇਵਰ ਜਾਣਕਾਰੀ",
        "account_security": "ਖਾਤਾ ਸੁਰੱਖਿਆ",
        "additional_info": "ਵਾਧੂ ਜਾਣਕਾਰੀ",
        "clinic_info": "ਕਲੀਨਿਕ ਜਾਣਕਾਰੀ",
        "full_name": "ਪੂਰਾ ਨਾਮ",
        "email_address": "ਈਮੇਲ ਪਤਾ",
        "mobile_number": "ਮੋਬਾਈਲ ਨੰਬਰ",
        "date_of_birth": "ਜਨਮ ਤਾਰੀਖ",
        "gender": "ਲਿੰਗ",
        "password": "ਪਾਸਵਰਡ",
        "confirm_password": "ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ ਕਰੋ",
        "address": "ਪਤਾ",
        "city": "ਸ਼ਹਿਰ",
        "pincode": "ਪਿੰਨਕੋਡ",
        "specialization": "ਵਿਸ਼ੇਸ਼ਤਾ",
        "qualifications": "ਕੁਆਲੀਫਿਕੇਸ਼ਨ",
        "license_number": "ਮੈਡੀਕਲ ਲਾਇਸੈਂਸ ਨੰਬਰ",
        "clinic_name": "ਕਲੀਨਿਕ/ਹਸਪਤਾਲ ਦਾ ਨਾਮ",
        "clinic_address": "ਕਲੀਨਿਕ ਦਾ ਪਤਾ",
        "experience": "ਅਨੁਭਵ ਦੇ ਸਾਲ"
    }
};

// Language management
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('languageSelect').value = lang;
    applyTranslations();
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Translate placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
    
    // Language selector event
    document.getElementById('languageSelect').addEventListener('change', function() {
        changeLanguage(this.value);
    });
});