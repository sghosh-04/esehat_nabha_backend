// Sample doctors data
const doctorsData = {
    cardiology: [
        {
            id: 1,
            name: "Dr. Rajesh Kumar",
            specialty: "Cardiology",
            experience: "15 years",
            image: "https://placehold.co/300x300/2a7cc7/white?text=Dr.+Rajesh",
            rating: 4.8,
            reviews: 124,
            availability: ["Monday", "Wednesday", "Friday"],
            timeSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
        },
        {
            id: 2,
            name: "Dr. Neha Gupta",
            specialty: "Cardiology",
            experience: "9 years",
            image: "https://placehold.co/300x300/2a7cc7/white?text=Dr.+Neha",
            rating: 4.6,
            reviews: 89,
            availability: ["Tuesday", "Thursday", "Saturday"],
            timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"]
        }
    ],
    neurology: [
        {
            id: 3,
            name: "Dr. Vikram Malhotra",
            specialty: "Neurology",
            experience: "20 years",
            image: "https://placehold.co/300x300/fd7e14/white?text=Dr.+Vikram",
            rating: 4.9,
            reviews: 156,
            availability: ["Tuesday", "Thursday", "Saturday"],
            timeSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM"]
        }
    ],
    pediatrics: [
        {
            id: 4,
            name: "Dr. Priya Sharma",
            specialty: "Pediatrics",
            experience: "12 years",
            image: "https://placehold.co/300x300/28a745/white?text=Dr.+Priya",
            rating: 4.7,
            reviews: 203,
            availability: ["Monday", "Wednesday", "Friday", "Saturday"],
            timeSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM"]
        }
    ],
    orthopedics: [
        {
            id: 5,
            name: "Dr. Amit Singh",
            specialty: "Orthopedics",
            experience: "18 years",
            image: "https://placehold.co/300x300/dc3545/white?text=Dr.+Amit",
            rating: 4.8,
            reviews: 178,
            availability: ["Monday", "Tuesday", "Thursday", "Friday"],
            timeSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
        }
    ],
    dermatology: [
        {
            id: 6,
            name: "Dr. Anjali Mehta",
            specialty: "Dermatology",
            experience: "10 years",
            image: "https://placehold.co/300x300/20c997/white?text=Dr.+Anjali",
            rating: 4.5,
            reviews: 95,
            availability: ["Monday", "Wednesday", "Friday", "Saturday"],
            timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"]
        }
    ],
    gynecology: [
        {
            id: 7,
            name: "Dr. Sunita Patel",
            specialty: "Gynecology",
            experience: "14 years",
            image: "https://placehold.co/300x300/6f42c1/white?text=Dr.+Sunita",
            rating: 4.9,
            reviews: 167,
            availability: ["Monday", "Wednesday", "Friday", "Saturday"],
            timeSlots: ["08:30 AM", "09:30 AM", "10:30 AM", "02:30 PM", "03:30 PM"]
        }
    ],
    general: [
        {
            id: 8,
            name: "Dr. Sanjay Verma",
            specialty: "General Medicine",
            experience: "22 years",
            image: "https://placehold.co/300x300/6c757d/white?text=Dr.+Sanjay",
            rating: 4.7,
            reviews: 234,
            availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM"]
        }
    ]
};

// Sample appointments data
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

// DOM Elements
const appointmentForm = document.getElementById('appointmentForm');
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
const doctorImage = document.getElementById('doctorImage');
const doctorName = document.getElementById('doctorName');
const doctorSpecialty = document.getElementById('doctorSpecialty');
const doctorExperience = document.getElementById('doctorExperience');
const doctorRating = document.getElementById('doctorRating');
const doctorReviews = document.getElementById('doctorReviews');
const doctorAvailability = document.getElementById('doctorAvailability');
const summaryDate = document.getElementById('summaryDate');
const summaryTime = document.getElementById('summaryTime');
const summaryType = document.getElementById('summaryType');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const upcomingAppointments = document.getElementById('upcomingAppointments');
const completedAppointments = document.getElementById('completedAppointments');
const cancelledAppointments = document.getElementById('cancelledAppointments');
const appointmentModal = document.getElementById('appointmentModal');
const confirmationModal = document.getElementById('confirmationModal');
const languageSelect = document.getElementById('languageSelect');

// Variables
let currentLanguage = 'en';
let selectedDoctor = null;

// Language Functions
function changeLanguage(lang) {
    currentLanguage = lang;
    languageSelect.value = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update dynamic content
    updateAppointmentLists();
}

// Initialize the page
function init() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.min = today;
    
    // Set initial language
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);
    
    // Load appointments
    updateAppointmentLists();
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Department change
    departmentSelect.addEventListener('change', populateDoctors);
    
    // Doctor change
    doctorSelect.addEventListener('change', updateDoctorDetails);
    
    // Date change
    appointmentDate.addEventListener('change', updateTimeSlots);
    
    // Time change
    appointmentTime.addEventListener('change', updateSummary);
    
    // Appointment type change
    document.querySelectorAll('input[name="appointmentType"]').forEach(radio => {
        radio.addEventListener('change', updateSummary);
    });
    
    // Form submission
    appointmentForm.addEventListener('submit', handleAppointmentBooking);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
    
    // Language change
    languageSelect.addEventListener('change', (e) => {
        const newLanguage = e.target.value;
        localStorage.setItem('preferredLanguage', newLanguage);
        changeLanguage(newLanguage);
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            appointmentModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        });
    });
    
    // Confirmation modal actions
    document.getElementById('cancelAction').addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });
    
    document.getElementById('confirmAction').addEventListener('click', handleConfirmedAction);
}

// Populate doctors based on department
function populateDoctors() {
    const department = departmentSelect.value;
    doctorSelect.innerHTML = '<option value="" data-translate="selectDoctor">Select Doctor</option>';
    
    if (department && doctorsData[department]) {
        doctorsData[department].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
    
    // Reset doctor details
    resetDoctorDetails();
}

// Update doctor details when selected
function updateDoctorDetails() {
    const doctorId = parseInt(doctorSelect.value);
    const department = departmentSelect.value;
    
    if (doctorId && department && doctorsData[department]) {
        selectedDoctor = doctorsData[department].find(doc => doc.id === doctorId);
        
        if (selectedDoctor) {
            doctorImage.src = selectedDoctor.image;
            doctorName.textContent = selectedDoctor.name;
            doctorSpecialty.textContent = selectedDoctor.specialty;
            doctorExperience.textContent = selectedDoctor.experience + ' ' + (translations[currentLanguage]?.experience || 'experience');
            
            // Update stars
            const stars = doctorRating.querySelectorAll('.fa-star');
            const rating = Math.round(selectedDoctor.rating);
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.className = 'fas fa-star';
                } else {
                    star.className = 'far fa-star';
                }
            });
            
            doctorReviews.textContent = selectedDoctor.reviews + ' ' + (translations[currentLanguage]?.reviews || 'reviews');
            doctorAvailability.innerHTML = `<p><strong>${translations[currentLanguage]?.availableDays || 'Available Days'}:</strong> ${selectedDoctor.availability.join(', ')}</p>`;
            
            // Update time slots
            updateTimeSlots();
        }
    } else {
        resetDoctorDetails();
    }
}

// Reset doctor details
function resetDoctorDetails() {
    selectedDoctor = null;
    doctorImage.src = "https://placehold.co/300x300/0066cc/white?text=Select+Doctor";
    doctorName.textContent = translations[currentLanguage]?.selectDoctor || "Select a Doctor";
    doctorSpecialty.textContent = translations[currentLanguage]?.specialtyWillAppear || "Specialty will appear here";
    doctorExperience.textContent = translations[currentLanguage]?.experienceWillAppear || "Experience will appear here";
    doctorAvailability.innerHTML = `<p><strong>${translations[currentLanguage]?.availableDays || 'Available Days'}:</strong> ${translations[currentLanguage]?.notSelected || 'Not selected'}</p>`;
    appointmentTime.innerHTML = `<option value="" data-translate="selectTimeSlot">Select Time Slot</option>`;
}

// Update time slots based on selected doctor and date
function updateTimeSlots() {
    if (!selectedDoctor || !appointmentDate.value) {
        appointmentTime.innerHTML = `<option value="" data-translate="selectTimeSlot">Select Time Slot</option>`;
        return;
    }
    
    appointmentTime.innerHTML = `<option value="" data-translate="selectTimeSlot">Select Time Slot</option>`;
    selectedDoctor.timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        appointmentTime.appendChild(option);
    });
}

// Update appointment summary
function updateSummary() {
    if (appointmentDate.value) {
        summaryDate.textContent = formatDate(appointmentDate.value);
    } else {
        summaryDate.textContent = translations[currentLanguage]?.notSelected || 'Not selected';
    }
    
    if (appointmentTime.value) {
        summaryTime.textContent = appointmentTime.value;
    } else {
        summaryTime.textContent = translations[currentLanguage]?.notSelected || 'Not selected';
    }
    
    const appointmentType = document.querySelector('input[name="appointmentType"]:checked');
    if (appointmentType) {
        if (appointmentType.value === 'video') {
            summaryType.textContent = translations[currentLanguage]?.videoConsultation || 'Video Consultation';
        }
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Handle appointment booking
function handleAppointmentBooking(e) {
    e.preventDefault();
    
    if (!selectedDoctor) {
        alert('Please select a doctor');
        return;
    }
    
    const appointment = {
        id: Date.now(),
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: appointmentDate.value,
        time: appointmentTime.value,
        type: document.querySelector('input[name="appointmentType"]:checked').value,
        reason: document.getElementById('reason').value,
        status: 'upcoming',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert('Appointment booked successfully!');
    appointmentForm.reset();
    resetDoctorDetails();
    updateAppointmentLists();
    updateSummary();
}

// Update appointment lists
function updateAppointmentLists() {
    const now = new Date();
    
    const upcoming = appointments.filter(apt => apt.status === 'upcoming' && new Date(apt.date + 'T' + apt.time) > now);
    const completed = appointments.filter(apt => apt.status === 'completed');
    const cancelled = appointments.filter(apt => apt.status === 'cancelled');
    
    renderAppointmentList(upcomingAppointments, upcoming, 'upcoming');
    renderAppointmentList(completedAppointments, completed, 'completed');
    renderAppointmentList(cancelledAppointments, cancelled, 'cancelled');
}

// Render appointment list
function renderAppointmentList(container, appointments, type) {
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-${type === 'upcoming' ? 'plus' : type === 'completed' ? 'check' : 'times'}"></i>
                <h3>${translations[currentLanguage]?.[`no${type.charAt(0).toUpperCase() + type.slice(1)}Appointments`] || `No ${type} appointments`}</h3>
                <p>${translations[currentLanguage]?.[`${type}AppointmentsAppear`] || `Your ${type} appointments will appear here`}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-info">
                <h4>Dr. ${apt.doctor}</h4>
                <p><strong>${apt.specialty}</strong> • ${formatDate(apt.date)} at ${apt.time}</p>
                <p>Type: ${apt.type === 'video' ? (translations[currentLanguage]?.videoConsultation || 'Video Consultation') : 'Clinic Visit'}</p>
                ${apt.reason ? `<p>Reason: ${apt.reason}</p>` : ''}
            </div>
            <div class="appointment-actions">
                ${type === 'upcoming' ? `
                    <button class="btn-primary btn-sm view-appointment" data-id="${apt.id}">${translations[currentLanguage]?.view || 'View'}</button>
                    <button class="btn-outline btn-sm cancel-appointment" data-id="${apt.id}">${translations[currentLanguage]?.cancel || 'Cancel'}</button>
                ` : `
                    <button class="btn-primary btn-sm view-appointment" data-id="${apt.id}">${translations[currentLanguage]?.view || 'View'}</button>
                `}
            </div>
        </div>
    `).join('');
    
    // Add event listeners to action buttons
    container.querySelectorAll('.view-appointment').forEach(button => {
        button.addEventListener('click', () => viewAppointment(button.dataset.id));
    });
    
    container.querySelectorAll('.cancel-appointment').forEach(button => {
        button.addEventListener('click', () => cancelAppointment(button.dataset.id));
    });
}

// Switch tabs
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// View appointment details
function viewAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id == appointmentId);
    if (appointment) {
        document.getElementById('appointmentModalBody').innerHTML = `
            <h2>Appointment Details</h2>
            <div class="appointment-details">
                <p><strong>Doctor:</strong> Dr. ${appointment.doctor}</p>
                <p><strong>Specialty:</strong> ${appointment.specialty}</p>
                <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Type:</strong> ${appointment.type === 'video' ? (translations[currentLanguage]?.videoConsultation || 'Video Consultation') : 'Clinic Visit'}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>
                ${appointment.reason ? `<p><strong>Reason:</strong> ${appointment.reason}</p>` : ''}
                <p><strong>Booked on:</strong> ${formatDate(appointment.createdAt)}</p>
            </div>
        `;
        appointmentModal.style.display = 'block';
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id == appointmentId);
    if (appointment) {
        document.getElementById('confirmationTitle').textContent = translations[currentLanguage]?.confirmAction || 'Confirm Action';
        document.getElementById('confirmationMessage').textContent = 'Are you sure you want to cancel this appointment?';
        
        document.getElementById('confirmAction').onclick = () => {
            appointment.status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            updateAppointmentLists();
            confirmationModal.style.display = 'none';
        };
        
        confirmationModal.style.display = 'block';
    }
}

// Handle confirmed action
function handleConfirmedAction() {
    // This function is set dynamically when showing confirmation modal
    confirmationModal.style.display = 'none';
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);