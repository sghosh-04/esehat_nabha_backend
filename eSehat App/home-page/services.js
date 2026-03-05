document.addEventListener('DOMContentLoaded', function() {
    // Services data
    const services = [
        {
            id: 'online-consultation',
            title: 'Online Consultation',
            icon: 'fas fa-video',
            description: 'Consult with experienced doctors from the comfort of your home through secure video calls.',
            features: [
                'Video consultation with specialists',
                'Prescription delivered electronically',
                'Follow-up appointments scheduling',
                'Secure and private communication'
            ],
            price: 'Free',
            priceNote: 'consultation',
            details: {
                description: 'Our online consultation service allows you to connect with qualified doctors through secure video calls. Get medical advice, prescriptions, and follow-up care without leaving your home.',
                benefits: [
                    {
                        icon: 'fas fa-clock',
                        title: '24/7 Availability',
                        text: 'Access to doctors round the clock for urgent medical needs'
                    },
                    {
                        icon: 'fas fa-rupee-sign',
                        title: 'Affordable Pricing',
                        text: 'Quality healthcare at a fraction of in-person consultation costs'
                    },
                    {
                        icon: 'fas fa-shield-alt',
                        title: 'Secure & Private',
                        text: 'End-to-end encryption ensures your medical data remains confidential'
                    },
                    {
                        icon: 'fas fa-file-prescription',
                        title: 'E-Prescriptions',
                        text: 'Get digital prescriptions that can be used at any pharmacy'
                    }
                ],
                process: [
                    'Book an appointment through our platform',
                    'Receive confirmation with meeting details',
                    'Join the video call at the scheduled time',
                    'Receive your prescription and advice after consultation'
                ]
            }
        },
        {
            id: 'appointment-booking',
            title: 'Appointment Booking',
            icon: 'fas fa-calendar-check',
            description: 'Book appointments with specialist doctors at hospitals and clinics near you.',
            features: [
                'Wide network of specialist doctors',
                'Real-time availability checking',
                'Instant confirmation',
                'Reminder notifications'
            ],
            price: 'Free',
            priceNote: 'booking service',
            details: {
                description: 'Our appointment booking service helps you find and book appointments with the best doctors in your area. Filter by specialty, availability, location, and patient reviews to find the right healthcare provider.',
                benefits: [
                    {
                        icon: 'fas fa-search',
                        title: 'Find Specialists',
                        text: 'Search from hundreds of doctors across various specialties'
                    },
                    {
                        icon: 'fas fa-map-marker-alt',
                        title: 'Location Based',
                        text: 'Find doctors near your location with distance indicators'
                    },
                    {
                        icon: 'fas fa-star',
                        title: 'Ratings & Reviews',
                        text: 'Make informed decisions based on patient experiences'
                    },
                    {
                        icon: 'fas fa-bell',
                        title: 'Smart Reminders',
                        text: 'Get timely reminders so you never miss an appointment'
                    }
                ],
                process: [
                    'Search for doctors by specialty or name',
                    'Check available time slots',
                    'Book your preferred appointment time',
                    'Receive confirmation and reminders'
                ]
            }
        },
        {
            id: 'medicine-delivery',
            title: 'Medicine Delivery',
            icon: 'fas fa-pills',
            description: 'Get your prescribed medicines delivered to your doorstep within hours.',
            features: [
                'Wide range of medicines available',
                'Fast delivery within 2-4 hours',
                'Authentic medicines from licensed pharmacies',
                'Order tracking facility'
            ],
            price: '₹49',
            priceNote: 'delivery charge',
            details: {
                description: 'Our medicine delivery service ensures you get your prescribed medications quickly and conveniently. We partner with licensed pharmacies to guarantee authenticity and quality of all medicines.',
                benefits: [
                    {
                        icon: 'fas fa-truck',
                        title: 'Fast Delivery',
                        text: 'Get medicines delivered to your doorstep within hours'
                    },
                    {
                        icon: 'fas fa-check-circle',
                        title: 'Authentic Medicines',
                        text: 'All medicines sourced from licensed pharmacies only'
                    },
                    {
                        icon: 'fas fa-prescription',
                        title: 'Prescription Management',
                        text: 'We help you manage refills and recurring prescriptions'
                    },
                    {
                        icon: 'fas fa-headset',
                        title: 'Pharmacist Support',
                        text: '24/7 access to qualified pharmacists for advice'
                    }
                ],
                process: [
                    'Upload your prescription or select from past orders',
                    'Get price confirmation and delivery time',
                    'Make payment through secure channels',
                    'Track your order in real-time until delivery'
                ]
            }
        },
        {
            id: 'health-records',
            title: 'Health Records',
            icon: 'fas fa-file-medical',
            description: 'Access and manage your health records anytime, anywhere securely.',
            features: [
                'Centralized health record storage',
                'Access from any device',
                'Share records with doctors securely',
                'Health trend analysis'
            ],
            price: 'Free',
            priceNote: 'basic plan',
            details: {
                description: 'Our digital health records service provides a secure platform to store, manage, and share your medical history. Keep all your health information in one place and access it whenever you need it.',
                benefits: [
                    {
                        icon: 'fas fa-cloud',
                        title: 'Cloud Storage',
                        text: 'Your records are securely stored and accessible from anywhere'
                    },
                    {
                        icon: 'fas fa-share-alt',
                        title: 'Easy Sharing',
                        text: 'Securely share records with doctors with just a few clicks'
                    },
                    {
                        icon: 'fas fa-chart-line',
                        title: 'Health Insights',
                        text: 'Get insights into your health trends and patterns over time'
                    },
                    {
                        icon: 'fas fa-lock',
                        title: 'Bank-Level Security',
                        text: 'Your health data is protected with advanced encryption'
                    }
                ],
                process: [
                    'Upload your medical reports and records',
                    'Organize them by date, type, or provider',
                    'Access your complete medical history anytime',
                    'Share specific records with healthcare providers as needed'
                ]
            }
        },
        {
            id: 'emergency-care',
            title: 'Emergency Care',
            icon: 'fas fa-ambulance',
            description: '24/7 emergency medical assistance and ambulance services when you need it most.',
            features: [
                '24/7 emergency response',
                'Ambulance with trained paramedics',
                'Coordination with hospitals',
                'Emergency contact notification'
            ],
            price: 'Varies',
            priceNote: 'based on service',
            details: {
                description: 'Our emergency care service provides immediate medical assistance during critical situations. With a network of ambulances and partnerships with hospitals, we ensure you get the right care at the right time.',
                benefits: [
                    {
                        icon: 'fas fa-clock',
                        title: 'Rapid Response',
                        text: 'Quick dispatch of ambulances and emergency personnel'
                    },
                    {
                        icon: 'fas fa-user-md',
                        title: 'Trained Paramedics',
                        text: 'Qualified medical professionals provide care en route to hospital'
                    },
                    {
                        icon: 'fas fa-hospital',
                        title: 'Hospital Coordination',
                        text: 'We coordinate with hospitals to ensure readiness for your arrival'
                    },
                    {
                        icon: 'fas fa-family',
                        title: 'Family Notification',
                        text: 'Automatic notification to emergency contacts when activated'
                    }
                ],
                process: [
                    'Call our emergency helpline or use the panic button in our app',
                    'Provide location and details of the emergency',
                    'Ambulance dispatched with trained paramedics',
                    'Continuous coordination until patient reaches hospital'
                ]
            }
        },
        {
            id: 'health-packages',
            title: 'Health Packages',
            icon: 'fas fa-heartbeat',
            description: 'Comprehensive health check-up packages designed for different needs and age groups.',
            features: [
                'Preventive health screenings',
                'Customizable packages',
                'Home sample collection',
                'Doctor consultation included'
            ],
            price: 'Free',
            priceNote: 'basic package',
            details: {
                description: 'Our health packages offer comprehensive preventive health screenings tailored to different age groups, genders, and health conditions. Early detection through regular check-ups can prevent many health issues.',
                benefits: [
                    {
                        icon: 'fas fa-search',
                        title: 'Comprehensive Screening',
                        text: 'Thorough tests to detect health issues at early stages'
                    },
                    {
                        icon: 'fas fa-home',
                        title: 'Home Collection',
                        text: 'Sample collection from your home at your convenience'
                    },
                    {
                        icon: 'fas fa-user-md',
                        title: 'Doctor Consultation',
                        text: 'Detailed consultation with doctors to understand your reports'
                    },
                    {
                        icon: 'fas fa-chart-pie',
                        title: 'Personalized Recommendations',
                        text: 'Actionable health recommendations based on your results'
                    }
                ],
                process: [
                    'Choose a package that suits your needs',
                    'Schedule sample collection at your convenience',
                    'Get tested by trained professionals',
                    'Receive reports and consult with doctors'
                ]
            }
        }
    ];

    // Initialize services
    function initServices() {
        const servicesGrid = document.getElementById('servicesGrid');
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.dataset.id = service.id;
            
            serviceCard.innerHTML = `
                <div class="service-card-header">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h3>${service.title}</h3>
                </div>
                <div class="service-card-body">
                    <p>${service.description}</p>
                    <ul class="service-features">
                        ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="service-card-footer">
                    <div class="service-price">${service.price} <span>${service.priceNote}</span></div>
                    <button class="btn-primary">Learn More</button>
                </div>
            `;
            
            servicesGrid.appendChild(serviceCard);
            
            // Add click event to open modal
            serviceCard.addEventListener('click', function() {
                openServiceModal(service);
            });
        });
    }

    // Open service modal
    function openServiceModal(service) {
        const modal = document.getElementById('serviceModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="modal-service-header">
                <div class="modal-service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h2>${service.title}</h2>
                <p class="modal-service-description">${service.description}</p>
            </div>
            
            <div class="modal-service-content">
                <h3>Service Overview</h3>
                <p>${service.details.description}</p>
                
                <div class="modal-details-grid">
                    ${service.details.benefits.map(benefit => `
                        <div class="detail-card">
                            <i class="${benefit.icon}"></i>
                            <h4>${benefit.title}</h4>
                            <p>${benefit.text}</p>
                        </div>
                    `).join('')}
                </div>
                
                <h3>How It Works</h3>
                <ol>
                    ${service.details.process.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary"> <a href="../login-page/index.html"> Book This Service </a></button>
                <button class="btn-outline close-modal-btn">Close</button>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Add event to close modal button
        const closeModalBtn = document.querySelector('.close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
    }

    // Close modal function
    function closeModal() {
        const modal = document.getElementById('serviceModal');
        modal.style.display = 'none';
    }

    // Event listeners for modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('serviceModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#fff';
        nav.style.padding = '20px';
        nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });

    // Initialize services on page load
    initServices();
});