// ambulance-booking.js
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('ambulanceBookingForm');
    const reasonSelect = document.getElementById('reason');
    const otherReasonContainer = document.getElementById('otherReasonContainer');
    const confirmationSection = document.getElementById('confirmation');
    const bookingFormContainer = document.querySelector('.booking-form-container');
    const newBookingButton = document.getElementById('newBookingButton');
    
    // Show/hide other reason input based on selection
    reasonSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherReasonContainer.style.display = 'block';
        } else {
            otherReasonContainer.style.display = 'none';
        }
    });
    
    // Generate a random booking ID
    function generateBookingId() {
        const prefix = 'AMB';
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${randomNum}`;
    }
    
    // Handle form submission
    // Handle form submission
bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const location = document.getElementById('location').value;
    const contact = document.getElementById('contact').value;
    let reason = document.getElementById('reason').value;

    // If reason is "other", use the custom reason
    if (reason === 'other') {
        reason = document.getElementById('otherReason').value || 'Other (not specified)';
    } else {
        // Get the text of the selected option
        reason = document.getElementById('reason').options[document.getElementById('reason').selectedIndex].text;
    }

    // Generate booking ID (for frontend display only)
    const bookingId = generateBookingId();

    try {
        // 🔹 Send data to backend
        const response = await fetch("http://localhost:5004/api/ambulance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: name,
                age: parseInt(age, 10),
                gender: "N/A", // ⚠️ if you have gender field in your HTML, capture it here
                blood_group: "N/A", // ⚠️ if you have blood group field, capture it too
                location_address: location,
                contact_number: contact,
                reason_for_ambulance: reason
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to book ambulance");
        }

        // Display confirmation with details
        document.getElementById('bookingIdDisplay').textContent = bookingId;
        document.getElementById('nameDisplay').textContent = name;
        document.getElementById('ageDisplay').textContent = age;
        document.getElementById('locationDisplay').textContent = location;
        document.getElementById('contactDisplay').textContent = contact;
        document.getElementById('reasonDisplay').textContent = reason;

        // Hide form and show confirmation
        bookingFormContainer.style.display = 'none';
        confirmationSection.style.display = 'block';

        // Scroll to confirmation
        confirmationSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        alert("❌ Error: " + error.message);
    }
});

    
    // Handle new booking button
    newBookingButton.addEventListener('click', function() {
        // Reset form
        bookingForm.reset();
        otherReasonContainer.style.display = 'none';
        
        // Show form and hide confirmation
        bookingFormContainer.style.display = 'block';
        confirmationSection.style.display = 'none';
        
        // Scroll to form
        bookingFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add input validation for contact number
    const contactInput = document.getElementById('contact');
    contactInput.addEventListener('input', function() {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
    });
});