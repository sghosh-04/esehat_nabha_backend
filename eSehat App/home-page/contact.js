// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const openMapBtn = document.getElementById('openMapBtn');
    
    // Form validation
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Reset error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
        
        // Validate name
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }
        
        // Validate email
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate subject
        const subjectInput = document.getElementById('subject');
        if (!subjectInput.value.trim()) {
            document.getElementById('subjectError').textContent = 'Subject is required';
            isValid = false;
        }
        
        // Validate message
        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            document.getElementById('messageError').textContent = 'Message is required';
            isValid = false;
        }
        
        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the form data to a server here
            // For this example, we'll just show a success message
            contactForm.reset();
            successMessage.style.display = 'flex';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    });
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // Open map in new tab (placeholder functionality)
    openMapBtn.addEventListener('click', () => {
        // In a real application, this would open Google Maps with the location
        alert('This would open Google Maps with the location of e-Schat Nabha in a real application.');
    });
});