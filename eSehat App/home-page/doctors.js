// ================== DATA ==================
let doctorsData = [];
let filteredDoctors = [];

// ================== DOM ELEMENTS ==================
const doctorsGrid = document.getElementById('doctorsGrid');
const doctorModal = document.getElementById('doctorModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');
const loadMoreBtn = document.getElementById('loadMoreDoctors');
const searchInput = document.getElementById('doctorSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const experienceFilter = document.getElementById('experienceFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const resetFiltersBtn = document.getElementById('resetFilters');
const languageSelect = document.getElementById('languageSelect');
const voiceBtn = document.getElementById('voiceBtn');
const ambulanceBtn = document.getElementById('ambulanceBtn');

// ================== VARIABLES ==================
let displayedDoctors = 6;
let currentLanguage = 'en';
let voiceRecognition = null;
let isListening = false;

// ================== FETCH DOCTORS (BACKEND) ==================
async function fetchDoctors() {
    try {
        const res = await fetch("http://localhost:5004/api/doctors/list");
        const json = await res.json();

        if (!json.success) {
            throw new Error("Failed to fetch doctors");
        }

        doctorsData = json.data.map(d => ({
            id: d.id,
            name: `Dr. ${d.name}`,
            specialty: d.specialization,
            experience: `${d.experience} years`,
            image: `http://127.0.0.1:5004/uploads/${d.picture_url}`,
            bio: `${d.qualifications} • ${d.clinic_name}`,
            education: d.qualifications,
            availability: d.available ? ["Available"] : ["Unavailable"],
            awards: []
        }));

        filteredDoctors = [...doctorsData];
        renderDoctors();

    } catch (error) {
        console.error(error);
        showNotification("Unable to load doctors", "error");
    }
}

// ================== INIT ==================
function init() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);

    initializeVoiceRecognition();
    setupEventListeners();

    fetchDoctors();
}

document.addEventListener('DOMContentLoaded', init);

// ================== RENDER DOCTORS ==================
function renderDoctors() {
    doctorsGrid.innerHTML = '';

    const doctorsToShow = filteredDoctors.slice(0, displayedDoctors);

    if (doctorsToShow.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-results">
                <h3>No doctors found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    doctorsToShow.forEach(doctor => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}">
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialty}</p>
                <p>${doctor.experience}</p>
                <p>${doctor.bio}</p>
                <div class="doctor-actions">
                    <button class="btn-outline view-profile" data-id="${doctor.id}">
                        View Profile
                    </button>
                    <button class="btn-primary book-appointment" data-id="${doctor.id}">
                        Book Appointment
                    </button>
                </div>
            </div>
        `;
        doctorsGrid.appendChild(card);
    });

    if (filteredDoctors.length <= 6) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display =
            displayedDoctors >= filteredDoctors.length ? 'none' : 'block';
    }
}

// ================== FILTERS ==================


function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const specialty = specialtyFilter.value;
    const experience = experienceFilter.value;
    const availability = availabilityFilter.value;

    filteredDoctors = doctorsData.filter(d => {
        const matchesSearch =
            d.name.toLowerCase().includes(searchTerm) ||
            d.specialty.toLowerCase().includes(searchTerm) ||
            d.bio.toLowerCase().includes(searchTerm);

        const matchesSpecialty =
            specialty === 'all' || d.specialty.toLowerCase() === specialty;

        let matchesExperience = true;
        if (experience !== 'all') {
            matchesExperience = parseInt(d.experience) >= parseInt(experience);
        }

        const matchesAvailability =
            availability === 'all' ||
            (availability === 'today' && d.availability.includes("Available"));

        return matchesSearch && matchesSpecialty && matchesExperience && matchesAvailability;
    });

    displayedDoctors = 6;
    renderDoctors();
}


function resetFilters() {
    searchInput.value = '';
    specialtyFilter.value = 'all';
    experienceFilter.value = 'all';
    availabilityFilter.value = 'all';
    applyFilters();
}

// ================== EVENTS ==================
function setupEventListeners() {
    availabilityFilter.addEventListener('change', applyFilters);


    loadMoreBtn.addEventListener('click', () => {
        displayedDoctors += 3;
        renderDoctors();
    });

    doctorsGrid.addEventListener('click', e => {

        if (e.target.classList.contains('view-profile')) {
            openDoctorModal(parseInt(e.target.dataset.id));
        }

        if (e.target.classList.contains('book-appointment')) {
            const doctorId = e.target.dataset.id;
            alert(`Booking appointment for doctor ID ${doctorId}`);
        }
    });

    closeModal.addEventListener('click', () => {
        doctorModal.classList.remove('active');
    });

    window.addEventListener('click', e => {
        if (e.target === doctorModal) {
            doctorModal.classList.remove('active');
        }
    });

    searchInput.addEventListener('input', applyFilters);
    specialtyFilter.addEventListener('change', applyFilters);
    experienceFilter.addEventListener('change', applyFilters);
    resetFiltersBtn.addEventListener('click', e => {
    e.preventDefault();
    resetFilters();
});
}

// ================== MODAL ==================
function openDoctorModal(id) {
    const doctor = doctorsData.find(d => d.id === id);
    if (!doctor) return;

    modalBody.innerHTML = `
        <h2>${doctor.name}</h2>
        <p>${doctor.specialty}</p>
        <p>${doctor.experience}</p>
        <p>${doctor.bio}</p>
    `;

    doctorModal.classList.add('active');
}

// ================== UTIL ==================
function showNotification(message, type = "info") {
    alert(message);
}

// ================== VOICE / LANGUAGE ==================
function initializeVoiceRecognition() {}
function changeLanguage(lang) {
    currentLanguage = lang;
}
