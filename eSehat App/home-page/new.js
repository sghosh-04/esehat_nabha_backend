document.addEventListener('DOMContentLoaded', function() {
    const viewToggle = document.getElementById('viewToggle');
    const patientOption = document.querySelector('.patient-option');
    const doctorOption = document.querySelector('.doctor-option');
    const body = document.body;
    
    // Check if we have a saved preference
    const isDoctorView = localStorage.getItem('userView') === 'doctor';
    
    // Set initial state
    if (isDoctorView) {
        viewToggle.checked = true;
        patientOption.classList.remove('active');
        doctorOption.classList.add('active');
        body.classList.add('doctor-view');
        updateContentForDoctorView();
    }
    
    // Toggle view when switch is clicked
    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            patientOption.classList.remove('active');
            doctorOption.classList.add('active');
            body.classList.add('doctor-view');
            localStorage.setItem('userView', 'doctor');
            updateContentForDoctorView();
        } else {
            patientOption.classList.add('active');
            doctorOption.classList.remove('active');
            body.classList.remove('doctor-view');
            localStorage.setItem('userView', 'patient');
            revertToPatientView();
        }
    });
    
    // Also allow clicking on the options to toggle
    patientOption.addEventListener('click', function() {
        if (viewToggle.checked) {
            viewToggle.checked = false;
            patientOption.classList.add('active');
            doctorOption.classList.remove('active');
            body.classList.remove('doctor-view');
            localStorage.setItem('userView', 'patient');
            revertToPatientView();
        }
    });
    
    doctorOption.addEventListener('click', function() {
        if (!viewToggle.checked) {
            viewToggle.checked = true;
            patientOption.classList.remove('active');
            doctorOption.classList.add('active');
            body.classList.add('doctor-view');
            localStorage.setItem('userView', 'doctor');
            updateContentForDoctorView();
        }
    });
    
    function updateContentForDoctorView() {
        // Update hero section
        const heroTitle = document.querySelector('.hero-content h2');
        const heroText = document.querySelector('.hero-content p');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) heroTitle.textContent = "Your Medical Practice Management Solution";
        if (heroText) heroText.textContent = "Manage your appointments, consult with patients, and access medical records all in one place.";
        
        if (heroButtons) {
            heroButtons.innerHTML = `
                <button class="btn-primary">Manage Appointments</button>
                <button class="btn-outline">View Patient Records</button>
            `;
        }
        
        // Update services section
        const servicesTitle = document.querySelector('.services h2');
        if (servicesTitle) servicesTitle.textContent = "Features for Doctors";
        
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h3>Appointment Management</h3>
                    <p>Efficiently manage your patient appointments and schedule.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <h3>Virtual Consultations</h3>
                    <p>Conduct secure video consultations with your patients.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-file-medical"></i>
                    </div>
                    <h3>Patient Records</h3>
                    <p>Access and update patient health records securely.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-prescription"></i>
                    </div>
                    <h3>E-Prescriptions</h3>
                    <p>Create and send electronic prescriptions to patients.</p>
                </div>
            `;
        }
        
        // Update how it works section
        const howItWorksTitle = document.querySelector('.how-it-works h2');
        if (howItWorksTitle) howItWorksTitle.textContent = "How It Works for Doctors";
        
        const steps = document.querySelector('.steps');
        if (steps) {
            steps.innerHTML = `
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Create Profile</h3>
                    <p>Set up your doctor profile and availability</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Receive Requests</h3>
                    <p>Get appointment requests from patients</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Consult Patients</h3>
                    <p>Conduct in-person or virtual consultations</p>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <h3>Manage Records</h3>
                    <p>Update patient records and provide prescriptions</p>
                </div>
            `;
        }
        
        // Update testimonials section
        const testimonialsTitle = document.querySelector('.testimonials h2');
        if (testimonialsTitle) testimonialsTitle.textContent = "What Our Doctors Say";
        
        const testimonialCards = document.querySelector('.testimonial-cards');
        if (testimonialCards) {
            testimonialCards.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        <p>"e-Schat Nabha has streamlined my practice management. The appointment scheduling system saves me hours each week and the patient records are always accessible."</p>
                    </div>
                    <div class="testimonial-author">
                        <h4>Dr. Sharma</h4>
                        <p>Cardiologist</p>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        <p>"The virtual consultation feature allows me to reach patients in remote areas. It's been a game-changer for my practice and my patients' accessibility to care."</p>
                    </div>
                    <div class="testimonial-author">
                        <h4>Dr. Patel</h4>
                        <p>Pediatrician</p>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        <p>"The e-prescription system is efficient and error-free. I can quickly send prescriptions to pharmacies, saving time for both myself and my patients."</p>
                    </div>
                    <div class="testimonial-author">
                        <h4>Dr. Gupta</h4>
                        <p>General Physician</p>
                    </div>
                </div>
            `;
        }
        
        // Update download app section
        const downloadTitle = document.querySelector('.download-content h2');
        const downloadText = document.querySelector('.download-content p');
        
        if (downloadTitle) downloadTitle.textContent = "Download e-Schat Nabha";
        if (downloadText) downloadText.textContent = "Manage your practice on the go with our mobile application. Available on both iOS and Android platforms.";
    }
    
    function revertToPatientView() {
        // Reload the page to revert to original content
        location.reload();
    }
});