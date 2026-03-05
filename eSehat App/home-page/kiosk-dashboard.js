document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DASHBOARD DEBUG INFO ===');
    
    // Check what's stored in localStorage
    const kioskId = localStorage.getItem('kioskId');
    const kioskName = localStorage.getItem('kioskName');
    const userData = localStorage.getItem('userData');
    
    console.log('Stored kioskId:', kioskId);
    console.log('Stored kioskName:', kioskName);
    console.log('Stored userData:', userData);
    console.log('All localStorage:', localStorage);
    console.log('============================');

    // API Base URL
    const API_BASE_URL = 'http://localhost:5004/api';

    let allMedicines = [];
    let visibleMedicineCount = 3;
    const MEDICINES_PER_LOAD = 3;

    let allOrders = [];
    let visibleOrderCount = 3;
    const ORDERS_PER_LOAD = 3;

    let allAmbulanceRequests = [];
    let visibleAmbulanceCount = 3;
    const AMBULANCE_PER_LOAD = 3;

    let allSeminars = [];
    let visibleSeminarCount = 3;
    const SEMINARS_PER_LOAD = 3;



    // ------------------ Display Kiosk Information ------------------
    async function displayKioskInfo() {
        const storedKioskId = localStorage.getItem('kioskId');
        const storedKioskName = localStorage.getItem('kioskName');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        console.log('Displaying kiosk info:', { storedKioskId, storedKioskName, userData });

        let kioskNameToDisplay = storedKioskName;
        let kioskAdminName = 'Kiosk Administrator';
        let kioskLocation = 'Nabha Medical Center';
        let kioskIdFromDB = storedKioskId;

        if ((!storedKioskName || storedKioskName === 'Kiosk Administrator') && storedKioskId) {
            try {
                console.log('Fetching kiosk details from API...');
                const res = await fetch(`${API_BASE_URL}/kiosks/${storedKioskId}`);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const kioskData = await res.json();
                console.log('Kiosk API response:', kioskData);
                
                if (kioskData.success && kioskData.data) {
                    const kiosk = kioskData.data.kiosk || kioskData.data;
                    
                    if (kiosk) {
                        kioskIdFromDB = kiosk.kioskId || kiosk.id || storedKioskId;
                        kioskNameToDisplay = kiosk.kioskName || kiosk.name || kiosk.kiosk_name || 'Kiosk Name';
                        kioskAdminName = kiosk.kioskAdmin || kiosk.adminName || kiosk.admin_name || 'Kiosk Administrator';
                        kioskLocation = kiosk.location || kiosk.kioskLocation || 'Nabha Medical Center';
                        
                        localStorage.setItem('kioskId', kioskIdFromDB);
                        localStorage.setItem('kioskName', kioskNameToDisplay);
                        localStorage.setItem('kioskAdmin', kioskAdminName);
                        localStorage.setItem('kioskLocation', kioskLocation);
                    }
                }
            } catch (error) {
                console.error('Error fetching kiosk details:', error);
                kioskNameToDisplay = storedKioskName || 'Kiosk Administrator';
            }
        }

        // Update UI elements
        const kioskIdElement = document.getElementById('kioskId');
        if (kioskIdElement && kioskIdFromDB) {
            kioskIdElement.textContent = kioskIdFromDB;
        }

        const kioskNameElement = document.getElementById('kioskName');
        if (kioskNameElement) {
            kioskNameElement.textContent = kioskAdminName;
        }

        const kioskRoleElements = document.querySelectorAll('.user-role');
        kioskRoleElements.forEach(element => {
            element.textContent = kioskLocation;
        });

        if (kioskNameToDisplay && kioskNameToDisplay !== 'Kiosk Administrator') {
            document.title = `${kioskNameToDisplay} - eSehat Kiosk Dashboard`;
        }

        const headerTitle = document.querySelector('.logo-section h1');
        if (headerTitle && kioskNameToDisplay && kioskNameToDisplay !== 'Kiosk Administrator') {
            headerTitle.innerHTML = `<i class="fas fa-clinic-medical"></i> ${kioskNameToDisplay} Dashboard`;
        }

        console.log('Final kiosk info displayed:', {
            kioskId: kioskIdFromDB,
            kioskName: kioskNameToDisplay,
            adminName: kioskAdminName,
            location: kioskLocation
        });
    }

    // ------------------ Orders Functions ------------------
    async function fetchOrders() {
        try {
            console.log('Fetching orders from API...');
            
            const response = await fetch(`${API_BASE_URL}/orders/all`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Orders API response:', data);
            
            if (data.success) {
                allOrders = data.data.orders.filter(o => o.status === 'pending');
                visibleOrderCount = ORDERS_PER_LOAD;
                renderOrders();
                updateOrdersStats(allOrders.length);
            } else {
                showNotification('Failed to fetch orders', 'error');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            showNotification('Error loading orders', 'error');
        }
    }

    function displayOrders(orders) {
        const ordersList = document.querySelector('.orders-list');
        
        if (!ordersList) {
            console.error('Orders list element not found');
            return;
        }

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-pills"></i>
                    <p>No medicine orders found</p>
                </div>
            `;
            return;
        }

        // Filter only pending orders for the dashboard
        const pendingOrders = orders.filter(order => order.status === 'pending');
        
        if (pendingOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-check-circle"></i>
                    <p>No pending orders - all caught up!</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = pendingOrders.map((order, index) => {
            const medicinesList = order.items.map(item => 
                `${item.medicine_name} (${item.quantity} x ₹${item.price})`
            ).join(', ');
            
            return `
                <div class="order-item ${index === 0 ? 'new-order' : ''}">
                    <div class="order-info">
                        <h4>Order #MED-${String(order.id).padStart(4, '0')}</h4>
                        <p><strong>Patient:</strong> ${order.patient_name || 'Guest Customer'}</p>
                        <p><strong>Medicines:</strong> ${medicinesList}</p>
                        <p><strong>Total:</strong> ₹${order.total_amount}</p>
                        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
                        <span class="order-time">${formatDateTime(order.created_at)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn-accept" data-id="${order.id}">Accept</button>
                        <button class="btn-details" data-id="${order.id}">Details</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to new buttons
        addOrdersEventListeners();
    }

    async function acceptOrder(orderId) {
        try {
            console.log(`Accepting order ID: ${orderId}`);
            
            // You can add a PATCH/PUT request here to update the order status in your backend
            // For now, we'll just show a success message
            showNotification(`Order #MED-${String(orderId).padStart(4, '0')} accepted successfully!`, 'success');
            
            // Update the button state
            const acceptBtn = document.querySelector(`.btn-accept[data-id="${orderId}"]`);
            if (acceptBtn) {
                acceptBtn.textContent = 'Accepted';
                acceptBtn.style.backgroundColor = '#2e7d32';
                acceptBtn.disabled = true;
                
                // Remove new-order class
                const orderItem = acceptBtn.closest('.order-item');
                if (orderItem) {
                    orderItem.classList.remove('new-order');
                }
            }
            
            // Refresh the list after a short delay
            setTimeout(fetchOrders, 2000);
            
        } catch (error) {
            console.error('Error accepting order:', error);
            showNotification('Error accepting order', 'error');
        }
    }

    function showOrderDetails(order) {
        const orderModal = document.getElementById('orderModal');
        const modalBody = orderModal.querySelector('.modal-body');
        
        const medicinesList = order.items.map(item => `
            <div class="medicine-item">
                <span>${item.medicine_name}</span>
                <span>${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}</span>
            </div>
        `).join('');
        
        modalBody.innerHTML = `
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">#MED-${String(order.id).padStart(4, '0')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Name:</span>
                    <span class="detail-value">${order.patient_name || 'Guest Customer'}</span>
                </div>
                ${order.patient_id ? `
                <div class="detail-row">
                    <span class="detail-label">Patient ID:</span>
                    <span class="detail-value">${order.patient_id}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Kiosk:</span>
                    <span class="detail-value">${order.kiosk_name} (${order.kiosk_address})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Time:</span>
                    <span class="detail-value">${formatDateTime(order.created_at)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Medicines:</span>
                    <div class="medicines-list">
                        ${medicinesList}
                    </div>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">₹${order.total_amount}</span>
                </div>
                ${order.notes ? `
                <div class="detail-row">
                    <span class="detail-label">Delivery Notes:</span>
                    <span class="detail-value">${order.notes}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge pending">${order.status}</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary accept-from-modal" data-id="${order.id}">Accept Order</button>
                <button class="btn-outline contact-patient">Contact Patient</button>
            </div>
        `;

        // Add event listener to modal accept button
        const modalAcceptBtn = modalBody.querySelector('.accept-from-modal');
        if (modalAcceptBtn) {
            modalAcceptBtn.addEventListener('click', () => {
                acceptOrder(order.id);
                orderModal.classList.remove('active');
            });
        }

        orderModal.classList.add('active');
    }

    function addOrdersEventListeners() {
        // Accept buttons
        const acceptButtons = document.querySelectorAll('.btn-accept');
        acceptButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                acceptOrder(orderId);
            });
        });

        // Details buttons
        const detailButtons = document.querySelectorAll('.btn-details');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', async function() {
                const orderId = this.getAttribute('data-id');
                try {
                    // Since we already have the order data, we can filter from the fetched list
                    // Alternatively, we could fetch single order details if needed
                    const response = await fetch(`${API_BASE_URL}/orders/all`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            const order = data.data.orders.find(o => o.id == orderId);
                            if (order) {
                                showOrderDetails(order);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching order details:', error);
                    showNotification('Error loading order details', 'error');
                }
            });
        });
    }

    function updateOrdersStats(count) {
        // Update the orders stats card if it exists
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const cardTitle = card.querySelector('h3');
            if (cardTitle && cardTitle.textContent === 'Medicine Orders') {
                const statNumber = card.querySelector('.stat-number');
                if (statNumber) {
                    statNumber.textContent = count;
                } else {
                    // Create stat number if it doesn't exist
                    const statInfo = card.querySelector('.stat-info');
                    const statNumberEl = document.createElement('span');
                    statNumberEl.className = 'stat-number';
                    statNumberEl.textContent = count;
                    const statLabel = document.createElement('span');
                    statLabel.className = 'stat-label';
                    statLabel.textContent = 'Pending Today';
                    statInfo.appendChild(statNumberEl);
                    statInfo.appendChild(statLabel);
                }
            }
        });
    }

    // ------------------ Refresh Button for Orders ------------------
    function setupOrdersRefresh() {
        const ordersRefreshBtn = document.querySelector('.dashboard-section:first-child .btn-refresh');
        if (ordersRefreshBtn) {
            ordersRefreshBtn.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                this.disabled = true;
                
                fetchOrders().finally(() => {
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('Medicine orders refreshed!', 'info');
                    }, 500);
                });
            });
        }
    }

    // ------------------ Ambulance Functions (UNCHANGED) ------------------
    async function fetchAmbulanceRequests() {
        try {
            console.log('Fetching ambulance requests from API...');
            
            const response = await fetch(`${API_BASE_URL}/ambulance`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Ambulance API response:', data);
            
            if (data.success) {
                allAmbulanceRequests = data.data;
                visibleAmbulanceCount = AMBULANCE_PER_LOAD;
                renderAmbulanceRequests();
                updateAmbulanceStats(allAmbulanceRequests.length);
            } else {
                showNotification('Failed to fetch ambulance requests', 'error');
            }
        } catch (error) {
            console.error('Error fetching ambulance requests:', error);
            showNotification('Error loading ambulance requests', 'error');
        }
    }


    function renderAmbulanceRequests() {
    const ambulanceList = document.querySelector('.ambulance-list');
    const loadMoreBtn = document.getElementById('loadMoreAmbulanceBtn');

    if (!ambulanceList) return;

    const visibleRequests = allAmbulanceRequests.slice(0, visibleAmbulanceCount);

    if (visibleRequests.length === 0) {
        ambulanceList.innerHTML = `
            <div class="no-requests">
                <i class="fas fa-ambulance"></i>
                <p>No ambulance bookings found</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    ambulanceList.innerHTML = visibleRequests.map((request, index) => `
        <div class="ambulance-item ${index === 0 ? 'urgent' : ''}">
            <div class="ambulance-info">
                <h4>Booking #AMB-${String(request.id).padStart(4, '0')}</h4>
                <p><strong>Patient:</strong> ${request.full_name}</p>
                <p><strong>Location:</strong> ${request.location_address}</p>
                <p><strong>Contact:</strong> ${request.contact_number}</p>
                <span class="ambulance-time">
                    Requested: ${formatDateTime(request.created_at)}
                </span>
            </div>
            <div class="ambulance-actions">
                <button class="btn-dispatch" data-id="${request.id}">Dispatch</button>
                <button class="btn-details" data-id="${request.id}">Details</button>
            </div>
        </div>
    `).join('');

    addAmbulanceEventListeners();

    // Show / hide Load More
    if (visibleAmbulanceCount < allAmbulanceRequests.length) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}


    function displayAmbulanceRequests(requests) {
        const ambulanceList = document.querySelector('.ambulance-list');
        
        if (!ambulanceList) {
            console.error('Ambulance list element not found');
            return;
        }

        if (requests.length === 0) {
            ambulanceList.innerHTML = `
                <div class="no-requests">
                    <i class="fas fa-ambulance"></i>
                    <p>No ambulance requests found</p>
                </div>
            `;
            return;
        }

        ambulanceList.innerHTML = requests.map((request, index) => `
            <div class="ambulance-item ${index === 0 ? 'urgent' : ''}">
                <div class="ambulance-info">
                    <h4>Booking #AMB-${String(request.id).padStart(4, '0')}</h4>
                    <p><strong>Patient:</strong> ${request.full_name} (${request.age} years, ${request.gender})</p>
                    <p><strong>Blood Group:</strong> ${request.blood_group || 'Not specified'}</p>
                    <p><strong>Location:</strong> ${request.location_address}</p>
                    <p><strong>Contact:</strong> ${request.contact_number}</p>
                    <p><strong>Reason:</strong> ${request.reason_for_ambulance}</p>
                    <span class="ambulance-time">Requested: ${formatDateTime(request.created_at)}</span>
                </div>
                <div class="ambulance-actions">
                    <button class="btn-dispatch" data-id="${request.id}">Dispatch</button>
                    <button class="btn-details" data-id="${request.id}">Details</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to new buttons
        addAmbulanceEventListeners();
    }

    async function dispatchAmbulance(requestId) {
        try {
            console.log(`Dispatching ambulance for request ID: ${requestId}`);
            showNotification(`Ambulance dispatched for request #${requestId}`, 'success');
            
            const dispatchBtn = document.querySelector(`.btn-dispatch[data-id="${requestId}"]`);
            if (dispatchBtn) {
                dispatchBtn.textContent = 'Dispatched';
                dispatchBtn.style.backgroundColor = '#2e7d32';
                dispatchBtn.disabled = true;
            }
            
            setTimeout(fetchAmbulanceRequests, 2000);
            
        } catch (error) {
            console.error('Error dispatching ambulance:', error);
            showNotification('Error dispatching ambulance', 'error');
        }
    }

    function showAmbulanceDetails(request) {
        const orderModal = document.getElementById('orderModal');
        const modalBody = orderModal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Request ID:</span>
                    <span class="detail-value">#AMB-${String(request.id).padStart(4, '0')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Name:</span>
                    <span class="detail-value">${request.full_name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Age & Gender:</span>
                    <span class="detail-value">${request.age} years, ${request.gender}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Blood Group:</span>
                    <span class="detail-value">${request.blood_group || 'Not specified'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${request.contact_number}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${request.location_address}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value">${request.reason_for_ambulance}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Request Time:</span>
                    <span class="detail-value">${formatDateTime(request.created_at)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge pending">Pending Dispatch</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary dispatch-from-modal" data-id="${request.id}">Dispatch Ambulance</button>
                <button class="btn-outline contact-patient">Contact Patient</button>
            </div>
        `;

        const modalDispatchBtn = modalBody.querySelector('.dispatch-from-modal');
        if (modalDispatchBtn) {
            modalDispatchBtn.addEventListener('click', () => {
                dispatchAmbulance(request.id);
                orderModal.classList.remove('active');
            });
        }

        orderModal.classList.add('active');
    }

    function addAmbulanceEventListeners() {
        const dispatchButtons = document.querySelectorAll('.btn-dispatch');
        dispatchButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                dispatchAmbulance(requestId);
            });
        });

        const detailButtons = document.querySelectorAll('.btn-details');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', async function() {
                const requestId = this.getAttribute('data-id');
                try {
                    const response = await fetch(`${API_BASE_URL}/ambulance/${requestId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            showAmbulanceDetails(data.data);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching ambulance details:', error);
                    showNotification('Error loading ambulance details', 'error');
                }
            });
        });
    }

    function updateAmbulanceStats(count) {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const cardTitle = card.querySelector('h3');
            if (cardTitle && cardTitle.textContent === 'Ambulance Bookings') {
                const statNumber = card.querySelector('.stat-number');
                if (statNumber) {
                    statNumber.textContent = count;
                } else {
                    const statInfo = card.querySelector('.stat-info');
                    const statNumberEl = document.createElement('span');
                    statNumberEl.className = 'stat-number';
                    statNumberEl.textContent = count;
                    const statLabel = document.createElement('span');
                    statLabel.className = 'stat-label';
                    statLabel.textContent = 'Active Requests';
                    statInfo.appendChild(statNumberEl);
                    statInfo.appendChild(statLabel);
                }
            }
        });
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    //======
    async function fetchSeminars() {
        try {
            const response = await fetch(`${API_BASE_URL}/seminars`);
            const data = await response.json();

            if (data.success) {
            allSeminars = data.data.seminars;
            visibleSeminarCount = SEMINARS_PER_LOAD;
            renderSeminars();
            }
        } catch (error) {
            console.error("Error fetching seminars:", error);
        }
    }

    


    // ------------------ Modal Elements ------------------
    const seminarModal = document.getElementById('seminarModal');
    const orderModal = document.getElementById('orderModal');
    const addSeminarBtn = document.getElementById('addSeminarBtn');
    const closeSeminarModal = document.getElementById('closeSeminarModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const cancelSeminarBtn = document.getElementById('cancelSeminarBtn');
    const seminarForm = document.getElementById('seminarForm');

    if (seminarForm) {
    seminarForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const kioskId = localStorage.getItem("kioskId");
      const adminName =
        localStorage.getItem("kioskAdmin") ||
        document.getElementById("kioskName")?.textContent ||
        "Kiosk Admin";

      const payload = {
        title: document.getElementById("seminarTitle").value,
        description: document.getElementById("seminarDescription").value,
        event_date: document.getElementById("seminarDate").value,
        start_time: document.getElementById("seminarTime").value,
        duration_hours: Number(document.getElementById("seminarDuration").value),
        location: document.getElementById("seminarLocation").value,
        created_by_kiosk_id: kioskId,
        created_by_admin: adminName
      };

      console.log("📤 Sending seminar payload:", payload);

      try {
        const response = await fetch(`${API_BASE_URL}/seminars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
          alert('Seminar added successfully ✅');
          seminarForm.reset();
          seminarModal.classList.remove('active');
          fetchSeminars();
        } else {
          alert('Failed to add seminar ❌');
        }
      } catch (error) {
        console.error('Add seminar error:', error);
        alert('Server error ❌');
      }
    });
    }

    // ------------------ Refresh Buttons ------------------
    function setupRefreshButtons() {
        // Orders refresh
        const ordersRefreshBtn = document.querySelector('.dashboard-section:first-child .btn-refresh');
        if (ordersRefreshBtn) {
            ordersRefreshBtn.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                this.disabled = true;
                
                fetchOrders().finally(() => {
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('Medicine orders refreshed!', 'info');
                    }, 500);
                });
            });
        }

        // Ambulance refresh
        const ambulanceRefreshBtn = document.querySelector('.dashboard-section:nth-child(2) .btn-refresh');
        if (ambulanceRefreshBtn) {
            ambulanceRefreshBtn.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                this.disabled = true;
                
                fetchAmbulanceRequests().finally(() => {
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        showNotification('Ambulance requests refreshed!', 'info');
                    }, 500);
                });
            });
        }
    }

    // ------------------ Initialize Dashboard ------------------
    async function initializeDashboard() {
        console.log('Initializing dashboard...');
        
        // Display kiosk information
        await displayKioskInfo();
        
        // Fetch orders and ambulance requests
        await Promise.all([
            fetchOrders(),
            fetchAmbulanceRequests(),
            fetchMedicines(),
            fetchSeminars()
        ]);
        
        // Setup refresh buttons
        setupRefreshButtons();
        
        console.log('Kiosk Dashboard initialized successfully');
    }
    // ------------------ Medicine Modal ------------------
    // ------------------ ADD MEDICINE FORM SUBMIT ------------------
    const medicineForm = document.getElementById('medicineForm');

    if (medicineForm) {
        medicineForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                name: document.getElementById('medicineName').value,
                brand: document.getElementById('medicineBrand').value,
                category: document.getElementById('medicineCategory').value,
                price: Number(document.getElementById('medicinePrice').value),
                stock_quantity: Number(document.getElementById('medicineStock').value),
                last_restocked: document.getElementById('medicineRestocked').value
            };

            console.log('Sending medicine payload:', payload);

            try {
                const response = await fetch(`${API_BASE_URL}/medicines`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Medicine added successfully ✅');
                    medicineForm.reset();
                    medicineModal.classList.remove('active');
                    fetchMedicines();

                } else {
                    alert('Failed to add medicine ❌');
                }
            } catch (error) {
                console.error('Add medicine frontend error:', error);
                alert('Server error ❌');
            }
        });
    }

    const addMedicineBtn = document.getElementById('addMedicineBtn');
    const medicineModal = document.getElementById('medicineModal');
    const closeMedicineModal = document.getElementById('closeMedicineModal');
    const cancelMedicineBtn = document.getElementById('cancelMedicineBtn');

    if (addMedicineBtn) {
        addMedicineBtn.addEventListener('click', () => {
            medicineModal.classList.add('active');
        });
    }

    if (closeMedicineModal) {
        closeMedicineModal.addEventListener('click', () => {
            medicineModal.classList.remove('active');
        });
    }

    if (cancelMedicineBtn) {
        cancelMedicineBtn.addEventListener('click', () => {
            medicineModal.classList.remove('active');
        });
    }


    // ------------------ Existing Modal and UI Code ------------------
    if (addSeminarBtn) addSeminarBtn.addEventListener('click', () => seminarModal.classList.add('active'));
    if (closeSeminarModal) closeSeminarModal.addEventListener('click', () => seminarModal.classList.remove('active'));
    if (cancelSeminarBtn) cancelSeminarBtn.addEventListener('click', () => seminarModal.classList.remove('active'));
    if (closeOrderModal) closeOrderModal.addEventListener('click', () => orderModal.classList.remove('active'));
    
    window.addEventListener('click', (event) => {
        if (event.target === seminarModal) seminarModal.classList.remove('active');
        if (event.target === orderModal) orderModal.classList.remove('active');
    });

    // ------------------ Medicines Functions ------------------

    async function fetchMedicines() {
        console.log("🔥 fetchMedicines CALLED");

        try {
            console.log('Fetching medicines from API...');
            const response = await fetch(`${API_BASE_URL}/medicines`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Medicines API response:', data);

            if (data.success) {
                allMedicines = data.data.medicines;
                visibleMedicineCount = MEDICINES_PER_LOAD;
                renderMedicines();
            } else {
                showNotification('Failed to fetch medicines', 'error');
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            showNotification('Error loading medicines', 'error');
        }
    }

    

    function renderMedicines() {
        const medicineList = document.getElementById('medicineList');
        const loadMoreBtn = document.getElementById('loadMoreMedicinesBtn');

        if (!medicineList) return;

        const visibleMedicines = allMedicines.slice(0, visibleMedicineCount);

        if (visibleMedicines.length === 0) {
            medicineList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-pills"></i>
                    <p>No medicines found</p>
                </div>
            `;
            loadMoreBtn.style.display = 'none';
            return;
        }

        medicineList.innerHTML = visibleMedicines.map(med => `
            <div class="order-item">
                <div class="order-info">
                    <h4>${med.name} (${med.brand})</h4>
                    <p><strong>Category:</strong> ${med.category}</p>
                    <p><strong>Price:</strong> ₹${med.price}</p>
                    <p><strong>Stock:</strong> ${med.stock_quantity}</p>
                    <p><strong>Last Restocked:</strong> ${med.last_restocked || 'N/A'}</p>
                </div>
            </div>
        `).join('');

        // Show / hide Load More button
        if (visibleMedicineCount < allMedicines.length) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    const loadMoreBtn = document.getElementById('loadMoreMedicinesBtn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleMedicineCount += MEDICINES_PER_LOAD;
            renderMedicines();
        });
    }

    function renderOrders() {
    const ordersList = document.querySelector('.orders-list');
    const loadMoreBtn = document.getElementById('loadMoreOrdersBtn');

    if (!ordersList) return;

    const visibleOrders = allOrders.slice(0, visibleOrderCount);

    if (visibleOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-check-circle"></i>
                <p>No pending orders</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    ordersList.innerHTML = visibleOrders.map((order, index) => {
        const medicinesList = order.items.map(item =>
            `${item.medicine_name} (${item.quantity} x ₹${item.price})`
        ).join(', ');

        return `
            <div class="order-item ${index === 0 ? 'new-order' : ''}">
                <div class="order-info">
                    <h4>Order #MED-${String(order.id).padStart(4, '0')}</h4>
                    <p><strong>Patient:</strong> ${order.patient_name || 'Guest Customer'}</p>
                    <p><strong>Medicines:</strong> ${medicinesList}</p>
                    <p><strong>Total:</strong> ₹${order.total_amount}</p>
                    <span class="order-time">${formatDateTime(order.created_at)}</span>
                </div>
                <div class="order-actions">
                    <button class="btn-accept" data-id="${order.id}">Accept</button>
                    <button class="btn-details" data-id="${order.id}">Details</button>
                </div>
            </div>
        `;
    }).join('');

    addOrdersEventListeners();

    // Load more button visibility
    if (visibleOrderCount < allOrders.length) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

async function updateSeminarStatus(seminarId, newStatus) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/seminars/${seminarId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      }
    );

    const data = await response.json();

    if (data.success) {
      showNotification("Seminar status updated", "success");

      // 🔥 THIS IS THE KEY FIX
      await fetchSeminars(); // re-fetch from DB
    } else {
      showNotification(data.message || "Update failed", "error");
    }
  } catch (error) {
    console.error("Update seminar status error:", error);
    showNotification("Server error", "error");
  }
}



function renderSeminars() {
  const tbody = document.querySelector("#seminarsTable tbody");
  const loadMoreBtn = document.getElementById("loadMoreSeminarsBtn");

  if (!tbody) return;

  // 🔥 STATUS PRIORITY
  const statusOrder = {
    scheduled: 1,
    completed: 2,
    cancelled: 3
  };

  const sorted = [...allSeminars].sort((a, b) => {
    // 1️⃣ Status order
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    // 2️⃣ Date order (earliest first)
    return new Date(a.event_date) - new Date(b.event_date);
  });

  const visible = sorted.slice(0, visibleSeminarCount);

  tbody.innerHTML = visible.map(s => {
    let actions = "-";

    if (s.status === "scheduled") {
      actions = `
        <button class="btn-success btn-sm"
          onclick="updateSeminarStatus(${s.id}, 'completed')">
          Complete
        </button>
        <button class="btn-danger btn-sm"
          onclick="updateSeminarStatus(${s.id}, 'cancelled')">
          Cancel
        </button>
      `;
    }

    return `
      <tr>
        <td>${s.title}</td>
        <td>${new Date(s.event_date).toLocaleDateString()}</td>
        <td>${s.start_time}</td>
        <td>${s.duration_hours} hrs</td>
        <td>${s.location}</td>
        <td class="status-${s.status}">${s.status}</td>
        <td>${actions}</td>
      </tr>
    `;
  }).join("");

  loadMoreBtn.style.display =
    visibleSeminarCount < sorted.length ? "inline-block" : "none";
}


const loadMoreOrdersBtn = document.getElementById('loadMoreOrdersBtn');

if (loadMoreOrdersBtn) {
    loadMoreOrdersBtn.addEventListener('click', () => {
        visibleOrderCount += ORDERS_PER_LOAD;
        renderOrders();
    });
}


const loadMoreAmbulanceBtn = document.getElementById('loadMoreAmbulanceBtn');

if (loadMoreAmbulanceBtn) {
    loadMoreAmbulanceBtn.addEventListener('click', () => {
        visibleAmbulanceCount += AMBULANCE_PER_LOAD;
        renderAmbulanceRequests();
    });
}


const loadMoreSeminarsBtn = document.getElementById("loadMoreSeminarsBtn");

if (loadMoreSeminarsBtn) {
  loadMoreSeminarsBtn.addEventListener("click", () => {
    visibleSeminarCount += SEMINARS_PER_LOAD;
    renderSeminars();
  });
}


    // Start the dashboard
    initializeDashboard();
});

// ===== GLOBAL FUNCTIONS FOR INLINE BUTTONS =====
window.updateSeminarStatus = async function (seminarId, newStatus) {
  if (!confirm(`Mark seminar as ${newStatus}?`)) return;

  try {
    const response = await fetch(
      `http://localhost:5004/api/seminars/${seminarId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("✅ Seminar status updated");
      window.fetchSeminars(); // refetch
    } else {
      alert(data.message || "❌ Failed to update status");
    }
  } catch (error) {
    console.error("Update seminar status error:", error);
    alert("❌ Server error");
  }
};
window.fetchSeminars = fetchSeminars;
