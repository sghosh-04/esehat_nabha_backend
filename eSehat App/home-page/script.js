// Main JavaScript for e-Schat Nabha Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main Initialization Function
function initializeApp() {
    initializeMobileMenu();
    initializeAmbulanceButton(); // Added ambulance button functionality
    initializeSmoothScrolling();
    initializeAuthButtons();
    initializeKioskButton();
    initializeAnimations();
    initializeLanguageSupport();
    initializeServiceCards();
    initializeTestimonials();
    initializeDownloadButtons();
}

// Mobile Menu Functionality
// Mobile Menu Functionality - Updated
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const headerActions = document.querySelector('.header-actions');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Create mobile menu if it doesn't exist
            if (!mobileNav) {
                createMobileMenu();
            } else {
                mobileNav.classList.toggle('active');
            }
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNav && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function createMobileMenu() {
    const header = document.querySelector('.main-header');
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Clone navigation
    if (mainNav) {
        const navClone = mainNav.cloneNode(true);
        navClone.classList.add('mobile-nav-menu');
        mobileNav.appendChild(navClone);
    }
    
    // Clone auth buttons
    if (headerActions) {
        const actionsClone = headerActions.cloneNode(true);
        actionsClone.classList.add('mobile-auth');
        
        // Replace language select with mobile version
        const languageSelect = actionsClone.querySelector('.language-select');
        if (languageSelect) {
            languageSelect.className = 'mobile-language-select';
            languageSelect.style.width = '100%';
        }
        
        mobileNav.appendChild(actionsClone);
    }
    
    // Add mobile language selector
    const languageSection = document.createElement('div');
    languageSection.className = 'mobile-language-select';
    languageSection.innerHTML = `
        <select id="mobileLanguageSelect" class="language-select">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
        </select>
    `;
    mobileNav.appendChild(languageSection);
    
    header.appendChild(mobileNav);
    
    // Initialize mobile language selector
    const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
    if (mobileLanguageSelect) {
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        mobileLanguageSelect.value = savedLanguage;
        
        mobileLanguageSelect.addEventListener('change', function() {
            const lang = this.value;
            setLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
            showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
            closeMobileMenu();
        });
    }
    
    // Add click event to close menu when clicking links
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    mobileNav.classList.add('active');
    
    // Update icon
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
}

function closeMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileNav) {
        mobileNav.classList.remove('active');
        setTimeout(() => {
            if (!mobileNav.classList.contains('active') && mobileNav.parentNode) {
                mobileNav.parentNode.removeChild(mobileNav);
            }
        }, 300);
    }
    
    if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Ambulance Button Functionality
function initializeAmbulanceButton() {
    const ambulanceBtn = document.getElementById('ambulanceBtn');

    if (ambulanceBtn) {
        ambulanceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add active state with pulse animation
            this.classList.add('active');
            
            // Create ripple effect
            createRippleEffect(e, this);
            
            // Show emergency notification
            showNotification('Emergency ambulance requested! Help is on the way.', 'error');
            
            // Simulate emergency call process
            simulateEmergencyCall();
            
            // Remove active state after animation completes
            setTimeout(() => {
                this.classList.remove('active');
            }, 3000);
        });

        // Add hover effects
        ambulanceBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        ambulanceBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Simulate emergency ambulance call process
function simulateEmergencyCall() {
    // Show loading state
    showNotification('Connecting to emergency services...', 'warning');
    
    // Simulate API call to emergency services
    setTimeout(() => {
        showNotification('Ambulance dispatched! ETA: 5-10 minutes', 'success');
        
        // Simulate location sharing
        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        console.log('Location shared with emergency services:', position);
                        showNotification('Location shared with ambulance service', 'info');
                    },
                    function(error) {
                        console.log('Location access denied, using registered address');
                        showNotification('Using registered address for ambulance dispatch', 'info');
                    }
                );
            }
        }, 1000);
    }, 2000);
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Adjust for header height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Authentication Buttons Enhancement
function initializeAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    // Add click effects
    [loginBtn, signupBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                // Add ripple effect
                createRippleEffect(e, this);
                
                // Add loading state
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            });
        }
    });
}

// Kiosk Registration Button Functionality
function initializeKioskButton() {
    const kioskBtn = document.getElementById('kioskBtn');
    const mobileKioskBtn = document.querySelector('.mobile-auth .btn-kiosk');

    if (kioskBtn) {
        kioskBtn.addEventListener('click', function(e) {
            // Prevent default link behavior if it's a button containing a link
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                return; // Let the link handle navigation
            }
            
            // Add ripple effect
            createRippleEffect(e, this);
            
            // Add loading state
            this.classList.add('loading');
            
            // Show kiosk-specific notification
            showNotification('Redirecting to Kiosk Registration...', 'info');
            
            // Remove loading state after delay
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1500);
        });
    }

    // Mobile kiosk button functionality
    if (mobileKioskBtn) {
        mobileKioskBtn.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                return;
            }
            
            createRippleEffect(e, this);
            this.classList.add('loading');
            showNotification('Opening Kiosk Registration...', 'info');
            
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1500);
        });
    }

    // Add kiosk-specific voice command handling
    addKioskVoiceCommand();
}

// Add Kiosk Registration voice command support
function addKioskVoiceCommand() {
    // This integrates with your existing voice command system
    // The command "kiosk registration" is already added to the HTML
    console.log('Kiosk registration voice command support initialized');
}

// Ripple Effect Function
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles if not already added
    if (!document.querySelector('#ripple-styles')) {
        const styles = document.createElement('style');
        styles.id = 'ripple-styles';
        styles.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Animations and Intersection Observer
function initializeAnimations() {
    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .step, .testimonial-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Hero section animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate-in');
        }, 300);
    }

    // Add animation styles if not present
    if (!document.querySelector('#animation-styles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            .btn-kiosk.loading {
                position: relative;
                color: transparent;
            }
            .btn-kiosk.loading::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                left: 50%;
                margin-left: -10px;
                margin-top: -10px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(animationStyles);
    }
}

function initializeLanguageSupport() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);

    // Language selector functionality
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            setLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
            
            // Sync voice command tabs
            syncVoiceCommandTabs(lang);
            
            // Update voice recognition language
            if (window.voiceCommands) {
                window.voiceCommands.setLanguage(lang);
            }
            
            showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
        });
    }
    
    // Sync tabs on page load
    syncVoiceCommandTabs(savedLanguage);
}

// Sync voice command tabs with language selector
function syncVoiceCommandTabs(lang) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to corresponding button and content
    const activeButton = document.querySelector(`.tab-button[data-lang="${lang}"]`);
    const activeContent = document.getElementById(`${lang}-commands`);
    
    if (activeButton) activeButton.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Language Tabs for Voice Commands
function initializeLanguageTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${lang}-commands`).classList.add('active');
            
            // Update language selector and overall language
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = lang;
                setLanguage(lang);
                localStorage.setItem('preferredLanguage', lang);
                
                // Update voice recognition language
                if (window.voiceCommands) {
                    window.voiceCommands.setLanguage(lang);
                }
                
                showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
            }
        });
    });
}

// Language setting function
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translations[lang]?.[key] || translations['en'][key] || key;
        element.textContent = translation;
    });

    // Update kiosk button text if translation exists
    updateKioskButtonText(lang);
}

// Update kiosk button text based on language
function updateKioskButtonText(lang) {
    const kioskButtons = document.querySelectorAll('.btn-kiosk a');
    const kioskText = translations[lang]?.['kiosk_registration'] || translations['en']['kiosk_registration'] || 'Kiosk Registration';
    
    kioskButtons.forEach(button => {
        button.textContent = kioskText;
    });
}

// Get language name
function getLanguageName(lang) {
    const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'pa': 'Punjabi'
    };
    return languageNames[lang] || 'English';
}

// Service Cards Interaction
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            serviceCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get service type and show appropriate action
            const serviceTitle = this.querySelector('h3').textContent;
            showServiceModal(serviceTitle);
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Service Modal Function
function showServiceModal(serviceTitle) {
    // In a real implementation, this would show a modal with service details
    console.log(`Service selected: ${serviceTitle}`);
    // showNotification(`Opening ${serviceTitle} service...`, 'info');
}

// Testimonials Carousel Functionality
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    // Auto-rotate testimonials
    setInterval(() => {
        if (testimonialCards.length > 0) {
            testimonialCards.forEach(card => card.classList.remove('active'));
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            testimonialCards[currentTestimonial].classList.add('active');
        }
    }, 5000);
}

// Download App Buttons Functionality
function initializeDownloadButtons() {
    const appButtons = document.querySelectorAll('.app-btn');
    
    appButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.querySelector('span').textContent;
            showNotification(`${platform} version coming soon!`, 'info');
            
            // Simulate download process
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications of the same type
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.textContent.includes(message)) {
            notification.remove();
        }
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .notification-info { background: #4e54c8; }
            .notification-success { background: #28a745; }
            .notification-warning { background: #ff9800; }
            .notification-error { background: #dc3545; }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Performance Optimization: Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Translation Data (Updated with kiosk registration translation)
const translations = {
    'en': {
        'hero_title': 'Your Journey to Better Health Starts Here',
        'hero_desc': 'Access quality healthcare services from the comfort of your home. Book appointments, consult doctors, and manage your health records all in one place.',
        'book_appointment': 'Book an Appointment',
        'consult_online': 'Consult Online',
        'kiosk_registration': 'Kiosk Registration',
        'our_services': 'Our Services',
        'appointment_booking': 'Appointment Booking',
        'appointment_desc': 'Book appointments with specialist doctors at your convenience.',
        'online_consultation': 'Online Consultation',
        'consultation_desc': 'Consult with doctors online through secure video calls.',
        'medicine_delivery': 'Medicine Delivery',
        'medicine_desc': 'Get your prescribed medicines delivered to your doorstep.',
        'health_records': 'Health Records',
        'records_desc': 'Access and manage your health records anytime, anywhere.',
        'how_it_works': 'How It Works',
        'create_account': 'Create Account',
        'account_desc': 'Sign up and complete your health profile',
        'choose_service': 'Choose Service',
        'service_desc': 'Select the healthcare service you need',
        'book_appointment_step': 'Book Appointment',
        'appointment_step_desc': 'Schedule your visit or online consultation',
        'get_treatment': 'Get Treatment',
        'treatment_desc': 'Receive quality healthcare and follow-up',
        'testimonials': 'What Our Patients Say',
        'testimonial_1': '"e-Schat Nabha made it so easy to consult with a specialist without traveling long distances. The video consultation was smooth and the doctor was very helpful."',
        'testimonial_2': '"The medicine delivery service is a lifesaver for my elderly parents. We get all their medications on time without any hassle."',
        'testimonial_3': '"Having all my health records in one place has made managing my chronic condition much easier. I can easily share them with any doctor I consult."',
        'patient': 'Patient',
        'customer': 'Customer',
        'download_app': 'Download e-Schat Nabha',
        'download_desc': 'Access healthcare services on the go with our mobile application. Available on both iOS and Android platforms.',
        'footer_tagline': 'Your Journey to Better Health Starts Here',
        'quick_links': 'Quick Links',
        'home': 'Home',
        'services': 'Services',
        'doctors': 'Doctors',
        'appointments': 'Appointments',
        'contact': 'Contact',
        'contact_us': 'Contact Us',
        'address': 'Medical Complex, Nabha, Punjab',
        'privacy_policy': 'Privacy Policy',
        'terms_service': 'Terms of Service'
    },
    'hi': {
        'hero_title': 'बेहतर स्वास्थ्य की आपकी यात्रा यहाँ से शुरू होती है',
        'hero_desc': 'अपने घर के आराम से गुणवत्तापूर्ण स्वास्थ्य सेवाओं तक पहुंचें। अपॉइंटमेंट बुक करें, डॉक्टरों से सलाह लें, और अपने स्वास्थ्य रिकॉर्ड को एक ही स्थान पर प्रबंधित करें।',
        'kiosk_registration': 'कियोस्क पंजीकरण'
        // Add more Hindi translations as needed
    },
    'pa': {
        'hero_title': 'ਤੰਦਰੁਸਤ ਸਿਹਤ ਦੀ ਤੁਹਾਡੀ ਯਾਤਰਾ ਇੱਥੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ',
        'hero_desc': 'ਆਪਣੇ ਘਰ ਦੇ ਆਰਾਮ ਤੋਂ ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਸਿਹਤ ਸੇਵਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਕਰੋ। ਅਪਾਇੰਟਮੈਂਟ ਬੁਕ ਕਰੋ, ਡਾਕਟਰਾਂ ਨਾਲ ਸਲਾਹ ਲਓ, ਅਤੇ ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡ ਨੂੰ ਇੱਕ ਹੀ ਥਾਂ 'ਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।',
        'kiosk_registration': 'ਕਿਓਸਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ'
        // Add more Punjabi translations as needed
    }
};

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        setLanguage
    };
}