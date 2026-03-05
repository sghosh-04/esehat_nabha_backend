import { Request, Response } from 'express';
import pool from '../config/database';
import { formatResponse } from '../utils/helpers';
import bcrypt from 'bcryptjs'; // Using bcryptjs as discussed
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';

// Kiosk Registration - Updated for medical_kiosks table
export const registerKioskAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, contact_number, email_address, password, role } = req.body;

    // Validation - using your table's column names
    if (!name || !address || !contact_number || !email_address || !role|| !password) {
      res.status(400).json(formatResponse(false, 'All fields are required'));
      return;
    }

    // Check if email already exists in medical_kiosks
    const existingKiosk = await pool.query(
      'SELECT id FROM medical_kiosks WHERE email_address = $1',
      [email_address]
    );

    if (existingKiosk.rows.length > 0) {
      res.status(400).json(formatResponse(false, 'Email already registered for a kiosk'));
      return;
    }

    // Check if contact number already exists
    const existingContact = await pool.query(
      'SELECT id FROM medical_kiosks WHERE contact_number = $1',
      [contact_number]
    );

    if (existingContact.rows.length > 0) {
      res.status(400).json(formatResponse(false, 'Contact number already registered'));
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into medical_kiosks table with your column names
    const result = await pool.query(
      `INSERT INTO medical_kiosks 
       (name, address, contact_number, email_address, password, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, address, contact_number, email_address, role`,
      [name, address, contact_number, email_address, passwordHash, role || 'kiosk-admin']
    );

    res.status(201).json(formatResponse(true, 'Kiosk registered successfully', {
      kiosk: result.rows[0]
    }));

  } catch (error) {
    console.error('Error registering kiosk:', error);
    res.status(500).json(formatResponse(false, 'Server error during kiosk registration'));
  }
};

// Kiosk Login - Updated for medical_kiosks table
export const loginKioskAdmin = async (req: Request, res: Response): Promise<void> => {
  console.log("LOGIN BODY:", req.body);
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json(formatResponse(false, 'Email and password are required'));
      return;
    }

    // Find kiosk by email_address
    const kioskResult = await pool.query(
      `SELECT id, name, address, contact_number, email_address, password, role
       FROM medical_kiosks WHERE email_address = $1`,
      [email]
    );

    if (kioskResult.rows.length === 0) {
      res.status(401).json(formatResponse(false, 'Invalid email or password'));
      return;
    }

    const kiosk = kioskResult.rows[0];
    console.log("DB KIOSK ROW:", kiosk);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, kiosk.password);

    if (!isPasswordValid) {
      res.status(401).json(formatResponse(false, 'Invalid email or password'));
      return;
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign(
      { 
        id: kiosk.id, 
        email: kiosk.email_address, 
        role: kiosk.role || 'kiosk-admin',
        type: 'kiosk' 
      },
      secret,
      { expiresIn: '24h' }
    );

    res.json(formatResponse(true, 'Login successful', {
      token,
      user: {
        id: kiosk.id,
        role: kiosk.role || 'kiosk-admin',
        kiosk_id: kiosk.id,
        kiosk_code: `KSN-2025-${String(kiosk.id).padStart(3, '0')}`,
        kiosk_name: kiosk.name,
        kiosk_location: kiosk.address
      }
    }));


  } catch (error) {
    console.error('Error during kiosk login:', error);
    res.status(500).json(formatResponse(false, 'Server error during login'));
  }
};

// Get all kiosks (existing functionality - unchanged)
// Get all kiosks with formatted ID and admin name
export const getKiosks = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT id, name FROM medical_kiosks ORDER BY id');

    // Map DB results to desired format
    const kiosks = result.rows.map((kiosk) => ({
      kioskId: `KSN-2025-${String(kiosk.id).padStart(3, '0')}`, // e.g., 1 -> KSN-2025-001
      kioskAdmin: kiosk.name
    }));

    res.json(formatResponse(true, undefined, { kiosks }));

  } catch (error) {
    console.error('Error fetching kiosks:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching kiosks.'));
  }
};

// Get kiosk by email (NEW FUNCTION)
export const getKioskByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json(formatResponse(false, 'Email parameter is required'));
      return;
    }

    const result = await pool.query(
      `SELECT id, name, address, contact_number, email_address, role
       FROM medical_kiosks WHERE email_address = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(404).json(formatResponse(false, 'Kiosk not found for this email'));
      return;
    }

    const kiosk = result.rows[0];
    
    res.json(formatResponse(true, undefined, { 
      kiosk: {
        kioskId: `KSN-2025-${String(kiosk.id).padStart(3, '0')}`,
        kioskAdmin: kiosk.name,
        email: kiosk.email_address,
        address: kiosk.address,
        contact_number: kiosk.contact_number,
        role: kiosk.role
      }
    }));

  } catch (error) {
    console.error('Error fetching kiosk by email:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching kiosk'));
  }
};

// Get kiosk profile
export const getKioskAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const kioskId = (req as any).doctor?.id;

    const result = await pool.query(
      `SELECT id, name, address, contact_number, email_address, role
       FROM medical_kiosks WHERE id = $1`,
      [kioskId]
    );

    if (result.rows.length === 0) {
      res.status(404).json(formatResponse(false, 'Kiosk not found'));
      return;
    }

    res.json(formatResponse(true, undefined, { kiosk: result.rows[0] }));

  } catch (error) {
    console.error('Error fetching kiosk profile:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching profile'));
  }
};

// Update kiosk profile
export const updateKioskAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const kioskId = (req as any).doctor?.id;
    const { name, address, contact_number } = req.body;

    const result = await pool.query(
      `UPDATE medical_kiosks 
       SET name = $1, address = $2, contact_number = $3
       WHERE id = $4 
       RETURNING id, name, address, contact_number, email_address, role`,
      [name, address, contact_number, kioskId]
    );

    if (result.rows.length === 0) {
      res.status(404).json(formatResponse(false, 'Kiosk not found'));
      return;
    }

    res.json(formatResponse(true, 'Profile updated successfully', { 
      kiosk: result.rows[0] 
    }));

  } catch (error) {
    console.error('Error updating kiosk profile:', error);
    res.status(500).json(formatResponse(false, 'Server error updating profile'));
  }
};