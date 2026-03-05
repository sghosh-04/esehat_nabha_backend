// src/controllers/doctorsController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database"; // PostgreSQL connection


// ---------------- Doctor Registration ----------------
export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      specialization,
      qualifications,
      license_number,
      email,
      phonenumber,
      clinic_name,
      clinic_address,
      experience,
      password,
    } = req.body;

    // Check if doctor already exists by email, phone, or license_number
    const existing = await pool.query(
      "SELECT * FROM doctors WHERE email = $1 OR phonenumber = $2 OR license_number = $3",
      [email, phonenumber, license_number]
    );

    if (existing.rows.length > 0) {
      const existingDoctor = existing.rows[0];
      let errorMsg = "Doctor already exists";
      if (existingDoctor.license_number === license_number) errorMsg = "License number already exists";
      else if (existingDoctor.email === email) errorMsg = "Email already registered";
      else if (existingDoctor.phonenumber === phonenumber) errorMsg = "Phone number already registered";

      return res.status(400).json({ message: errorMsg });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into DB

    const pictureUrl = req.file ? req.file.filename : "default_profile.jpg";

    await pool.query(
      `INSERT INTO doctors 
        (name, specialization, qualifications, license_number, email, phonenumber, clinic_name, clinic_address, experience, password, available)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        name,
        specialization,
        qualifications,
        license_number,
        email,
        phonenumber,
        clinic_name,
        clinic_address,
        experience,
        hashedPassword,
        true
      ]
    );

    return res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("Doctor Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Doctor Login ----------------
export const loginDoctor = async (req: Request, res: Response) => {
  try {
    const { license_number, password } = req.body;

    if (!license_number || !password) {
      return res.status(400).json({ message: "License number and password required" });
    }

    // Fetch doctor by license_number
    const result = await pool.query(
      "SELECT * FROM doctors WHERE license_number = $1",
      [license_number]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const doctor = result.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor.id, license_number: doctor.license_number, role: "doctor" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        license_number: doctor.license_number,
        email: doctor.email,
        phonenumber: doctor.phonenumber,
        clinic_name: doctor.clinic_name,
        clinic_address: doctor.clinic_address,
        experience: doctor.experience,
        available: doctor.available
      },
    });
  } catch (error) {
    console.error("Doctor Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Doctor Details by License ID ----------------
export const getDoctorDetails = async (req: Request, res: Response) => {
  try {
    const { license_id } = req.params;

    const result = await pool.query(
    `SELECT id, name, specialization, qualifications, license_number, email, phonenumber, clinic_name, clinic_address, experience, picture_url
    FROM doctors 
    WHERE license_number = $1`,
    [license_id]
  );


    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Doctor Details Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//doctor in home page//

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        specialization,
        experience,
        qualifications,
        clinic_name,
        clinic_address,
        picture_url
      FROM doctors
      WHERE available = true
      ORDER BY experience DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors"
    });
  }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doctorId = req.params.id;

    await pool.query(
      "UPDATE doctors SET picture_url = $1 WHERE id = $2",
      [req.file.filename, doctorId]
    );

    res.status(200).json({
      success: true,
      picture_url: req.file.filename
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};


