-- =========================
-- USERS
-- =========================
INSERT INTO users (aadhaar_id, phone_number, name, language_preference, city)
VALUES
('958619', '7654321904', 'Sumita Mondal', 'punjabi', 'Nabha'),
('622702', '1234567890', 'Somaditya Deb', 'punjabi', 'Nabha'),
('782312', '9874263804', 'Srijeeta Dutta', 'punjabi', 'Nabha');

-- =========================
-- DOCTORS
-- =========================
INSERT INTO doctors (name, specialization, qualifications, available, phonenumber, clinic_name, experience)
VALUES
('Rajeev Kumar', 'Neurology', 'MBBS, MD Neurology', true, '9876543217', 'City Neuro Clinic', 10),
('Subham Roy', 'Orthopedics', 'MBBS MD', true, '3456789012', 'OrthoCare Clinic', 8),
('Anindita Sen', 'Dermatology', 'MBBS MD', true, '9874498560', 'SkinCare Center', 6);

-- =========================
-- MEDICAL KIOSKS
-- =========================
INSERT INTO medical_kiosks (name, address, contact_number)
VALUES
('Nabha Main Kiosk', '123 Main Road, Nabha', '9876543210'),
('Village Sector 5 Kiosk', 'Village Panchayat Building, Sector 5', '9876543211'),
('Rural Health Center Kiosk', 'Rural Health Center, Nabha Outer Ring', '9876543212');

-- =========================
-- MEDICINES
-- =========================
INSERT INTO medicines (name, brand, stock_quantity, last_restocked, price, category)
VALUES
('Paracetamol', 'Crocin', 136, '2024-05-01', 25.50, 'pain-relief'),
('Ibuprofen', 'Brufen', 41, '2024-04-25', 45.75, 'pain-relief'),
('Metformin', 'Glycomet', 199, '2024-05-15', 85.00, 'diabetes'),
('Azithromycin', 'Azee', 55, '2024-05-18', 180.00, 'antibiotic');

-- =========================
-- ORDERS
-- =========================
INSERT INTO orders (kiosk_id, total_amount, status, patient_name)
VALUES
(1, 171.00, 'pending', 'Sumita Mondal'),
(1, 91.50, 'pending', 'Somaditya Deb'),
(1, 300.00, 'pending', 'Srijeeta Dutta');

-- =========================
-- ORDER ITEMS
-- =========================
INSERT INTO order_items (order_id, medicine_id, quantity, price_per_unit)
VALUES
(1, 1, 2, 25.50),
(1, 2, 1, 120.00),
(2, 2, 2, 45.75);

-- =========================
-- APPOINTMENTS
-- =========================
INSERT INTO appointments (patient_id, doctor_id, scheduled_time, status, symptoms, time_slot)
VALUES
(10, 14, '2025-09-26 11:00:00', 'scheduled', 'Fever', '11:00 AM'),
(10, 15, '2025-09-26 09:00:00', 'scheduled', 'Stomach issues', '09:00 AM'),
(10, 11, '2025-09-26 09:00:00', 'scheduled', 'Nerve issues', '09:00 AM');

-- =========================
-- AMBULANCE REQUESTS
-- =========================
INSERT INTO ambulance_requests (full_name, age, gender, blood_group, location_address, contact_number, reason_for_ambulance)
VALUES
('Rahul Sharma', 45, 'Male', 'B+', '123 MG Road, New Delhi', '9876543210', 'Severe chest pain'),
('Anjali Verma', 32, 'Female', 'O-', '456 Park Street, Kolkata', '9123456789', 'Accident with leg injury');

-- =========================
-- SEMINARS
-- =========================
INSERT INTO seminars (title, description, event_date, start_time, duration_hours, location, status)
VALUES
('Vaccination Drive', 'Routine immunization drive', '2025-09-20', '09:00:00', 6, 'Primary School Hall', 'scheduled'),
('Mental Health Awareness Session', 'Workshop on stress management', '2025-09-30', '14:00:00', 2, 'Civil Hospital', 'scheduled');