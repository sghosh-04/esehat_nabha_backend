import { Request, Response } from "express";
import pool from "../config/database";


/* ================= GET SEMINARS ================= */
export const getSeminars = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM seminars ORDER BY event_date ASC"
    );

    res.status(200).json({
      success: true, 
      data: {
        seminars: result.rows
      }
    });
  } catch (error) {
    console.error("Get seminars error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seminars"
    });
  }
};

/* ================= ADD SEMINAR ================= */
export const addSeminar = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      event_date,
      start_time,
      duration_hours,
      location,
      created_by_kiosk_id,
      created_by_admin
    } = req.body;

    await pool.query(
      `INSERT INTO seminars
      (title, description, event_date, start_time, duration_hours, location, status, created_by_kiosk_id, created_by_admin)
      VALUES ($1,$2,$3,$4,$5,$6,'scheduled',$7,$8)`,
      [
        title,
        description,
        event_date,
        start_time,
        duration_hours,
        location,
        created_by_kiosk_id,
        created_by_admin
      ]
    );

    res.status(201).json({
      success: true,
      message: "Seminar added successfully"
    });
  } catch (error) {
    console.error("Add seminar error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add seminar"
    });
  }
};



export const updateSeminarStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const current = await pool.query(
      "SELECT status FROM seminars WHERE id = $1",
      [id]
    );

    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Seminar not found" });
    }

    if (["completed", "cancelled"].includes(current.rows[0].status)) {
      return res.status(400).json({
        success: false,
        message: "Seminar already finalized"
      });
    }

    await pool.query(
      `UPDATE seminars 
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [status, id]
    );

    res.json({
      success: true,
      message: "Seminar status updated"
    });
  } catch (error) {
    console.error("Update seminar status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

