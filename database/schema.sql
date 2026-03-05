-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    aadhaar_id VARCHAR(12),
    phone_number VARCHAR(15),
    name VARCHAR(255),
    language_preference VARCHAR(10),
    created_at TIMESTAMP,
    otp VARCHAR(6),
    otp_expiry TIMESTAMP,
    email VARCHAR(255),
    dob DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    document TEXT,
    document_name VARCHAR(255),
    document_type VARCHAR(50)
);

-- =========================
-- DOCTORS TABLE
-- =========================
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    specialization VARCHAR(100),
    qualifications TEXT,
    available BOOLEAN,
    password TEXT,
    phonenumber VARCHAR(10),
    name VARCHAR(255),
    license_number VARCHAR(100),
    clinic_name VARCHAR(255),
    clinic_address TEXT,
    email VARCHAR(255),
    experience INTEGER,
    picture_url TEXT
);

-- =========================
-- MEDICAL KIOSKS
-- =========================
CREATE TABLE medical_kiosks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    contact_number VARCHAR(15),
    role VARCHAR(50),
    email_address VARCHAR(150),
    password VARCHAR(255)
);

-- =========================
-- AMBULANCE REQUESTS
-- =========================
CREATE TABLE ambulance_requests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    location_address TEXT,
    contact_number VARCHAR(15),
    reason_for_ambulance TEXT,
    created_at TIMESTAMP
);

-- =========================
-- MEDICINES
-- =========================
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(100),
    stock_quantity INTEGER,
    last_restocked DATE,
    price NUMERIC(10,2),
    category VARCHAR(50)
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    kiosk_id INTEGER,
    total_amount NUMERIC(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    notes TEXT,
    patient_id INTEGER,
    patient_name VARCHAR(255)
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    medicine_id INTEGER,
    quantity INTEGER,
    price_per_unit NUMERIC(10,2)
);

-- =========================
-- APPOINTMENTS
-- =========================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    doctor_id INTEGER,
    scheduled_time TIMESTAMP,
    status VARCHAR(20),
    symptoms TEXT,
    created_at TIMESTAMP,
    time_slot VARCHAR(50),
    updated_at TIMESTAMP,
    department VARCHAR(100),
    type VARCHAR(50),
    patient_name VARCHAR(255),
    doctor_name VARCHAR(255),
    cancelled_at TIMESTAMP,
    cancel_reason TEXT
);

-- =========================
-- SEMINARS
-- =========================
CREATE TABLE seminars (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    event_date DATE,
    start_time TIME,
    duration_hours INTEGER,
    location VARCHAR(255),
    status VARCHAR(50),
    created_by_kiosk_id INTEGER,
    created_by_admin INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);