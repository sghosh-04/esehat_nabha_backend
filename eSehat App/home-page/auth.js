document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
    const profileDropdown = document.getElementById("profileDropdown");
    const profileIcon = document.getElementById("profileIcon");
    const logoutBtn = document.getElementById("logoutBtn");
    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");

    // Simulated login (replace with real authentication later)
    function login(user) {
        // Hide login/signup
        authButtons.style.display = "none";

        // Show profile
        profileDropdown.style.display = "block";

        // Update user info
        profileName.textContent = user.name;
        profileRole.textContent = user.role;
    }

    // Simulated logout
    function logout() {
        profileDropdown.style.display = "none";
        authButtons.style.display = "flex"; // show login/signup back
    }

    // Toggle dropdown on profile icon click
    profileIcon.addEventListener("click", () => {
        const menu = profileDropdown.querySelector(".profile-menu");
        menu.classList.toggle("show");
    });

    // Logout click
    logoutBtn.addEventListener("click", () => {
        logout();
    });

    // Example: auto login a user (you’ll replace this with real login)
    const fakeUser = { name: "Subhankar Nandi", role: "Patient" };
    login(fakeUser);
});
