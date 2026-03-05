// Backend URL
const BACKEND_URL = 'http://localhost:5004';

// ----- User Info in Navbar -----
function setUserInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.name || 'Guest';

  const userNameElements = document.querySelectorAll('.userName');
  const userAvatar = document.getElementById('userAvatar');

  userNameElements.forEach(el => el.textContent = username);
  if (userAvatar) {
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
  }
}

// Get current user with ID
function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Raw user data from localStorage:', user);
  
  return {
    id: user.id || user.patient_id || user.user_id,
    name: user.name || 'Guest',
    phone: user.phone_number || user.phone
  };
}

// Load user data if not already in localStorage
async function loadUserData() {
  const phone = localStorage.getItem("patientPhone");
  
  if (!phone) {
    console.warn("No phone number found in localStorage");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users?phone_number=${phone}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    const data = await res.json();
    
    console.log('API user response:', data);
    
    // Handle different response structures
    if (data.data && data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      populateNavbar(data.data.user);
    } else if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      populateNavbar(data.user);
    } else if (data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
      populateNavbar(data.data);
    } else {
      localStorage.setItem('user', JSON.stringify(data));
      populateNavbar(data);
    }
  } catch (err) {
    console.error("Error loading user:", err);
  }
}

function populateNavbar(userData) {
  document.querySelectorAll('.userName').forEach(el => {
    el.textContent = userData.name || 'Guest';
  });

  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;
  }
}

// DOM Elements
const currentDateElement = document.getElementById('currentDate');
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const appointmentDateInput = document.getElementById('appointmentDate');
const appointmentTimeSelect = document.getElementById('appointmentTime');
const appointmentForm = document.getElementById('appointmentForm');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const appointmentFilter = document.getElementById('appointmentFilter');

// Map frontend dropdown values to backend specialization strings
const specializationMap = {
  cardiology: 'Cardiology',
  neurology: 'Neurology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
  dermatology: 'Dermatology',
  general: 'General'
};

// Set current date
function setCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Convert 12-hour time to 24-hour format
function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

// Load departments from backend
async function loadDepartments() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/appointments/specializations`);
    const data = await response.json();
    console.log('Departments API response:', data);

    departmentSelect.innerHTML = '<option value="">Select Department</option>';

    if (data.success && Array.isArray(data.data.specializations)) {
      data.data.specializations.forEach(spec => {
        const option = document.createElement('option');
        option.value = spec.toLowerCase();
        option.textContent = spec;
        departmentSelect.appendChild(option);
      });
    } else {
      console.warn('No departments returned, using fallback.');
      loadFallbackDepartments();
    }
  } catch (error) {
    console.error('Error loading departments:', error);
    loadFallbackDepartments();
  }
}

// Fallback departments
function loadFallbackDepartments() {
  const fallbackDepartments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General'];
  fallbackDepartments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept.toLowerCase();
    option.textContent = dept;
    departmentSelect.appendChild(option);
  });
}

// Load doctors by specialization
async function loadDoctorsBySpecialization(frontendValue) {
  const specialization = specializationMap[frontendValue] || frontendValue;
  console.log('Loading doctors for specialization:', specialization);

  doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
  doctorSelect.disabled = false;

  try {
    const response = await fetch(`${BACKEND_URL}/api/appointments/doctors/${encodeURIComponent(specialization)}`);
    const data = await response.json();
    console.log('Doctors API response:', data);

    if (data.success && data.data && Array.isArray(data.data.doctors)) {
      data.data.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialization}`;
        doctorSelect.appendChild(option);
      });
    } else if (data.doctors && Array.isArray(data.doctors)) {
      data.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialization}`;
        doctorSelect.appendChild(option);
      });
    } else {
      console.warn('No doctors returned, using fallback.');
      loadFallbackDoctors(specialization);
    }
  } catch (error) {
    console.error('Error loading doctors:', error);
    loadFallbackDoctors(specialization);
  }
}

// Fallback doctors
function loadFallbackDoctors(specialization) {
  const fallbackDoctors = {
    Cardiology: [
      { id: 1, name: "Dr. Rajesh Kumar", specialization: "Cardiologist" },
      { id: 2, name: "Dr. Priya Sharma", specialization: "Cardiologist" }
    ],
    Neurology: [
      { id: 3, name: "Dr. Anil Verma", specialization: "Neurologist" },
      { id: 4, name: "Dr. Sunita Patel", specialization: "Neurologist" }
    ],
    Orthopedics: [
      { id: 5, name: "Dr. Sanjay Gupta", specialization: "Orthopedic Surgeon" },
      { id: 6, name: "Dr. Meera Joshi", specialization: "Orthopedic Specialist" }
    ],
    Pediatrics: [
      { id: 7, name: "Dr. Ravi Menon", specialization: "Pediatrician" },
      { id: 8, name: "Dr. Anjali Desai", specialization: "Child Specialist" }
    ],
    Dermatology: [
      { id: 9, name: "Dr. Neha Singh", specialization: "Dermatologist" },
      { id: 10, name: "Dr. Vikram Reddy", specialization: "Skin Specialist" }
    ],
    General: [
      { id: 11, name: "Dr. Amitabh Choudhary", specialization: "General Physician" },
      { id: 12, name: "Dr. Kavita Nair", specialization: "Family Medicine" }
    ]
  };

  const doctors = fallbackDoctors[specialization] || [];
  doctors.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor.id;
    option.textContent = `${doctor.name} - ${doctor.specialization}`;
    doctorSelect.appendChild(option);
  });
}

// Department change handler
function handleDepartmentChange() {
  const selectedDept = departmentSelect.value;
  console.log('Department changed to:', selectedDept);

  doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
  appointmentTimeSelect.innerHTML = '<option value="">Select Time</option>';

  if (selectedDept) {
    doctorSelect.disabled = false;
    loadDoctorsBySpecialization(selectedDept);
    appointmentDateInput.disabled = false;
  } else {
    doctorSelect.disabled = true;
    appointmentDateInput.disabled = true;
    appointmentTimeSelect.disabled = true;
  }
}

// Doctor change handler
function handleDoctorChange() {
  const selectedDoctorId = doctorSelect.value;
  console.log('Doctor changed to:', selectedDoctorId);
  
  if (selectedDoctorId && appointmentDateInput.value) {
    handleDateChange();
  }
}

// Date change handler
function handleDateChange() {
  const selectedDate = appointmentDateInput.value;
  const selectedDoctorId = doctorSelect.value;
  console.log('Date changed to:', selectedDate, 'Doctor ID:', selectedDoctorId);

  appointmentTimeSelect.innerHTML = '<option value="">Select Time</option>';

  if (selectedDate && selectedDoctorId) {
    appointmentTimeSelect.disabled = false;
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    timeSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      appointmentTimeSelect.appendChild(option);
    });
  } else {
    appointmentTimeSelect.disabled = true;
  }
}

// Form submit handler
async function handleFormSubmit(event) {
  event.preventDefault();
  console.log('=== FORM SUBMIT TRIGGERED ===');

  const user = getCurrentUser();
  console.log('1. User object:', user);

  if (!user.id) {
    console.error('No user ID found');
    alert('❌ Please login again to book an appointment.');
    return;
  }

  const department = departmentSelect.value;
  const doctorId = doctorSelect.value;
  const doctorText = doctorSelect.options[doctorSelect.selectedIndex]?.text || '';
  const doctorName = doctorText.split(' - ')[0];
  const date = appointmentDateInput.value;
  const time = appointmentTimeSelect.value;
  const reason = document.getElementById('reason').value;

  console.log('2. Form values:', { 
    department, 
    doctorId, 
    doctorName, 
    date, 
    time, 
    reason 
  });

  // Validate all fields
  if (!department || !doctorId || !date || !time || !reason) {
    console.error('Missing fields:', { department, doctorId, date, time, reason });
    alert('❌ Please fill in all required fields.');
    return;
  }

  const scheduledTime = `${date}T${convertTo24Hour(time)}`;
  console.log('3. Scheduled time:', scheduledTime);

  const appointmentData = {
    patient_id: parseInt(user.id),
    doctor_id: parseInt(doctorId),
    patient_name: user.name,
    doctor_name: doctorName,
    scheduled_time: scheduledTime,
    symptoms: reason,
    time_slot: time,
    department: department
  };

  console.log('4. Final data to send:', appointmentData);

  try {
    console.log('5. Starting fetch request to:', `${BACKEND_URL}/api/appointments/`);
    
    const response = await fetch(`${BACKEND_URL}/api/appointments/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });

    console.log('6. Fetch completed. Status:', response.status);
    console.log('7. Response OK:', response.ok);

    const responseText = await response.text();
    console.log('8. Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('9. Parsed JSON data:', data);
    } catch (e) {
      console.error('10. JSON parse error:', e);
      console.log('Response was not JSON:', responseText);
      return;
    }

    console.log('11. Final processed data:', data);

    if (data.success) {
      alert('✅ Appointment booked successfully!');
      appointmentForm.reset();
      departmentSelect.value = '';
      
      // Reload appointments after booking
      loadUserAppointments();
    } else {
      alert('❌ Failed to book appointment: ' + (data.message || 'Unknown error'));
    }
    
  } catch (error) {
    console.error('12. FETCH ERROR:', error);
    alert('❌ Network error. Please check console for details.');
  }
}

// ========== APPOINTMENT LOADING SYSTEM ==========

// Load user appointments - FIXED for your backend
// Load user appointments - FIXED for current user only
async function loadUserAppointments() {
  console.log('=== LOADING APPOINTMENTS ===');
  
  const user = getCurrentUser();
  console.log('User data:', user);
  
  const appointmentsList = document.getElementById('appointmentsList');
  if (!appointmentsList) {
    console.error('Appointments list element not found!');
    return;
  }

  // Show loading state
  appointmentsList.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading appointments...</p>
    </div>
  `;

  if (!user.id) {
    showErrorMessage("No user found. Please log in again.");
    return;
  }

  try {
    // Fetch appointments only for logged-in user
    console.log(`🔄 Fetching appointments for patient_id: ${user.id}`);
    const response = await fetch(`${BACKEND_URL}/api/appointments/patient/${user.id}`);

    if (!response.ok) {
      console.error(`❌ Failed with status: ${response.status}`);
      showErrorMessage("Unable to load your appointments.");
      return;
    }

    const data = await response.json();
    console.log("✅ Appointments API response:", data);

    if (data.success && data.data && Array.isArray(data.data.appointments)) {
      displayAppointments(data.data.appointments);
    } else {
      showNoAppointmentsMessage();
    }
  } catch (error) {
    console.error('❌ Error loading appointments:', error);
    showErrorMessage('Could not connect to server. Please try again.');
  }
}


// Display appointments (fixed for your backend format)
function displayAppointments(appointments) {
  const appointmentsList = document.getElementById('appointmentsList');
  if (!appointmentsList) return;

  console.log('Displaying appointments:', appointments);

  if (appointments && appointments.length > 0) {
    let html = '<div class="appointments-container">';
    
    appointments.forEach(appointment => {
      // Format date and time - your backend returns scheduled_time
      let dateStr = 'Date not available';
      let timeStr = 'Time not available';
      
      try {
        if (appointment.scheduled_time) {
          const date = new Date(appointment.scheduled_time);
          if (!isNaN(date)) {
            dateStr = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            timeStr = date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
          }
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }

      const doctorName = appointment.doctor_name || 'Doctor';
      const department = appointment.specialization || appointment.department || 'General';
      const symptoms = appointment.symptoms || 'Not specified';
      const status = (appointment.status || 'scheduled').toLowerCase();


      html += `
        <div class="appointment-card">
          <div class="appointment-header">
            <h4>Dr. ${doctorName}</h4>
            <span class="status-badge ${status}">
              ${status === 'scheduled' ? 'Scheduled' :
                status === 'cancelled' ? 'Cancelled' :
                status}
            </span>

          </div>
          <div class="appointment-details">
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeStr}</p>
            <p><strong>Reason:</strong> ${symptoms}</p>
          </div>
          <div class="appointment-actions">
            ${
              status === 'scheduled'
                ? `
                  <button class="btn-outline" onclick="cancelAppointment(${appointment.id})">
                    Cancel
                  </button>
                  <button class="btn-primary" onclick="rescheduleAppointment(${appointment.id})">
                    Reschedule
                  </button>
                `
                : ''
            }
          </div>

        </div>
      `;
    });
    
    html += '</div>';
    appointmentsList.innerHTML = html;
    
    // Apply filter if any
    if (appointmentFilter && appointmentFilter.value !== 'all') {
      setTimeout(() => filterAppointments(), 100);
    }
  } else {
    showNoAppointmentsMessage();
  }
}

// Show no appointments message
function showNoAppointmentsMessage() {
  const appointmentsList = document.getElementById('appointmentsList');
  if (appointmentsList) {
    appointmentsList.innerHTML = `
      <div class="no-appointments">
        <i class="fas fa-calendar-check"></i>
        <p>No appointments found for ${getCurrentUser().name}</p>
        <button class="btn-primary" onclick="switchTab('new-appointment')">Book Your First Appointment</button>
      </div>
    `;
  }
}

// Show error message
function showErrorMessage(message) {
  const appointmentsList = document.getElementById('appointmentsList');
  if (appointmentsList) {
    appointmentsList.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="btn-primary" onclick="loadUserAppointments()">Try Again</button>
      </div>
    `;
  }
}

// Debug function to test endpoints
async function debugAppointments() {
  const user = getCurrentUser();
  console.log('=== DEBUG APPOINTMENTS ===');
  console.log('Current User:', user);
  
  // Test the exact endpoint your backend expects
  const testIds = [10, user.id].filter(id => id);
  
  for (const testId of testIds) {
    console.log(`\n--- Testing patient_id: ${testId} ---`);
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/patient/${testId}`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success && data.data && data.data.appointments) {
        console.log(`✅ FOUND ${data.data.appointments.length} appointments for patient_id ${testId}`);
      }
    } catch (error) {
      console.error('Debug error:', error);
    }
  }
}

// ========== END OF APPOINTMENT LOADING SYSTEM ==========

// Filter appointments by status
function filterAppointments() {
  const filterValue = appointmentFilter.value;
  const appointmentCards = document.querySelectorAll('.appointment-card');
  
  appointmentCards.forEach(card => {
    const statusBadge = card.querySelector('.status-badge');
    const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
    
    if (filterValue === 'all' || status === filterValue) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Cancel appointment function
async function cancelAppointment(appointmentId) {
  if (!confirm('Are you sure you want to cancel this appointment?')) return;

  const reason = prompt("Please provide a reason for cancellation:");
  if (!reason) return;

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/appointments/${appointmentId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("✅ Appointment cancelled successfully");
      loadUserAppointments(); // refresh list
    } else {
      alert("❌ " + data.message);
    }

  } catch (error) {
    console.error("Cancel appointment error:", error);
    alert("❌ Failed to cancel appointment");
  }
}


// Reschedule appointment function
function rescheduleAppointment(appointmentId) {
  console.log('Rescheduling appointment:', appointmentId);
  switchTab('new-appointment');
  alert('Please book a new appointment with your preferred date and time.');
}

// Switch tabs
function switchTab(tabId) {
  console.log('Switching to tab:', tabId);
  
  tabButtons.forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-tab') === tabId);
  });
  
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  // Load appointments when switching to booked appointments tab
  if (tabId === 'booked-appointments') {
    loadUserAppointments();
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// Initialize page
async function init() {
  console.log('Initializing appointment page...');
  
  setCurrentDate();
  appointmentDateInput.min = new Date().toISOString().split('T')[0];

  // Load user data first
  await loadUserData();
  setUserInfo();

  // Load departments
  await loadDepartments();

  // Event listeners
  departmentSelect.addEventListener('change', handleDepartmentChange);
  doctorSelect.addEventListener('change', handleDoctorChange);
  appointmentDateInput.addEventListener('change', handleDateChange);
  appointmentForm.addEventListener('submit', handleFormSubmit);
  
  // Add filter event listener
  if (appointmentFilter) {
    appointmentFilter.addEventListener('change', filterAppointments);
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.getAttribute('data-tab')));
  });

  hamburger.addEventListener('click', toggleMobileMenu);

  // Load appointments on page load if on booked appointments tab
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab && activeTab.id === 'booked-appointments') {
    loadUserAppointments();
  }
  
  console.log('Appointment page initialized successfully');
}

// Add global functions
window.switchTab = switchTab;
window.cancelAppointment = cancelAppointment;
window.rescheduleAppointment = rescheduleAppointment;
window.loadUserAppointments = loadUserAppointments;
window.debugAppointments = debugAppointments;

document.addEventListener('DOMContentLoaded', init);

// Run debug to see what's happening
setTimeout(() => {
  debugAppointments();
}, 1000);


// Dropdown toggle for user profile
const userProfile = document.querySelector('.user-profile');
if (userProfile) {
  userProfile.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent closing immediately
    const dropdown = this.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('active'); // Toggle visibility
    }
  });
}

// Close dropdown if clicking outside
document.addEventListener('click', function() {
  const dropdowns = document.querySelectorAll('.dropdown-menu.active');
  dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
});


// Navbar logout handler
function handleLogoutNavbar(e) {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    localStorage.clear(); // Clear all user data
    window.location.href = '../home-page/index.html'; // Redirect to homepage
  }
}

// Attach logout event to navbar logout link
const navbarLogout = document.querySelector('.logout-btn');
if (navbarLogout) {
  navbarLogout.addEventListener('click', handleLogoutNavbar);
}


// Navbar logout function
function logout(e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    localStorage.clear(); // Clear all user data
    window.location.href = '../home-page/index.html'; // Redirect to homepage
  }
}

// Make it global so inline onclick works
window.logout = logout;


// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userProfile) {
        // Toggle dropdown on click
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            // Close other open dropdowns if any
            document.querySelectorAll('.user-profile.active').forEach(profile => {
                if (profile !== this) {
                    profile.classList.remove('active');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
            }
        });

        // Close dropdown when clicking on dropdown items
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Logout functionality
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Function to show logout confirmation
    window.logout = function() {
        logoutModal.style.display = 'block';
        // Close dropdown when logout is clicked
        userProfile.classList.remove('active');
    };

    // Confirm logout
    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            // Perform logout action here
            window.location.href = '../home-page/index.html';
        });
    }

    // Cancel logout
    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });
});

// Profile functions (placeholder implementations)
function viewProfile() {
    alert('Profile page would open here');
    // Close dropdown after clicking
    document.querySelector('.user-profile').classList.remove('active');
}

function changePassword() {
    alert('Change password modal would open here');
    // Close dropdown after clicking
    document.querySelector('.user-profile').classList.remove('active');
}