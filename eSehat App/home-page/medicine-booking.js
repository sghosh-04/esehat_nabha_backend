// ===============================
// MEDICINE BOOKING SCRIPT
// ===============================

// Medicines data (from backend)
let medicines = [];
let filteredMedicines = [];
let visibleCount = 6;

// Cart array (DO NOT CHANGE)
let cart = [];

// DOM Elements
const medicinesGrid = document.getElementById('medicinesGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const confirmationModal = document.getElementById('confirmationModal');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const deliveryFeeEl = document.getElementById('deliveryFee');
const orderIdEl = document.getElementById('orderId');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');

const searchInput = document.getElementById('medicineSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// ===============================
// FETCH MEDICINES FROM BACKEND
// ===============================
async function fetchMedicines() {
  try {
    const res = await fetch("http://localhost:5004/api/medicines");
    const json = await res.json();

    if (!json.success) throw new Error("Failed to fetch medicines");

    medicines = json.data.medicines.map(m => ({
      id: m.id,
      name: m.name,
      brand: m.brand,
      price: Number(m.price),
      category: m.category,   // 🔥 REAL CATEGORY
      image: "pills"
    }));

    filteredMedicines = [...medicines];
    renderWithPagination();

  } catch (err) {
    console.error(err);
  }
}

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  fetchMedicines();
  updateCart();

  searchBtn.addEventListener('click', applyFilters);
  searchInput.addEventListener('keyup', e => e.key === 'Enter' && applyFilters());
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  placeOrderBtn.addEventListener('click', placeOrder);
});

// ===============================
// FILTER + SORT
// ===============================
function applyFilters() {
  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  filteredMedicines = medicines.filter(m => {
    const textMatch =
      m.name.toLowerCase().includes(term) ||
      m.brand.toLowerCase().includes(term);

    const categoryMatch = !category || m.category === category;

    return textMatch && categoryMatch;
  });

  if (sort === 'price-low') filteredMedicines.sort((a,b)=>a.price-b.price);
  if (sort === 'price-high') filteredMedicines.sort((a,b)=>b.price-a.price);
  if (sort === 'name') filteredMedicines.sort((a,b)=>a.name.localeCompare(b.name));

  visibleCount = 6;
  renderWithPagination();
}

// ===============================
// LOAD MORE PAGINATION
// ===============================
function renderWithPagination() {
  medicinesGrid.innerHTML = "";

  const visible = filteredMedicines.slice(0, visibleCount);
  renderMedicines(visible);

  if (visibleCount < filteredMedicines.length) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.textContent = 'Load More Medicines';
    loadMoreBtn.onclick = () => {
      visibleCount += 6;
      renderWithPagination();
    };
    medicinesGrid.appendChild(loadMoreBtn);
  }
}

// ===============================
// RENDER MEDICINES (UI SAME)
// ===============================
function renderMedicines(list) {
  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'medicine-card';
    card.innerHTML = `
      <div class="medicine-image"><i class="fas fa-pills"></i></div>
      <div class="medicine-name">${m.name}</div>
      <div class="medicine-brand">${m.brand}</div>
      <div class="medicine-price">₹${m.price.toFixed(2)}</div>
      <div class="medicine-actions">
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-id="${m.id}">-</button>
          <input
              type="number"
              id="qty-${m.id}"
              class="quantity-input"
              value="1"
              min="1"
            />
          <button class="quantity-btn increase" data-id="${m.id}">+</button>
        </div>
        <button class="add-to-cart-btn" data-id="${m.id}">Add to Cart</button>
      </div>
    `;
    medicinesGrid.appendChild(card);
  });

  attachMedicineCardListeners();
}

// ===============================
// CARD LISTENERS
// ===============================
function attachMedicineCardListeners() {
  document.querySelectorAll('.increase').forEach(b =>
    b.onclick = () => document.getElementById(`qty-${b.dataset.id}`).value++
  );

  document.querySelectorAll('.decrease').forEach(b =>
    b.onclick = () => {
      const i = document.getElementById(`qty-${b.dataset.id}`);
      if (i.value > 1) i.value--;
    }
  );

  document.querySelectorAll('.add-to-cart-btn').forEach(b =>
    b.onclick = () =>
      addToCart(+b.dataset.id, +document.getElementById(`qty-${b.dataset.id}`).value)
  );
}

// ===============================
// CART / CHECKOUT / LANGUAGE
// ===============================
// ⛔ ALL YOUR EXISTING FUNCTIONS BELOW STAY EXACTLY THE SAME
// addToCart()
// removeFromCart()
// updateCart()
// updateDeliveryFee()
// placeOrder()
// showNotification()
// LanguageManager()
// translations

// Add medicine to cart
function addToCart(medicineId, quantity) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;
    const existingItem = cart.find(item => item.id === medicineId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: medicine.id,
            name: medicine.name,
            brand: medicine.brand,
            price: medicine.price,
            quantity: quantity
        });
    }

    updateCart();
    showNotification(`${quantity} x ${medicine.name} added to cart`);
}

// Remove item from cart
function removeFromCart(medicineId) {
    cart = cart.filter(i => i.id !== medicineId);
    updateCart();
}

// Update quantity in cart
function updateCartQuantity(medicineId, change) {
    const item = cart.find(i => i.id === medicineId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity < 1) removeFromCart(medicineId);
    else updateCart();
}

// Update cart UI and totals
function updateCart() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <span>Add medicines from the list</span>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} <small style="color:#6c7a93">(${item.brand})</small></div>
                    <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(el);
        });

        checkoutBtn.disabled = false;

        // attach listeners for cart item buttons
        cartItems.querySelectorAll('.increase').forEach(b => {
            b.onclick = () => updateCartQuantity(parseInt(b.dataset.id, 10), 1);
        });
        cartItems.querySelectorAll('.decrease').forEach(b => {
            b.onclick = () => updateCartQuantity(parseInt(b.dataset.id, 10), -1);
        });
        cartItems.querySelectorAll('.remove-item').forEach(b => {
            b.onclick = () => removeFromCart(parseInt(b.dataset.id, 10));
        });
    }

    // totals
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0; // 10% if >= 500
    const total = subtotal - discount;

    cartCount.textContent = cart.reduce((t, i) => t + i.quantity, 0);
    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    discountEl.textContent = `-₹${discount.toFixed(2)}`;
    totalEl.textContent = `₹${total.toFixed(2)}`;

    if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `₹${total.toFixed(2)}`;
}

// Open checkout modal
function openCheckoutModal() {
    if (cart.length === 0) return;
    checkoutModal.style.display = 'flex';
    switchTab('delivery');
    updateDeliveryFee();
}

// Close all modals
function closeModals() {
    checkoutModal.style.display = 'none';
    confirmationModal.style.display = 'none';
}

// Switch tabs in checkout modal
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    const tabEl = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (tabEl) tabEl.classList.add('active');

    const content = document.getElementById(`${tabName}Tab`);
    if (content) content.classList.add('active');
}

// Select address (delegated)
document.addEventListener('click', function(e) {
    const target = e.target;
    const addressCard = target.closest('.address-card');
    if (addressCard && (target.classList.contains('address-card') || target.closest('.address-card'))) {
        document.querySelectorAll('.address-card').forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-address-btn');
            if (btn) btn.textContent = 'Select';
        });
        addressCard.classList.add('selected');
        const btn = addressCard.querySelector('.select-address-btn');
        if (btn) btn.textContent = 'Selected';
    }
});

// Update delivery fee
function updateDeliveryFee() {
    const expressSelected = document.getElementById('expressDelivery').checked;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0;
    if (expressSelected) {
        deliveryFeeEl.textContent = '₹50';
        checkoutTotal.textContent = `₹${(subtotal - discount + 50).toFixed(2)}`;
    } else {
        deliveryFeeEl.textContent = 'Free';
        checkoutTotal.textContent = `₹${(subtotal - discount).toFixed(2)}`;
    }
}

// Place order
function placeOrder() {
    // simple order id generation
    const tid = 'ESH' + Math.floor(100000 + Math.random() * 900000);
    if (orderIdEl) orderIdEl.textContent = tid;

    // show confirmation
    checkoutModal.style.display = 'none';
    confirmationModal.style.display = 'flex';

    // reset cart
    cart = [];
    updateCart();
}

// Notification helper
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<div class="notification-content"><i class="fas fa-check-circle"></i><span>${message}</span></div>`;
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#4caf50',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        zIndex: 1100,
        opacity: '0',
        transition: 'opacity 220ms'
    });
    document.body.appendChild(notification);
    requestAnimationFrame(()=> notification.style.opacity = '1');
    setTimeout(()=> {
        notification.style.opacity = '0';
        setTimeout(()=> notification.remove(), 250);
    }, 2600);
}

// Search functionality
function performSearch() {
    const term = (searchInput.value || '').trim().toLowerCase();
    const category = (categoryFilter.value || '').trim();
    const sort = (sortFilter.value || 'popularity');

    let filtered = medicines.slice();

    if (term) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(term) || m.brand.toLowerCase().includes(term) || m.category.toLowerCase().includes(term));
    }

    if (category) {
        filtered = filtered.filter(m => m.category === category);
    }

    switch (sort) {
        case 'price-low':
            filtered.sort((a,b)=> a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a,b)=> b.price - a.price);
            break;
        case 'name':
            filtered.sort((a,b)=> a.name.localeCompare(b.name));
            break;
        default:
            // popularity — keep the original order
            break;
    }

    if (filtered.length === 0) {
        medicinesGrid.innerHTML = `<div class="no-results" style="text-align:center;padding:30px;color:#6c7a93;">
            <i class="fas fa-search" style="font-size:28px;margin-bottom:8px;display:block;"></i>
            <h3>No medicines found</h3>
            <p>Try different search terms or categories</p>
        </div>`;
    } else {
        renderMedicines(filtered);
    }
}

// Language Translation System
const translations = {
  en: {
    // Navigation
    home: "Home",
    services: "Services",
    doctors: "Doctors",
    appointments: "Appointments",
    medicine: "Medicine",
    ai_assistant: "AI Assistant",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    
    // Medicine Page
    medicine_booking: "Medicine Booking",
    medicine_booking_desc: "Search medicines, add to cart and place orders for home delivery.",
    search_placeholder: "Search medicines, brands, categories...",
    search: "Search",
    all_categories: "All Categories",
    pain_relief: "Pain Relief",
    vitamins: "Vitamins & Supplements",
    cardiac: "Cardiac",
    diabetes: "Diabetes",
    respiratory: "Respiratory",
    antibiotic: "Antibiotic",
    gastro: "Gastro",
    popularity: "Popularity",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    name: "Name",
    
    // Cart
    your_cart: "Your Cart",
    cart_empty: "Your cart is empty",
    add_medicines: "Add medicines from the list",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    proceed_checkout: "Proceed to Checkout",
    
    // Checkout Modal
    checkout: "Checkout",
    delivery_address: "Delivery Address",
    payment: "Payment",
    home_address: "Home Address",
    work_address: "Work Address",
    add_new_address: "Add New Address",
    delivery_option: "Delivery Option",
    standard_delivery: "Standard Delivery",
    standard_desc: "Delivery within 2-3 days",
    express_delivery: "Express Delivery",
    express_desc: "Delivery within 24 hours",
    continue_payment: "Continue to Payment",
    cash_on_delivery: "Cash on Delivery",
    card_payment: "Credit/Debit Card",
    upi_payment: "UPI Payment",
    order_summary: "Order Summary",
    medicines_total: "Medicines Total",
    delivery_fee: "Delivery Fee",
    place_order: "Place Order",
    
    // Confirmation Modal
    order_success: "Order Placed Successfully!",
    order_delivery: "Your medicines will be delivered within 2-3 days.",
    view_orders: "View Orders",
    continue_shopping: "Continue Shopping"
  },
  
  pa: {
    // Navigation
    home: "ਘਰ",
    services: "ਸੇਵਾਵਾਂ",
    doctors: "ਡਾਕਟਰ",
    appointments: "ਅਪਾਇੰਟਮੈਂਟਸ",
    medicine: "ਦਵਾਈ",
    ai_assistant: "AI ਅਸਿਸਟੈਂਟ",
    contact: "ਸੰਪਰਕ",
    login: "ਲਾਗਇਨ",
    signup: "ਸਾਈਨ ਅੱਪ",
    
    // Medicine Page
    medicine_booking: "ਦਵਾਈ ਬੁਕਿੰਗ",
    medicine_booking_desc: "ਦਵਾਈਆਂ ਖੋਜੋ, ਕਾਰਟ ਵਿੱਚ ਜੋੜੋ ਅਤੇ ਘਰ ਡਿਲੀਵਰੀ ਲਈ ਆਰਡਰ ਦਿਓ।",
    search_placeholder: "ਦਵਾਈਆਂ, ਬ੍ਰਾਂਡ, ਸ਼੍ਰੇਣੀਆਂ ਖੋਜੋ...",
    search: "ਖੋਜੋ",
    all_categories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
    pain_relief: "ਦਰਦ ਨਿਵਾਰਕ",
    vitamins: "ਵਿਟਾਮਿਨ ਅਤੇ ਸਪਲੀਮੈਂਟਸ",
    cardiac: "ਦਿਲ",
    diabetes: "ਸ਼ੂਗਰ",
    respiratory: "ਸਾਹ",
    antibiotic: "ਐਂਟੀਬਾਇਓਟਿਕ",
    gastro: "ਗੈਸਟ੍ਰੋ",
    popularity: "ਲੋਕਪ੍ਰਿਯਤਾ",
    price_low: "ਕੀਮਤ: ਘੱਟ ਤੋਂ ਵੱਧ",
    price_high: "ਕੀਮਤ: ਵੱਧ ਤੋਂ ਘੱਟ",
    name: "ਨਾਮ",
    
    // Cart
    your_cart: "ਤੁਹਾਡਾ ਕਾਰਟ",
    cart_empty: "ਤੁਹਾਡਾ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    add_medicines: "ਸੂਚੀ ਵਿੱਚੋਂ ਦਵਾਈਆਂ ਜੋੜੋ",
    subtotal: "ਉਪ-ਕੁੱਲ",
    discount: "ਛੂਟ",
    total: "ਕੁੱਲ",
    proceed_checkout: "ਚੈਕਆਉਟ ਕਰੋ",
    
    // Checkout Modal
    checkout: "ਚੈਕਆਉਟ",
    delivery_address: "ਡਿਲੀਵਰੀ ਪਤਾ",
    payment: "ਭੁਗਤਾਨ",
    home_address: "ਘਰ ਦਾ ਪਤਾ",
    work_address: "ਕੰਮ ਦਾ ਪਤਾ",
    add_new_address: "ਨਵਾਂ ਪਤਾ ਜੋੜੋ",
    delivery_option: "ਡਿਲੀਵਰੀ ਵਿਕਲਪ",
    standard_delivery: "ਸਟੈਂਡਰਡ ਡਿਲੀਵਰੀ",
    standard_desc: "2-3 ਦਿਨਾਂ ਵਿੱਚ ਡਿਲੀਵਰੀ",
    express_delivery: "ਐਕਸਪ੍ਰੈਸ ਡਿਲੀਵਰੀ",
    express_desc: "24 ਘੰਟਿਆਂ ਵਿੱਚ ਡਿਲੀਵਰੀ",
    continue_payment: "ਭੁਗਤਾਨ ਜਾਰੀ ਰੱਖੋ",
    cash_on_delivery: "ਕੈਸ਼ ਆਨ ਡਿਲੀਵਰੀ",
    card_payment: "ਕ੍ਰੈਡਿਟ/ਡੈਬਿਟ ਕਾਰਡ",
    upi_payment: "UPI ਭੁਗਤਾਨ",
    order_summary: "ਆਰਡਰ ਸਾਰਾਂਸ਼",
    medicines_total: "ਦਵਾਈਆਂ ਦਾ ਕੁੱਲ",
    delivery_fee: "ਡਿਲੀਵਰੀ ਫੀਸ",
    place_order: "ਆਰਡਰ ਦਿਓ",
    
    // Confirmation Modal
    order_success: "ਆਰਡਰ ਸਫਲਤਾਪੂਰਵਕ ਦਿੱਤਾ ਗਿਆ!",
    order_delivery: "ਤੁਹਾਡੀਆਂ ਦਵਾਈਆਂ 2-3 ਦਿਨਾਂ ਵਿੱਚ ਪਹੁੰਚਾ ਦਿੱਤੀਆਂ ਜਾਣਗੀਆਂ।",
    view_orders: "ਆਰਡਰ ਵੇਖੋ",
    continue_shopping: "ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖੋ"
  },
  
  hi: {
    // Navigation
    home: "होम",
    services: "सेवाएं",
    doctors: "डॉक्टर",
    appointments: "अपॉइंटमेंट",
    medicine: "दवाई",
    ai_assistant: "AI असिस्टेंट",
    contact: "संपर्क",
    login: "लॉगिन",
    signup: "साइन अप",
    
    // Medicine Page
    medicine_booking: "दवाई बुकिंग",
    medicine_booking_desc: "दवाइयां खोजें, कार्ट में जोड़ें और घर डिलीवरी के लिए ऑर्डर दें।",
    search_placeholder: "दवाइयां, ब्रांड, श्रेणियां खोजें...",
    search: "खोजें",
    all_categories: "सभी श्रेणियां",
    pain_relief: "दर्द निवारक",
    vitamins: "विटामिन और सप्लीमेंट्स",
    cardiac: "हृदय",
    diabetes: "मधुमेह",
    respiratory: "श्वसन",
    antibiotic: "एंटीबायोटिक",
    gastro: "गैस्ट्रो",
    popularity: "लोकप्रियता",
    price_low: "कीमत: कम से ज्यादा",
    price_high: "कीमत: ज्यादा से कम",
    name: "नाम",
    
    // Cart
    your_cart: "आपकी कार्ट",
    cart_empty: "आपकी कार्ट खाली है",
    add_medicines: "सूची से दवाइयां जोड़ें",
    subtotal: "उप-योग",
    discount: "छूट",
    total: "कुल",
    proceed_checkout: "चेकआउट करें",
    
    // Checkout Modal
    checkout: "चेकआउट",
    delivery_address: "डिलीवरी पता",
    payment: "भुगतान",
    home_address: "घर का पता",
    work_address: "कार्यालय का पता",
    add_new_address: "नया पता जोड़ें",
    delivery_option: "डिलीवरी विकल्प",
    standard_delivery: "स्टैंडर्ड डिलीवरी",
    standard_desc: "2-3 दिनों में डिलीवरी",
    express_delivery: "एक्सप्रेस डिलीवरी",
    express_desc: "24 घंटों में डिलीवरी",
    continue_payment: "भुगतान जारी रखें",
    cash_on_delivery: "कैश ऑन डिलीवरी",
    card_payment: "क्रेडिट/डेबिट कार्ड",
    upi_payment: "UPI भुगतान",
    order_summary: "ऑर्डर सारांश",
    medicines_total: "दवाइयों का कुल",
    delivery_fee: "डिलीवरी शुल्क",
    place_order: "ऑर्डर दें",
    
    // Confirmation Modal
    order_success: "ऑर्डर सफलतापूर्वक दिया गया!",
    order_delivery: "आपकी दवाइयां 2-3 दिनों में पहुंचा दी जाएंगी।",
    view_orders: "ऑर्डर देखें",
    continue_shopping: "खरीदारी जारी रखें"
  }
};

// Language Management
class LanguageManager {
  constructor() {
    this.currentLang = this.getSavedLanguage() || 'en';
    this.init();
  }
  
  getSavedLanguage() {
    return localStorage.getItem('preferredLanguage');
  }
  
  saveLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
  }
  
  init() {
    this.setLanguage(this.currentLang);
    this.setupEventListeners();
  }
  
  setLanguage(lang) {
    this.currentLang = lang;
    this.saveLanguage(lang);
    this.updatePageLanguage(lang);
    this.updateLanguageSelector(lang);
    this.applyDirection(lang);
  }
  
  updatePageLanguage(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang;
    
    // Translate all elements with data-translate attribute
    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    
    // Translate placeholder attributes
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
    
    // Update select options
    this.translateSelectOptions(lang);
  }
  
  translateSelectOptions(lang) {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      Array.from(select.options).forEach(option => {
        const key = option.getAttribute('data-translate');
        if (key && translations[lang] && translations[lang][key]) {
          option.textContent = translations[lang][key];
        }
      });
    });
  }
  
  updateLanguageSelector(lang) {
    const currentLangElement = document.getElementById('currentLanguage');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Update current language display
    if (lang === 'en') currentLangElement.textContent = 'English';
    else if (lang === 'pa') currentLangElement.textContent = 'ਪੰਜਾਬੀ';
    else if (lang === 'hi') currentLangElement.textContent = 'हिन्दी';
    
    // Update active class on options
    languageOptions.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
  }
  
  applyDirection(lang) {
    // Set text direction based on language
    if (lang === 'pa') {
      document.body.setAttribute('dir', 'ltr'); // Punjabi uses LTR
    } else if (lang === 'hi') {
      document.body.setAttribute('dir', 'ltr'); // Hindi uses LTR
    } else {
      document.body.setAttribute('dir', 'ltr'); // English uses LTR
    }
  }
  
  setupEventListeners() {
    // Language dropdown toggle
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (languageBtn) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
        languageBtn.classList.toggle('active');
      });
    }
    
    // Language option selection
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');
        this.setLanguage(selectedLang);
        languageDropdown.classList.remove('show');
        languageBtn.classList.remove('active');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-select')) {
        languageDropdown.classList.remove('show');
        languageBtn.classList.remove('active');
      }
    });
  }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const languageManager = new LanguageManager();
  
  // Make it globally available if needed
  window.languageManager = languageManager;
});

// Add this to your existing medicine-booking.js file, integrating with your existing code


