// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set current date
    setCurrentDate();

    // Setup event listeners
    setupEventListeners();

    // Fetch and populate user data
    loadUserData();
});

// Set current date in the header
function setCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = currentDate;
}

// Fetch user data from API
async function loadUserData() {
    const phone = localStorage.getItem("patientPhone");

    if (!phone) {
        alert("Session expired. Please login again.");
        window.location.href = "../login-page/login.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:5004/api/users?phone_number=${phone}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        // Populate UI
        populateUserData(data);

        // Save to localStorage (for editing)
        localStorage.setItem("userData", JSON.stringify(data));
    } catch (err) {
        console.error("❌ loading user:", err);
        alert("loading patient details.");
    }
}

// Setup all event listeners
function setupEventListeners() {

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}

// Populate user data in the UI
    function populateUserData(userData) {
        document.querySelectorAll('.userName').forEach(el => {
        el.textContent = userData.name;
    });

    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userPhone_number').textContent = userData.phone_number;
    document.getElementById('userDob').textContent = formatDate(userData.dob);
    document.getElementById('userGender').textContent = userData.gender;
    document.getElementById('userAddress').textContent = userData.address;
    document.getElementById('userCity').textContent = userData.city;
    document.getElementById('userPincode').textContent = userData.pincode;
    document.getElementById('userFullName').textContent = userData.name;
    // Top navbar + avatar
    document.getElementById('navUserName').textContent = userData.name;
    document.getElementById('userAvatar').src =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;



    populateEditForm(userData);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Populate edit form with user data
function populateEditForm(userData) {
    document.getElementById('editName').value = userData.name || "";
    document.getElementById('editEmail').value = userData.email || "";
    document.getElementById('editPhone_number').value = userData.phone_number || "";
    document.getElementById('editDob').value = userData.dob ? userData.dob.split("T")[0] : "";
    document.getElementById('editGender').value = userData.gender || "";
    document.getElementById('editAddress').value = userData.address || "";
    document.getElementById('editCity').value = userData.city || "";
    document.getElementById('editPincode').value = userData.pincode || "";
}

// Open edit modal
/*function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'flex';

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    populateEditForm(userData);
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}

// Handle profile form submission
function handleProfileUpdate(e) {
    e.preventDefault();

    const updatedData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone_number: document.getElementById('editPhone_number').value,
        dob: document.getElementById('editDob').value,
        gender: document.getElementById('editGender').value,
        address: document.getElementById('editAddress').value,
        city: document.getElementById('editCity').value,
        pincode: document.getElementById('editPincode').value,
    };

    // Update UI
    populateUserData(updatedData);

    // Save locally
    localStorage.setItem("userData", JSON.stringify(updatedData));

    closeEditModal();
    alert('Profile updated successfully!');
}*/

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '../home-page/index.html';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
}
