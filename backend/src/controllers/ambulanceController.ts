import { Request, Response } from "express";
import pool from "../config/database";

// Create new ambulance request
export const createAmbulanceRequest = async (req: Request, res: Response) => {
  try {
    const { full_name, age, gender, blood_group, location_address, contact_number, reason_for_ambulance } = req.body;

    // Basic validation
    if (!full_name || !location_address || !contact_number) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: full_name, location_address, contact_number" 
      });
    }

    const result = await pool.query(
      `INSERT INTO ambulance_requests 
        (full_name, age, gender, blood_group, location_address, contact_number, reason_for_ambulance) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [full_name, age, gender, blood_group, location_address, contact_number, reason_for_ambulance]
    );

    res.status(201).json({ 
      success: true, 
      message: "Ambulance request created successfully",
      data: result.rows[0] 
    });
  } catch (err: any) {
    console.error("❌ Error creating request:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to create ambulance request" 
    });
  }
};

// Get all ambulance requests
export const getAmbulanceRequests = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ambulance_requests ORDER BY created_at DESC"
    );
    
    res.json({ 
      success: true, 
      count: result.rows.length,
      data: result.rows 
    });
  } catch (err: any) {
    console.error("❌ Error fetching requests:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch ambulance requests" 
    });
  }
};

// Get ambulance request by ID
export const getAmbulanceRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM ambulance_requests WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ambulance request not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err: any) {
    console.error("❌ Error fetching request:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ambulance request"
    });
  }
};

// Update ambulance request status
export const updateAmbulanceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required"
      });
    }

    const result = await pool.query(
      "UPDATE ambulance_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ambulance request not found"
      });
    }

    res.json({
      success: true,
      message: "Ambulance request updated successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    console.error("❌ Error updating request:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to update ambulance request"
    });
  }
};