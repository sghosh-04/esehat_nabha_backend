// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function () {
    setCurrentDateTime();
    await loadDoctorData(); // load from backend
    await loadAppointments(); // load appointments
    setupEventListeners();
    setInterval(setCurrentDateTime, 60000);
});

// Set current date and time
function setCurrentDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Load doctor data from backend
async function loadDoctorData() {
    try {
        const doctorLicense = localStorage.getItem('doctorLicense');
        const token = localStorage.getItem('doctorToken');

        if (!doctorLicense || !token) throw new Error('Missing credentials. Please login again.');

        const res = await fetch(`http://localhost:5004/api/doctors/${doctorLicense}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch doctor details: ${res.status}`);
        }

        const data = await res.json();
        populateDoctorData(data);
        
        // Store doctor ID for appointments
        localStorage.setItem('doctorId', data.id);
    } catch (error) {
        console.error('Error loading doctor data:', error);
        alert('❌ Failed to load doctor data. Please login again.');
        window.location.href = 'index.html';
    }
}

// Load appointments from backend
async function loadAppointments() {
    try {
        const doctorId = localStorage.getItem('doctorId');
        const token = localStorage.getItem('doctorToken');

        if (!doctorId || !token) throw new Error('Missing credentials. Please login again.');

        const res = await fetch(`http://localhost:5004/api/appointments/doctor/${doctorId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch appointments: ${res.status}`);
        }

        const data = await res.json();
        const appointments = data.data?.appointments || data.appointments || [];
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        displayAppointments([]);
    }
}

// Display appointments in the UI
function displayAppointments(appointments) {
    const appointmentsContainer = document.getElementById('appointmentsList');
    
    if (!appointmentsContainer) {
        console.error('Appointments container not found');
        return;
    }

    // Clear existing content
    appointmentsContainer.innerHTML = '';

    if (!appointments || appointments.length === 0) {
        appointmentsContainer.innerHTML = `
            <div class="appointment-item">
                <div class="appointment-info">
                    <h4 class="patient-name">No appointments scheduled</h4>
                </div>
                <div class="appointment-date">
                    <span class="date">-</span>
                </div>
                <div class="appointment-time">
                    <span class="time">-</span>
                </div>
            </div>
        `;
        return;
    }

    // Sort appointments by date and time (soonest first)
    appointments.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    appointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        appointmentsContainer.appendChild(appointmentElement);
    });
}

// Create HTML element for each appointment
function createAppointmentElement(appointment) {
    const status = (appointment.status || 'pending').toLowerCase();
    const appointmentDiv = document.createElement('div');
    appointmentDiv.className = 'appointment-item';
    
    // Format date and time from scheduled_time
    const scheduledTime = new Date(appointment.scheduled_time);
    const formattedDate = scheduledTime.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const formattedTime = scheduledTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    

    appointmentDiv.innerHTML = `
        <div class="appointment-info">
            <h4 class="patient-name">${appointment.patient_name}</h4>

            <p class="visit-reason">
                <strong>Reason:</strong> ${appointment.symptoms || "Not provided"}
            </p>

            <span class="status ${status}">
                ${
                    status === 'pending' ? 'Pending Approval' :
                    status === 'accepted' ? 'Accepted' :
                    status === 'rejected' ? 'Rejected' :
                    status === 'cancelled' ? 'Cancelled' :
                    status
                }
            </span>
        </div>

        <div class="appointment-date">
            <span class="date">${formattedDate}</span>
        </div>

        <div class="appointment-time">
            <span class="time">${formattedTime}</span>
        </div>

        <div class="appointment-actions">
            ${
                status === 'pending'
                ? `
                    <button class="accept-btn" onclick="acceptAppointment(${appointment.id})">
                    ✅ Accept
                    </button>
                    <button class="reject-btn" onclick="rejectAppointment(${appointment.id})">
                    ❌ Reject
                    </button>
                `
                : `
                    <button
                    class="btn btn-secondary"
                    onclick="openPrescription('${appointment.patient_phone}')"
                    >
                    View Prescription
                    </button>
                `
            }
        </div>
    `;


    
    return appointmentDiv;
}

// Populate doctor data in the UI
function populateDoctorData(data) {
    const [firstName, lastName] = data.name.split(' ');

        // 🔥 SET PROFILE IMAGE (BIG CIRCLE + NAVBAR)
    const profileUrl = data.picture_url
        ? `http://localhost:5004/uploads/${data.picture_url}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=4b6cb7&color=fff&size=120`;

    // Set big circle image
    document.getElementById("doctorProfileImage").src = profileUrl;

    // Set navbar small image
    const navImg = document.getElementById("doctorProfileImageNav");
    if (navImg) navImg.src = profileUrl;


    document.getElementById('doctorName').textContent = firstName;
    document.getElementById('doctorFirstName').textContent = firstName;
    document.getElementById('doctorFullName').textContent = `Dr. ${data.name}`;
    document.getElementById('doctorEmail').textContent = data.email;
    document.getElementById('doctorPhone').textContent = data.phonenumber;
    document.getElementById('doctorSpecialization').textContent = data.specialization;
    document.getElementById('doctorExperience').textContent = `${data.experience} years of experience`;
    document.getElementById('doctorRegNumber').textContent = data.license_number;


    if (data.clinic_address) {
        document.getElementById('doctorAddress').textContent = data.clinic_address;
    }

    // Populate specializations
    if (Array.isArray(data.specializations)) {
        const specializationNames = data.specializations.map(s => (typeof s === 'string' ? s : s.name));
        updateList('specializationsList', specializationNames);
    } else {
        updateList('specializationsList', []);
    }

    // Populate qualifications
    if (Array.isArray(data.qualifications)) {
        const qualificationNames = data.qualifications.map(q => (typeof q === 'string' ? q : q.name));
        updateList('qualificationsList', qualificationNames);
    } else {
        updateList('qualificationsList', []);
    }
}

// Helper to update UL lists
function updateList(elementId, items) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        document.getElementById('editProfileModal').style.display = 'flex';
    });
    document.querySelector('.close')?.addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit')?.addEventListener('click', closeEditModal);
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

    window.addEventListener('click', event => {
        if (event.target === document.getElementById('editProfileModal')) closeEditModal();
    });

    document.querySelector('.hamburger')?.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
        document.querySelector('.hamburger').classList.toggle('active');
    });


        // CLICK CAMERA ICON → OPEN FILE UPLOADER
    document.querySelector('.profile-overlay')?.addEventListener('click', () => {
        document.getElementById('profileUpload').click();
    });

    // WHEN FILE SELECTED → UPLOAD TO BACKEND
    document.getElementById('profileUpload')?.addEventListener('change', uploadProfileImage);


}

function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    const updatedData = {
        name: document.getElementById('editFirstName').value + ' ' + document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phonenumber: document.getElementById('editPhone').value,
        specialization: document.getElementById('editSpecialization').value,
        experience: document.getElementById('editExperience').value,
        license_number: document.getElementById('editRegNumber').value
    };

    localStorage.setItem('doctorData', JSON.stringify(updatedData));
    populateDoctorData(updatedData);
    closeEditModal();
    alert('Profile updated successfully!');
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('doctorId');
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorLicense');
        window.location.href = '../login-page/index.html';
    }
}

async function uploadProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("doctorToken");
    const doctorId = localStorage.getItem("doctorId");

    if (!token || !doctorId) {
        alert("Authentication error. Please login again.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch(
            `http://localhost:5004/api/doctors/${doctorId}/upload-profile`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // ❌ DO NOT set Content-Type for FormData
                },
                body: formData
            }
        );

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();

        // 🔥 Update profile image instantly
        const imageUrl = `http://localhost:5004/uploads/${data.picture_url}`;
        document.getElementById("doctorProfileImage").src = imageUrl;
        document.getElementById("doctorProfileImageNav").src = imageUrl;

        alert("✅ Profile picture updated successfully");

    } catch (err) {
        console.error(err);
        alert("❌ Image upload failed");
    }
}
function openPrescription(phone) {
    if (!phone) {
        alert("Patient phone number not available");
        return;
    }

    window.open(
      `http://localhost:5004/api/users/prescription?phone_number=${phone}`,
      "_blank"
    );
}




async function acceptAppointment(appointmentId) {
    const token = localStorage.getItem("doctorToken");
    const doctorId = localStorage.getItem("doctorId");

    if (!token || !doctorId) {
        alert("Authentication error. Please login again.");
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:5004/api/appointments/${appointmentId}/accept`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctor_id: doctorId
                })
            }
        );

        if (!res.ok) throw new Error("Accept failed");

        alert("✅ Appointment accepted");
        await loadAppointments();
    } catch (err) {
        console.error(err);
        alert("❌ Failed to accept appointment");
    }
}

async function rejectAppointment(appointmentId) {
    const reason = prompt("Reason for rejection:");
    //if (!reason) return;

    const token = localStorage.getItem("doctorToken");
    const doctorId = localStorage.getItem("doctorId");

    try {
        const res = await fetch(
            `http://localhost:5004/api/appointments/${appointmentId}/reject`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctor_id: doctorId,
                    reason
                })
            }
        );

        if (!res.ok) throw new Error("Reject failed");

        alert("❌ Appointment rejected");
        await loadAppointments();
    } catch (err) {
        console.error(err);
        alert("❌ Failed to reject appointment");
    }
}

