// orders.js - FIXED VERSION (Orders for logged-in user only)
const API_BASE_URL = "http://localhost:5004/api";

// DOM Elements
const medicinesGrid = document.getElementById("medicinesGrid");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const confirmationModal = document.getElementById("confirmationModal");
const closeModalButtons = document.querySelectorAll(
  ".modal .close, .confirmation .close"
);
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const deliveryFeeEl = document.getElementById("deliveryFee");
const orderIdEl = document.getElementById("orderId");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");

const searchInput = document.getElementById("medicineSearch");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Mobile-specific elements
const mobileCartPanel = document.getElementById("mobileCartPanel");
const closeMobileCart = document.getElementById("closeMobileCart");
const mobileCartItems = document.getElementById("mobileCartItems");
const mobileCheckoutBtn = document.getElementById("mobileCheckoutBtn");

// Order history elements
const orderHistoryList = document.getElementById("orderHistoryList");

// Cart and medicines data
let cart = [];
let medicines = [];
let isMobile = window.innerWidth <= 768;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  checkMobileView();
  loadMedicines();
  updateCart();
  setupEventListeners();
  setupMobileNavigation();
  setupTabNavigation();
  setCurrentDate();

  checkForReorderItems();
});

// Check if mobile view
function checkMobileView() {
  isMobile = window.innerWidth <= 768;
  if (isMobile) {
    document.body.classList.add("mobile-view");
  } else {
    document.body.classList.remove("mobile-view");
  }
}

// FIXED: Get current user from login system storage
function getCurrentUser() {
  try {
    // Your login system stores patientUserId and patientPhone
    const patientUserId = localStorage.getItem("patientUserId");
    const patientPhone = localStorage.getItem("patientPhone");
    
    console.log("Login data - patientUserId:", patientUserId, "patientPhone:", patientPhone);
    
    if (!patientUserId) {
      console.log("No patient user ID found in localStorage");
      return { id: null, name: "Guest", phone: "" };
    }
    
    // Create user object in the format your orders system expects
    const userObj = {
      id: parseInt(patientUserId), // Convert to number since patient_id is numeric
      name: `Patient ${patientPhone}`, // Or you can fetch the actual name from backend
      phone: patientPhone || ""
    };
    
    console.log("Created user object:", userObj);
    return userObj;
    
  } catch (error) {
    console.error("Error parsing user data:", error);
    return { id: null, name: "Guest", phone: "" };
  }
}

async function loadUserData() {
  const phone = localStorage.getItem("patientPhone");
  if (!phone) return;

  try {
    const res = await fetch(`${API_BASE_URL}/users?phone_number=${phone}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    const data = await res.json();

    let userObj = {};
    if (data.data && data.data.user) {
      userObj = data.data.user;
    } else if (data.user) {
      userObj = data.user;
    } else if (data.data) {
      userObj = data.data;
    } else {
      userObj = data;
    }

    localStorage.setItem("user", JSON.stringify(userObj));
    return userObj;
  } catch (err) {
    console.error("Error loading user:", err);
  }
}

function setUserInfo() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.name || "Guest";

  // Update username in navbar
  document.querySelectorAll(".userName").forEach(el => {
    el.textContent = username;
  });

  // Update avatar if exists
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
  }
}

// Setup responsive event listeners
function setupEventListeners() {
  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckoutModal);
  if (placeOrderBtn) placeOrderBtn.addEventListener("click", placeOrder);
  if (mobileCheckoutBtn)
    mobileCheckoutBtn.addEventListener("click", openCheckoutModal);

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  document
    .querySelectorAll('input[name="deliveryOption"]')
    .forEach((option) => {
      option.addEventListener("change", updateDeliveryFee);
    });

  if (searchBtn) searchBtn.addEventListener("click", performSearch);
  if (searchInput) {
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") performSearch();
    });
  }
  if (categoryFilter) categoryFilter.addEventListener("change", performSearch);
  if (sortFilter) sortFilter.addEventListener("change", performSearch);

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", function () {
      closeModals();
      loadMedicines();
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === checkoutModal) closeModals();
    if (event.target === confirmationModal) closeModals();
  });

  document.addEventListener("click", function (e) {
    const addressCard = e.target.closest(".address-card");
    if (addressCard) {
      document.querySelectorAll(".address-card").forEach((c) => {
        c.classList.remove("selected");
        const btn = c.querySelector(".select-address-btn");
        if (btn) btn.textContent = "Select";
      });
      addressCard.classList.add("selected");
      const btn = addressCard.querySelector(".select-address-btn");
      if (btn) btn.textContent = "Selected";
    }
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      switchCheckoutTab(tabName);
    });
  });

  document.querySelectorAll(".next-tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const nextTab = this.getAttribute("data-next");
      switchCheckoutTab(nextTab);
    });
  });
  // Add delivery option change listeners
  document
    .querySelectorAll('input[name="deliveryOption"]')
    .forEach((option) => {
      option.addEventListener("change", function () {
        updateDeliveryFee();
      });
    });
  window.addEventListener("resize", function () {
    checkMobileView();
    updateCart();
  });
}

// Setup tab navigation - HIDE CURRENT ORDERS TAB
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  // Hide current orders tab
  const currentOrdersTab = document.querySelector(
    '.tab-btn[data-tab="current-orders"]'
  );
  if (currentOrdersTab) {
    currentOrdersTab.style.display = "none";
  }

  // Also hide current orders section
  const currentOrdersSection = document.getElementById("current-orders");
  if (currentOrdersSection) {
    currentOrdersSection.style.display = "none";
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      this.classList.add("active");
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");

      if (tabId === "order-history") {
        loadOrders();
      }
    });
  });
}

// Setup mobile navigation
function setupMobileNavigation() {
  const mobileCartBtn = document.getElementById("mobileCartBtn");
  if (mobileCartBtn && mobileCartPanel) {
    mobileCartBtn.addEventListener("click", function () {
      mobileCartPanel.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    closeMobileCart.addEventListener("click", function () {
      mobileCartPanel.classList.remove("active");
      document.body.style.overflow = "";
    });

    mobileCartPanel.addEventListener("click", function (e) {
      if (e.target === mobileCartPanel) {
        mobileCartPanel.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }
}

// Set current date
function setCurrentDate() {
  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateElement.textContent = now.toLocaleDateString("en-US", options);
  }
}

// Load medicines from backend API
async function loadMedicines() {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/medicines`);

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        medicines = result.data.medicines;
        renderMedicines(medicines);
      } else {
        throw new Error(result.message || "Failed to load medicines");
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error loading medicines:", error);
    medicines = getDemoMedicines();
    renderMedicines(medicines);
    showNotification("Using demo medicines data", "warning");
  } finally {
    showLoading(false);
  }
}

// Demo medicines data
function getDemoMedicines() {
  return [
    {
      id: 1,
      name: "Paracetamol",
      brand: "Crocin",
      price: "25.00",
      category: "pain-relief",
      stock_quantity: 100,
    },
    {
      id: 2,
      name: "Ibuprofen",
      brand: "Brufen",
      price: "35.50",
      category: "pain-relief",
      stock_quantity: 50,
    },
    {
      id: 3,
      name: "Vitamin C",
      brand: "Limcee",
      price: "120.00",
      category: "vitamins",
      stock_quantity: 30,
    },
    {
      id: 4,
      name: "Metformin",
      brand: "Glycomet",
      price: "45.75",
      category: "diabetes",
      stock_quantity: 80,
    },
  ];
}

function renderMedicines(medicinesList) {
  if (!medicinesGrid) return;

  medicinesGrid.innerHTML = "";

  if (medicinesList.length === 0) {
    medicinesGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: #e6e9f2; margin-bottom: 15px;"></i>
                <h3>No medicines found</h3>
                <p>Try different search terms</p>
            </div>
        `;
    return;
  }

  medicinesList.forEach((medicine) => {
    const price = parseFloat(medicine.price);
    const medicineCard = document.createElement("div");
    medicineCard.className = "medicine-card";
    medicineCard.innerHTML = `
            <div class="medicine-image">
                <i class="fas fa-pills"></i>
            </div>
            <div class="medicine-name">${medicine.name}</div>
            <div class="medicine-brand">${medicine.brand}</div>
            <div class="medicine-price">₹${price.toFixed(2)}</div>
            <div class="medicine-stock ${
              medicine.stock_quantity > 0 ? "in-stock" : "out-of-stock"
            }">
                ${
                  medicine.stock_quantity > 0
                    ? `In stock (${medicine.stock_quantity})`
                    : "Out of stock"
                }
            </div>
            <div class="medicine-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${
                      medicine.id
                    }">-</button>
                    <input type="number" class="quantity-input" id="qty-${
                      medicine.id
                    }" value="1" min="1" max="${
      medicine.stock_quantity
    }" readonly>
                    <button class="quantity-btn increase" data-id="${
                      medicine.id
                    }">+</button>
                </div>
                <button class="add-to-cart-btn" data-id="${medicine.id}" 
                    ${medicine.stock_quantity === 0 ? "disabled" : ""}>
                    ${
                      medicine.stock_quantity === 0
                        ? "Out of Stock"
                        : "Add to Cart"
                    }
                </button>
            </div>
        `;
    medicinesGrid.appendChild(medicineCard);
  });

  attachMedicineCardListeners();
}

function attachMedicineCardListeners() {
  document.querySelectorAll(".increase").forEach((button) => {
    button.onclick = () => {
      const id = parseInt(button.dataset.id);
      const input = document.getElementById(`qty-${id}`);
      const medicine = medicines.find((m) => m.id === id);
      if (medicine && parseInt(input.value) < medicine.stock_quantity) {
        input.value = parseInt(input.value) + 1;
      }
    };
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.onclick = () => {
      const id = parseInt(button.dataset.id);
      const input = document.getElementById(`qty-${id}`);
      if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    };
  });

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.onclick = () => {
      const id = parseInt(button.dataset.id);
      const qty = parseInt(document.getElementById(`qty-${id}`).value);
      addToCart(id, qty);
    };
  });
}

function addToCart(medicineId, quantity) {
  const medicine = medicines.find((m) => m.id === medicineId);
  if (!medicine) return;

  const existingItem = cart.find((item) => item.id === medicineId);

  if (existingItem) {
    if (existingItem.quantity + quantity > medicine.stock_quantity) {
      showNotification(
        `Only ${medicine.stock_quantity} items available`,
        "warning"
      );
      return;
    }
    existingItem.quantity += quantity;
  } else {
    if (quantity > medicine.stock_quantity) {
      showNotification(
        `Only ${medicine.stock_quantity} items available`,
        "warning"
      );
      return;
    }
    cart.push({
      id: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      price: parseFloat(medicine.price),
      quantity: quantity,
    });
  }

  updateCart();
  showNotification(`${quantity} x ${medicine.name} added to cart`, "success");

  if (isMobile && mobileCartPanel) {
    mobileCartPanel.classList.add("active");
  }
}

function removeFromCart(medicineId) {
  cart = cart.filter((i) => i.id !== medicineId);
  updateCart();
}

function updateCartQuantity(medicineId, change) {
  const item = cart.find((i) => i.id === medicineId);
  if (!item) return;

  const medicine = medicines.find((m) => m.id === medicineId);
  if (medicine && item.quantity + change > medicine.stock_quantity) {
    showNotification(
      `Only ${medicine.stock_quantity} items available`,
      "warning"
    );
    return;
  }

  item.quantity += change;
  if (item.quantity < 1) removeFromCart(medicineId);
  else updateCart();
}

function updateCart() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-₹${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

  if (checkoutSubtotal)
    checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  if (checkoutTotal) checkoutTotal.textContent = `₹${total.toFixed(2)}`;

  updateMobileCart();

  // If checkout modal is open, update its totals too
  if (checkoutModal.style.display === "flex") {
    updateCheckoutTotals();
  }
}

function updateMobileCart() {
  if (!mobileCartItems) return;

  mobileCartItems.innerHTML = "";

  if (cart.length === 0) {
    mobileCartItems.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 20px; color: #6c7a93;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 10px; color: #e6e9f2;"></i>
                <p>Your cart is empty</p>
                <span>Add medicines from the list</span>
            </div>
        `;
  } else {
    cart.forEach((item) => {
      const el = document.createElement("div");
      el.className = "mobile-cart-item";
      el.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} <small>(${
        item.brand
      })</small></div>
                    <div class="cart-item-price">₹${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${
                          item.id
                        }">-</button>
                        <input type="number" class="quantity-input" value="${
                          item.quantity
                        }" min="1" readonly>
                        <button class="quantity-btn increase" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <button class="remove-item" data-id="${
                      item.id
                    }" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
      mobileCartItems.appendChild(el);
    });

    mobileCartItems.querySelectorAll(".increase").forEach((b) => {
      b.onclick = () => updateCartQuantity(parseInt(b.dataset.id), 1);
    });
    mobileCartItems.querySelectorAll(".decrease").forEach((b) => {
      b.onclick = () => updateCartQuantity(parseInt(b.dataset.id), -1);
    });
    mobileCartItems.querySelectorAll(".remove-item").forEach((b) => {
      b.onclick = () => removeFromCart(parseInt(b.dataset.id));
    });
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  if (document.getElementById("mobileSubtotal")) {
    document.getElementById(
      "mobileSubtotal"
    ).textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById(
      "mobileDiscount"
    ).textContent = `-₹${discount.toFixed(2)}`;
    document.getElementById("mobileTotal").textContent = `₹${total.toFixed(2)}`;
  }

  if (mobileCheckoutBtn) {
    mobileCheckoutBtn.disabled = cart.length === 0;
  }
}

function openCheckoutModal() {
  if (cart.length === 0) return;

  if (isMobile) {
    checkoutModal.classList.add("mobile-modal");
  } else {
    checkoutModal.classList.remove("mobile-modal");
  }

  checkoutModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Update the checkout totals immediately when modal opens
  updateCheckoutTotals();

  switchCheckoutTab("delivery");
}

function updateCheckoutTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const expressSelected = document.getElementById("expressDelivery")
    ? document.getElementById("expressDelivery").checked
    : false;
  const deliveryFee = expressSelected ? 50 : 0;
  const total = subtotal - discount + deliveryFee;

  // Update all total displays
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-₹${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

  if (checkoutSubtotal)
    checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  if (checkoutTotal) checkoutTotal.textContent = `₹${total.toFixed(2)}`;

  // Update delivery fee display
  if (deliveryFeeEl) {
    deliveryFeeEl.textContent = expressSelected ? "₹50" : "Free";
  }

  // Update payment total
  const paymentTotal = document.getElementById("paymentTotal");
  if (paymentTotal) {
    paymentTotal.textContent = `₹${total.toFixed(2)}`;
  }
}

function updateDeliveryFee() {
  const expressSelected = document.getElementById("expressDelivery").checked;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const deliveryFee = expressSelected ? 50 : 0;
  const total = subtotal - discount + deliveryFee;

  if (deliveryFeeEl)
    deliveryFeeEl.textContent = expressSelected ? "₹50" : "Free";
  if (checkoutTotal) checkoutTotal.textContent = `₹${total.toFixed(2)}`;

  // Also update the payment tab total
  const paymentTotal = document.getElementById("paymentTotal");
  if (paymentTotal) {
    paymentTotal.textContent = `₹${total.toFixed(2)}`;
  }
}

function closeModals() {
  checkoutModal.style.display = "none";
  confirmationModal.style.display = "none";
  document.body.style.overflow = "";

  if (mobileCartPanel) {
    mobileCartPanel.classList.remove("active");
  }
}

function switchCheckoutTab(tabName) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((tc) => tc.classList.remove("active"));

  const tabEl = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (tabEl) tabEl.classList.add("active");

  const content = document.getElementById(`${tabName}Tab`);
  if (content) content.classList.add("active");
}

function updateDeliveryFee() {
  const expressSelected = document.getElementById("expressDelivery").checked;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
  const deliveryFee = expressSelected ? 50 : 0;
  const total = subtotal - discount + deliveryFee;

  // Update all fee displays
  if (deliveryFeeEl)
    deliveryFeeEl.textContent = expressSelected ? "₹50" : "Free";
  if (checkoutSubtotal)
    checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;

  // Ensure discount is displayed
  const discountElement = document.getElementById("checkoutDiscount");
  if (discountElement) {
    discountElement.textContent = `-₹${discount.toFixed(2)}`;
  }

  if (checkoutTotal) checkoutTotal.textContent = `₹${total.toFixed(2)}`;
}

// FIXED: Load orders for the current logged-in user using correct endpoint
async function loadOrders() {
  try {
    console.log("Loading orders for current user...");
    
    const user = getCurrentUser();
    if (!user.id) {
      console.log("No user logged in, cannot load orders");
      displayOrders([]);
      showNotification("Please log in to view your orders", "warning");
      return;
    }

    console.log(`Fetching orders for patient_id: ${user.id}, name: ${user.name}`);
    
    // FIXED: Use the correct endpoint for patient-specific orders
    const response = await fetch(`${API_BASE_URL}/orders/patient/${user.id}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log("API response:", result);

      if (result.success && result.data && result.data.orders) {
        const patientOrders = result.data.orders;
        console.log(`Found ${patientOrders.length} orders for current user`);
        
        displayOrders(patientOrders);
      } else {
        console.log("No orders data found in response");
        displayOrders([]);
      }
    } else {
      console.log(`API error: ${response.status}`);
      // Fallback to demo data for testing
      displayDemoOrders(user.id);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    // Fallback to demo data
    const user = getCurrentUser();
    displayDemoOrders(user.id);
  }
}

// Demo orders for testing
function displayDemoOrders(patientId) {
  const demoOrders = [
    {
      id: 14,
      patient_id: patientId,
      total_amount: "51.00",
      status: "pending",
      created_at: new Date().toISOString(),
      notes: "Delivery to: 123 Main Street, City, State 12345",
      patient_name: getCurrentUser().name,
      items: [
        { medicine_name: "Paracetamol", quantity: 2, price: 25.5 }
      ]
    },
    {
      id: 13,
      patient_id: patientId,
      total_amount: "145.50",
      status: "delivered",
      created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
      notes: "Delivery to: 123 Main Street, City, State 12345",
      patient_name: getCurrentUser().name,
      items: [
        { medicine_name: "Paracetamol", quantity: 1, price: 25.5 },
        { medicine_name: "Amoxicillin", quantity: 1, price: 120 }
      ]
    }
  ];
  
  displayOrders(demoOrders);
}

// Display orders with proper patient info
function displayOrders(orders) {
  if (!orderHistoryList) {
    console.error("orderHistoryList element not found!");
    return;
  }

  // Clear previous content
  orderHistoryList.innerHTML = "";

  if (!orders || orders.length === 0) {
    orderHistoryList.innerHTML = `
      <div class="no-orders">
        <i class="fas fa-history"></i>
        <p>No orders found</p>
        <p class="no-orders-subtitle">Place your first order to see it here</p>
      </div>
    `;
    return;
  }

  console.log("Displaying orders:", orders);

  // Sort orders by date (newest first)
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  orders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Handle different possible field names from database
    const items = order.items || [];
    const total = parseFloat(order.total_amount) || 0;
    const status = order.status || "pending";
    
    // Use patient_name from order data or fallback to current user name
    const currentUser = getCurrentUser();
    const patientName = order.patient_name || currentUser.name || "Unknown Patient";

    // If items array is empty, create a fallback item
    let itemsHTML = "";
    if (items.length === 0) {
      itemsHTML = `
        <div class="order-item">
          <span class="item-name">Order details not available</span>
          <span class="item-quantity">-</span>
          <span class="item-price">-</span>
        </div>
      `;
    } else {
      itemsHTML = items.map((item) => `
        <div class="order-item">
          <span class="item-name">${item.medicine_name || item.name || "Medicine"}</span>
          <span class="item-quantity">Qty: ${item.quantity || 1}</span>
          <span class="item-price">₹${((item.price || item.price_per_unit || 0) * (item.quantity || 1)).toFixed(2)}</span>
        </div>
      `).join("");
    }

    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-id">Order #${order.id}</div>
        <div class="order-date">${orderDate}</div>
        <div class="order-status">
          <span class="status-badge status-${status}">${status.toUpperCase()}</span>
        </div>
      </div>
      
      <div class="order-patient-info">
        <strong>Patient:</strong> ${patientName}
      </div>
      
      ${order.notes ? `
      <div class="order-notes">
        <strong>Delivery:</strong> ${order.notes}
      </div>
      ` : ''}
      
      <div class="order-items-section">
        <h4>Ordered Items (${items.length}):</h4>
        <div class="order-items-list">
          ${itemsHTML}
        </div>
      </div>
      
      <div class="order-footer">
        <div class="order-total">Total: ₹${total.toFixed(2)}</div>
        <div class="order-actions">
          ${status === "pending" ? `
            <button class="btn-danger" onclick="cancelOrder(${order.id})">Cancel Order</button>
          ` : ""}
          <button class="btn-secondary" onclick="reorder(${order.id})">Reorder All</button>
        </div>
      </div>
    `;

    orderHistoryList.appendChild(orderCard);
  });
}

async function placeOrder() {
  try {
    showLoading(true);

    const user = getCurrentUser();
    if (!user.id) {
      alert("❌ Please log in again to place an order.");
      return;
    }

    // DEBUG: Check what's being selected
    console.log("Current user:", user);
    
    // Get selected address - FIXED for your HTML structure
    const selectedAddress = document.querySelector(".address-card.selected");
    let deliveryAddress = null;

    if (selectedAddress) {
      console.log("Selected address card found:", selectedAddress);
      
      // The address is in the <p> tag within the address card
      const addressParagraph = selectedAddress.querySelector("p");
      if (addressParagraph) {
        deliveryAddress = addressParagraph.textContent.trim();
        console.log("Extracted address:", deliveryAddress);
      } else {
        console.log("No <p> tag found in address card");
        // Fallback: try to get text content and remove button text
        const fullText = selectedAddress.textContent || selectedAddress.innerText;
        deliveryAddress = fullText.replace(/Selected|Select/g, '').trim();
        console.log("Fallback address:", deliveryAddress);
      }
    } else {
      console.log("No address card selected");
    }

    if (!deliveryAddress || deliveryAddress === "") {
      alert("❌ Please select a delivery address.");
      showLoading(false);
      return;
    }

    // Get items from cart
    const orderItems = cart.map((item) => ({
      medicine_id: item.id,
      quantity: item.quantity,
      price_per_unit: item.price,
    }));

    // Calculate total
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
    const expressSelected = document.getElementById("expressDelivery")
      ? document.getElementById("expressDelivery").checked
      : false;
    const deliveryFee = expressSelected ? 50 : 0;
    const total = subtotal - discount + deliveryFee;

    // FIXED: Use the exact field structure that matches your database
    const orderData = {
      patient_id: parseInt(user.id),
      patient_name: user.name,
      kiosk_id: 1,
      items: orderItems,
      total_amount: total,
      status: "pending",
      notes: `Delivery to: ${deliveryAddress}`, // This goes to the notes field
      created_at: new Date().toISOString(),
      delivery_method: expressSelected ? "express" : "standard",
    };

    console.log("Sending order data to backend:", orderData);

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    console.log("Backend response:", result);

    if (response.ok && result.success) {
      if (orderIdEl) orderIdEl.textContent = `#ORD-${result.data.order.id}`;

      checkoutModal.style.display = "none";
      confirmationModal.style.display = "flex";

      // Clear cart
      cart = [];
      updateCart();

      // Reload orders to show the new order
      loadOrders();

      showNotification("Order placed successfully!", "success");
    } else {
      throw new Error(result.message || "Failed to place order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    showNotification(
      error.message || "Failed to place order. Please try again.",
      "error"
    );
  } finally {
    showLoading(false);
  }
}

// Add this debug function to test address selection
function testAddressSelection() {
  const addressCards = document.querySelectorAll('.address-card');
  console.log(`Found ${addressCards.length} address cards`);
  
  addressCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      console.log(`Address card ${index + 1} clicked`);
      const pTag = this.querySelector('p');
      console.log('Address text:', pTag ? pTag.textContent : 'No p tag found');
    });
  });
}

// Order management functions
function reorder(orderId) {
  showNotification(`Reorder functionality for order #${orderId}`, "info");
}

function cancelOrder(orderId) {
  if (confirm("Are you sure you want to cancel this order?")) {
    showNotification(`Order #${orderId} cancellation requested`, "info");
    loadOrders();
  }
}

function performSearch() {
  const term = (searchInput.value || "").trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(term) ||
      m.brand.toLowerCase().includes(term)
  );

  if (category) {
    filtered = filtered.filter((m) => m.category === category);
  }

  if (sort === "price-low") {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sort === "price-high") {
    filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  renderMedicines(filtered);
}

function showLoading(show) {
  let loader = document.getElementById("loadingIndicator");
  if (!loader && show) {
    loader = document.createElement("div");
    loader.id = "loadingIndicator";
    loader.innerHTML =
      '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    loader.style.cssText =
      "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:20px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:1000;";
    document.body.appendChild(loader);
  } else if (loader && !show) {
    loader.remove();
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icon =
    type === "error"
      ? "fa-exclamation-circle"
      : type === "warning"
      ? "fa-exclamation-triangle"
      : "fa-check-circle";

  notification.innerHTML = `<div class="notification-content"><i class="fas ${icon}"></i><span>${message}</span></div>`;

  Object.assign(notification.style, {
    position: "fixed",
    bottom: isMobile ? "70px" : "20px",
    right: "20px",
    left: isMobile ? "20px" : "auto",
    background:
      type === "error" ? "#f44336" : type === "warning" ? "#ff9800" : "#4caf50",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "6px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    zIndex: 1100,
    opacity: "0",
    transition: "opacity 220ms",
    maxWidth: isMobile ? "none" : "400px",
  });

  document.body.appendChild(notification);
  requestAnimationFrame(() => (notification.style.opacity = "1"));

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 250);
  }, 3000);
}

function checkForReorderItems() {
  const reorderItems = localStorage.getItem("reorderItems");
  if (reorderItems) {
    try {
      const items = JSON.parse(reorderItems);
      items.forEach((item) => {
        addToCart(item.medicine_id, item.quantity);
      });
      showNotification("Items from previous order added to cart!", "success");
      localStorage.removeItem("reorderItems");
    } catch (error) {
      console.error("Error processing reorder items:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadUserData();   // Fetch user from backend
  setUserInfo();          // Update navbar with username/avatar

  const user = getCurrentUser();
  console.log("Current user in orders.js:", user);

  await loadMedicines();
  await loadOrders();     // Load orders for the current user
});

// Debug function to check user and orders
async function debugOrders() {
  const user = getCurrentUser();
  console.log("🔍 DEBUG - Current User:", user);
  
  if (!user.id) {
    console.error("❌ No user ID found! Check login status.");
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/patient/${user.id}`);
    const result = await response.json();
    console.log("🔍 DEBUG - Orders API Response:", result);
  } catch (error) {
    console.error("🔍 DEBUG - Error fetching orders:", error);
  }
}

// Make functions available globally
window.reorder = reorder;
window.cancelOrder = cancelOrder;