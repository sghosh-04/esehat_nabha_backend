// src/controllers/userController.ts

import { Request, Response } from "express";
import { User } from "../models/user";
import pool from "../config/database";

/**
 * GET /api/users?phone_number=...
 * Fetch user by phone number
 */
export const getUserByPhone = async (req: Request, res: Response) => {
  try {
    const { phone_number } = req.query;

    if (!phone_number) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const result = await pool.query<User>(
      `SELECT id, aadhaar_id, phone_number, name, language_preference,
              created_at, otp, otp_expiry, email, dob, gender, 
              address, city, pincode
       FROM users
       WHERE phone_number = $1`,
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return res.status(500).json({ error: "Server error fetching user" });
  }
};

/**
 * POST /api/users/signup
 * Body: { fullName, email, mobile, dob, gender, address, city, pincode }
 * Handles patient signup
 */
export const signupUser = async (req: Request, res: Response) => {
  console.log("✅ Incoming request body:", req.body);  // ✅ Debug: Check incoming data

  try {
    const {
      fullName,
      email,
      mobile,
      dob,
      gender,
      address,
      city,
      pincode,
    } = req.body;

    // Basic validation
    if (!fullName || !mobile) {
      return res.status(400).json({ error: "Full name and mobile number are required" });
    }

    // Check if phone number already exists
    const existing = await pool.query("SELECT id FROM users WHERE phone_number = $1", [mobile]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User with this phone number already exists" });
    }

    // Generate dummy aadhaar_id (6-digit random string)
    const aadhaar_id = Math.floor(100000 + Math.random() * 900000).toString();

    const insertResult = await pool.query(
      `INSERT INTO users (
         aadhaar_id,
         phone_number,
         name,
         language_preference,
         created_at,
         email,
         dob,
         gender,
         address,
         city,
         pincode
       ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9, $10)
       RETURNING id, aadhaar_id, phone_number, name, language_preference, created_at, email, dob, gender, address, city, pincode`,
      [
        aadhaar_id,
        mobile,
        fullName,
        "punjabi", // default language preference
        email || null,
        dob || null,
        gender || null,
        address || null,
        city || null,
        pincode || null,
      ]
    );

    const newUser = insertResult.rows[0];
    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("❌ Error during user signup:", err);
    return res.status(500).json({ error: "Server error during signup" });
  }
};




export const uploadDocumentToDB = async (req: Request, res: Response) => {
  console.log("🔥 uploadDocumentToDB HIT");

  try {
    const phoneNumber = req.query.phone_number as string;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    // 🔍 Find user by phone number
    const userResult = await pool.query(
      "SELECT id FROM users WHERE phone_number = $1",
      [phoneNumber]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        message: "User not found for this phone number"
      });
    }

    const userId = userResult.rows[0].id;

    // 📄 Validate file
    if (!req.file) {
      return res.status(400).json({
        message: "No document uploaded"
      });
    }

    // 💾 Store prescription
    await pool.query(
      `UPDATE users
       SET document = $1,
           document_name = $2,
           document_type = $3
       WHERE id = $4`,
      [
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        userId
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Prescription uploaded successfully"
    });

  } catch (error) {
    console.error("❌ uploadDocumentToDB error:", error);
    return res.status(500).json({
      message: "Failed to upload prescription"
    });
  }
};

export const getUserPrescription = async (req: Request, res: Response) => {
  console.log("🔥 getUserPrescription HIT", req.query);
  try {
    const phoneNumber = req.query.phone_number as string;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const result = await pool.query(
      `SELECT document_name, document_type, document
       FROM users
       WHERE phone_number = $1`,
      [phoneNumber]
    );

    if (result.rowCount === 0 || !result.rows[0].document) {
      return res.status(404).json({ message: "No prescription found" });
    }

    const { document, document_name, document_type } = result.rows[0];

    res.setHeader("Content-Type", document_type);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document_name}"`
    );

    res.send(document);

  } catch (err) {
    console.error("❌ getUserPrescription error:", err);
    res.status(500).json({ message: "Failed to fetch prescription" });
  }
};
