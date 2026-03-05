# 🏥 eSehat Nabha

**eSehat Nabha** is a digital healthcare platform designed to improve healthcare accessibility in semi-urban and rural regions.
The system connects **patients, doctors, medical kiosks, ambulance services, telemedicine, and medicine ordering** into a unified healthcare ecosystem.

This project was developed as part of the **Smart India Hackathon (SIH)** to promote technology-driven healthcare accessibility.

---

# 📌 Problem Statement

Many rural and semi-urban areas lack efficient access to healthcare services. Patients often face challenges such as:

* Difficulty booking doctor appointments
* Lack of medicine availability
* Slow emergency ambulance response
* Limited access to specialist doctors
* Poor awareness of healthcare programs

**eSehat Nabha** aims to digitize and streamline these healthcare services through a unified healthcare platform.

---

# 🚀 Features

## 👤 Patient Management

* User registration using Aadhaar and phone number
* OTP verification for secure login
* Personal profile management
* Language preference support

---

## 👨‍⚕️ Doctor Management

* Doctor profiles with specialization and qualifications
* Clinic and contact information
* Availability status
* Experience tracking

---

## 📅 Appointment Booking

Patients can:

* Book appointments with doctors
* Choose available time slots
* Add symptoms before consultation
* Cancel or reschedule appointments

---

## 🎥 Telemedicine Video Consultation

* Patients can consult doctors remotely through video calls
* Enables access to healthcare without visiting hospitals
* Especially useful for rural patients and elderly users

---

## 🤖 AI-Based Symptom Analysis

* AI assists patients by analyzing entered symptoms
* Provides preliminary health insights
* Helps patients choose the correct specialist

---

## 🚑 Real-Time Ambulance Tracking

Emergency services allow patients to:

* Request an ambulance
* Share location details
* Track ambulance movement in real time
* Provide blood group and medical details

---

## 💊 Medicine Ordering System

Patients can:

* Browse medicines
* Place medicine orders via medical kiosks
* Track order status
* View ordered medicines and pricing

---

## 💳 Online Medicine Payment System

* Secure digital payments for medicine orders
* Simplifies the medicine purchasing process
* Reduces dependency on cash transactions

---

## 🏥 Medical Kiosk Management

Medical kiosks act as local healthcare hubs that:

* Manage medicine inventory
* Process medicine orders
* Assist patients in rural areas
* Organize health seminars and awareness campaigns

---

## 📁 Digital Health Records

* Stores patient health data securely
* Enables doctors to view medical history
* Improves continuity of care

---

## 📢 Health Awareness Seminars

The platform allows administrators to organize:

* Vaccination drives
* Mental health awareness sessions
* Health camps and workshops

---

# 🛠 Tech Stack

### Backend

* Node.js
* TypeScript
* Express.js

### Database

* PostgreSQL

### Tools

* Git
* GitHub
* pgAdmin

---

# 🗄 Database Structure

The application uses **9 core tables**:

| Table              | Description                         |
| ------------------ | ----------------------------------- |
| users              | Stores patient information          |
| doctors            | Doctor profiles and medical details |
| appointments       | Appointment scheduling data         |
| ambulance_requests | Emergency ambulance requests        |
| medical_kiosks     | Healthcare kiosk information        |
| medicines          | Medicine inventory                  |
| orders             | Medicine order records              |
| order_items        | Individual medicines in orders      |
| seminars           | Health awareness events             |

---

# 📂 Project Structure

```
esehat-nabha
│
├ backend
│   ├ src
│   ├ uploads
│   ├ package.json
│   ├ tsconfig.json
│
├ database
│   ├ schema.sql
│   └ seed.sql
│
├ eSehat App (frontend)
│   ├ home-page
│   ├ login-page
│   ├ sign-up-page
│
├ .gitignore
└ README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```
git clone https://github.com/your-username/esehat-nabha.git
cd esehat-nabha
```

---

## 2️⃣ Install backend dependencies

```
cd backend
npm install
```

---

## 3️⃣ Setup PostgreSQL database

Create database:

```
CREATE DATABASE esehat_nabha;
```

Run schema file:

```
psql -U postgres -d esehat_nabha -f database/schema.sql
```

Insert sample data:

```
psql -U postgres -d esehat_nabha -f database/seed.sql
```

---

## 4️⃣ Configure environment variables

Create `.env` inside **backend**

```
DATABASE_URL=postgresql://username:password@localhost:5432/esehat_nabha
PORT=5000
```

---

## 5️⃣ Start the backend server

```
npm run dev
```

---

# 🏆 Smart India Hackathon (SIH)

This project was developed as part of the **Smart India Hackathon (SIH)** to build a digital healthcare platform that improves medical accessibility and emergency response in rural and semi-urban regions.

---

# 👨‍💻 Authors

Developed by the **eSehat Team** as part of the Smart India Hackathon project.

---

# 📜 License

This project is intended for **educational and research purposes**.
