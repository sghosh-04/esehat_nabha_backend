// Voice Commands Functionality for e-Schat Nabha with Multi-Language Support
class VoiceCommands {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.currentLanguage = 'en';
        
        // Multi-language commands
        this.commands = {
            // English commands
            'en': {
                'go to home': () => this.navigateTo('../home-page/index.html'),
                'home': () => this.navigateTo('../home-page/index.html'),
                'book appointment': () => this.navigateTo('../home-page/appointments.html'),
                'appointment': () => this.navigateTo('../home-page/appointments.html'),
                'consult online': () => this.navigateTo('../home-page/services.html'),
                'online consultation': () => this.navigateTo('../home-page/services.html'),
                'find doctors': () => this.navigateTo('../home-page/doctors.html'),
                'doctors': () => this.navigateTo('../home-page/doctors.html'),
                'medicine delivery': () => this.navigateTo('../home-page/medicine-booking.html'),
                'medicine': () => this.navigateTo('../home-page/medicine-booking.html'),
                'health records': () => this.navigateTo('../home-page/health-records.html'),
                'records': () => this.navigateTo('../home-page/health-records.html'),
                'services': () => this.navigateTo('../home-page/services.html'),
                'contact us': () => this.navigateTo('../home-page/contact.html'),
                'contact': () => this.navigateTo('../home-page/contact.html'),
                'login': () => this.navigateTo('../login-page/index.html'),
                'sign up': () => this.navigateTo('../sign-up-page/index.html'),
                'register': () => this.navigateTo('../sign-up-page/index.html'),
                'help': () => this.showHelp(),
                'stop listening': () => this.stopListening(),
                'exit': () => this.stopListening(),
                'close': () => this.stopListening()
            },
            
            // Hindi commands
            'hi': {
                'घर जाओ': () => this.navigateTo('../home-page/index.html'),
                'घर': () => this.navigateTo('../home-page/index.html'),
                'अपॉइंटमेंट बुक करो': () => this.navigateTo('../home-page/appointments.html'),
                'अपॉइंटमेंट': () => this.navigateTo('../home-page/appointments.html'),
                'ऑनलाइन परामर्श': () => this.navigateTo('../home-page/services.html'),
                'परामर्श': () => this.navigateTo('../home-page/services.html'),
                'डॉक्टर से मिलो': () => this.navigateTo('../home-page/doctors.html'),
                'डॉक्टर': () => this.navigateTo('../home-page/doctors.html'),
                'दवा डिलीवरी': () => this.navigateTo('../home-page/medicine-booking.html'),
                'दवा': () => this.navigateTo('../home-page/medicine-booking.html'),
                'स्वास्थ्य रिकॉर्ड': () => this.navigateTo('../home-page/health-records.html'),
                'रिकॉर्ड': () => this.navigateTo('../home-page/health-records.html'),
                'सेवाएं': () => this.navigateTo('../home-page/services.html'),
                'संपर्क करें': () => this.navigateTo('../home-page/contact.html'),
                'संपर्क': () => this.navigateTo('../home-page/contact.html'),
                'लॉगिन': () => this.navigateTo('../login-page/index.html'),
                'साइन अप': () => this.navigateTo('../sign-up-page/index.html'),
                'रजिस्टर': () => this.navigateTo('../sign-up-page/index.html'),
                'मदद': () => this.showHelp(),
                'सुनना बंद करो': () => this.stopListening(),
                'बंद करो': () => this.stopListening(),
                'बाहर जाओ': () => this.stopListening()
            },
            
            // Punjabi commands
            'pa': {
                'ਘਰ ਜਾਓ': () => this.navigateTo('../home-page/index.html'),
                'ਘਰ': () => this.navigateTo('../home-page/index.html'),
                'ਅਪਾਇੰਟਮੈਂਟ ਬੁਕ ਕਰੋ': () => this.navigateTo('../home-page/appointments.html'),
                'ਅਪਾਇੰਟਮੈਂਟ': () => this.navigateTo('../home-page/appointments.html'),
                'ਔਨਲਾਈਨ ਸਲਾਹ': () => this.navigateTo('../home-page/services.html'),
                'ਸਲਾਹ': () => this.navigateTo('../home-page/services.html'),
                'ਡਾਕਟਰ ਮਿਲੋ': () => this.navigateTo('../home-page/doctors.html'),
                'ਡਾਕਟਰ': () => this.navigateTo('../home-page/doctors.html'),
                'ਦਵਾਈ ਡਿਲੀਵਰੀ': () => this.navigateTo('../home-page/medicine-booking.html'),
                'ਦਵਾਈ': () => this.navigateTo('../home-page/medicine-booking.html'),
                'ਸਿਹਤ ਰਿਕਾਰਡ': () => this.navigateTo('../home-page/health-records.html'),
                'ਰਿਕਾਰਡ': () => this.navigateTo('../home-page/health-records.html'),
                'ਸੇਵਾਵਾਂ': () => this.navigateTo('../home-page/services.html'),
                'ਸੰਪਰਕ ਕਰੋ': () => this.navigateTo('../home-page/contact.html'),
                'ਸੰਪਰਕ': () => this.navigateTo('../home-page/contact.html'),
                'ਲੌਗਿਨ': () => this.navigateTo('../login-page/index.html'),
                'ਸਾਈਨ ਅੱਪ': () => this.navigateTo('../sign-up-page/index.html'),
                'ਰਜਿਸਟਰ': () => this.navigateTo('../sign-up-page/index.html'),
                'ਮਦਦ': () => this.showHelp(),
                'ਸੁਣਨਾ ਬੰਦ ਕਰੋ': () => this.stopListening(),
                'ਬੰਦ ਕਰੋ': () => this.stopListening(),
                'ਬਾਹਰ ਜਾਓ': () => this.stopListening()
            }
        };

        this.init();
    }

    init() {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showBrowserSupportError();
            return;
        }

        // Set initial language from localStorage or default to English
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        this.setupRecognition();
        this.setupEventListeners();
    }

    setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        // Set initial language
        this.setRecognitionLanguage(this.currentLanguage);

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUIListening();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUIIdle();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };
    }

    setRecognitionLanguage(lang) {
        const languageMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'pa': 'pa-IN'
        };
        
        this.recognition.lang = languageMap[lang] || 'en-US';
        this.currentLanguage = lang;
        
        // Update UI to show current language
        this.updateLanguageIndicator();
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceFeedback = document.getElementById('voiceFeedback');

        // Voice command button click event
        voiceBtn.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        // Close feedback when clicking outside
        document.addEventListener('click', (e) => {
            if (!voiceBtn.contains(e.target) && !voiceFeedback.contains(e.target)) {
                voiceFeedback.classList.remove('active');
            }
        });

        // Keyboard shortcut (Ctrl+Space)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            }
        });

        // Listen for language changes from the selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    startListening() {
        try {
            this.recognition.start();
            document.getElementById('voiceFeedback').classList.add('active');
            this.updateVoiceText('Listening... Speak now');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.updateVoiceText('Error starting voice recognition. Please try again.');
        }
    }

    stopListening() {
        try {
            this.recognition.stop();
            document.getElementById('voiceFeedback').classList.remove('active');
            this.updateVoiceText('Say a command...');
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
        }
    }

    processCommand(transcript) {
        console.log('Heard:', transcript);
        this.updateVoiceText(`Heard: "${transcript}"`);

        // Detect language from the transcript
        const detectedLang = this.detectLanguage(transcript);
        
        // Switch language if different from current
        if (detectedLang !== this.currentLanguage) {
            this.setLanguage(detectedLang);
            this.showCommandFeedback(`Language switched to ${this.getLanguageName(detectedLang)}`);
        }

        // Normalize the transcript for matching
        const normalizedTranscript = transcript.toLowerCase().trim();
        
        // Find matching command in current language
        const currentLanguageCommands = this.commands[this.currentLanguage];
        const matchedCommand = Object.keys(currentLanguageCommands).find(command => 
            normalizedTranscript.includes(command.toLowerCase())
        );

        if (matchedCommand) {
            this.updateVoiceText(`Executing: "${matchedCommand}"`);
            this.showCommandFeedback(`Command executed: ${matchedCommand}`);
            currentLanguageCommands[matchedCommand]();
        } else {
            this.updateVoiceText(`Command not recognized: "${transcript}"`);
            this.showCommandFeedback(`Command not recognized. Say "help" for available commands.`);
        }

        // Restart listening after a short delay
        setTimeout(() => {
            if (this.isListening) {
                this.recognition.start();
            }
        }, 2000);
    }

    detectLanguage(transcript) {
        // Simple language detection based on character ranges
        if (/[\u0900-\u097F]/.test(transcript)) {
            return 'hi'; // Hindi characters
        } else if (/[\u0A00-\u0A7F]/.test(transcript)) {
            return 'pa'; // Punjabi characters
        } else {
            return 'en'; // English (default)
        }
    }
setLanguage(lang) {
    if (['en', 'hi', 'pa'].includes(lang)) {
        this.setRecognitionLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
        
        // Update the language selector if it exists
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = lang;
        }
        
        // Sync voice command tabs
        this.syncVoiceCommandTabs(lang);
    }
}

// Add this new method to sync tabs
syncVoiceCommandTabs(lang) {
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

    navigateTo(url) {
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    }

    showHelp() {
        const voiceFeedback = document.getElementById('voiceFeedback');
        voiceFeedback.classList.add('active');
        this.updateVoiceText('Here are the available commands');
    }

    updateUIListening() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceIcon = document.getElementById('voiceIcon');
        const voiceStatus = document.querySelector('.voice-status');
        
        voiceBtn.classList.add('listening');
        voiceIcon.classList.remove('fa-microphone');
        voiceIcon.classList.add('fa-microphone-slash');
        voiceStatus.textContent = 'Listening...';
    }

    updateUIIdle() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceIcon = document.getElementById('voiceIcon');
        const voiceStatus = document.querySelector('.voice-status');
        
        voiceBtn.classList.remove('listening');
        voiceIcon.classList.remove('fa-microphone-slash');
        voiceIcon.classList.add('fa-microphone');
        voiceStatus.textContent = 'Voice Commands';
    }

    updateLanguageIndicator() {
        const voiceStatus = document.querySelector('.voice-status');
        if (voiceStatus) {
            voiceStatus.textContent = `Voice (${this.getLanguageName(this.currentLanguage)})`;
        }
    }

    updateVoiceText(text) {
        const voiceText = document.getElementById('voiceText');
        if (voiceText) {
            voiceText.textContent = text;
        }
    }

    showCommandFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = 'command-feedback';
        feedback.textContent = message;
        
        // Remove any existing feedback
        const existingFeedback = document.querySelector('.command-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        document.body.appendChild(feedback);

        // Remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }

    handleRecognitionError(error) {
        let errorMessage = 'Voice recognition error. ';
        
        switch (error) {
            case 'no-speech':
                errorMessage += 'No speech was detected.';
                break;
            case 'audio-capture':
                errorMessage += 'No microphone was found.';
                break;
            case 'not-allowed':
                errorMessage += 'Microphone permission was denied.';
                break;
            case 'network':
                errorMessage += 'Network error occurred.';
                break;
            default:
                errorMessage += 'Please try again.';
        }

        this.updateVoiceText(errorMessage);
        this.showCommandFeedback(errorMessage);
    }

    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'hi': 'Hindi',
            'pa': 'Punjabi'
        };
        return names[lang] || 'English';
    }

    showBrowserSupportError() {
        const voiceBtn = document.getElementById('voiceBtn');
        voiceBtn.style.opacity = '0.5';
        voiceBtn.style.cursor = 'not-allowed';
        voiceBtn.title = 'Voice commands not supported in this browser';
        
        const voiceStatus = document.querySelector('.voice-status');
        voiceStatus.textContent = 'Not Supported';
        
        console.warn('Speech recognition not supported in this browser');
    }
}

// Initialize voice commands when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceCommands = new VoiceCommands();
    
    // Add CSS for voice command feedback
    const style = document.createElement('style');
    style.textContent = `
        .voice-command-btn {
            transition: all 0.3s ease;
        }
        
        .voice-command-btn.listening {
            background: #ff4757 !important;
            animation: pulse 1.5s infinite;
        }
        
        .voice-feedback {
            transition: all 0.3s ease;
        }
        
        .voice-feedback.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .command-feedback {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceCommands };
}