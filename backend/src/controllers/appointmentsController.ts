import { Request, Response } from 'express';
import pool from '../config/database';
import { formatResponse } from '../utils/helpers';
import { BookAppointmentRequest } from '../types';

// -------------------- Book Appointment --------------------
// -------------------- Book Appointment --------------------
export const bookAppointment = async (req: Request<{}, {}, BookAppointmentRequest>, res: Response): Promise<void> => {
  const { 
  patient_id, doctor_id, scheduled_time, symptoms, 
  time_slot, department, patient_name, doctor_name 
} = req.body;

  try {
    const result = await pool.query(
  `INSERT INTO appointments 
   (patient_id, doctor_id, scheduled_time, symptoms, time_slot, department, patient_name, doctor_name, status)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')   
   RETURNING *`,
  [patient_id, doctor_id, scheduled_time, symptoms, time_slot, department, patient_name, doctor_name]
);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: { appointment: result.rows[0] }
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('ERROR booking appointment:', error);
    res.status(500).json({
      success: false,
      message: `Server error booking appointment: ${error.message}`
    });
  }
};



// -------------------- Get Patient Appointments --------------------
export const getPatientAppointments = async (req: Request, res: Response): Promise<void> => {
  const { patient_id } = req.params;

  try {
    const patientId = parseInt(patient_id, 10);
    if (isNaN(patientId)) {
      res.status(400).json(formatResponse(false, 'Invalid patient ID. Please provide a valid number.'));
      return;
    }

const result = await pool.query(
  `SELECT a.*,
   COALESCE(u.name, a.doctor_name) AS doctor_name,
   d.specialization
   FROM appointments a
   LEFT JOIN doctors d ON a.doctor_id = d.id
   LEFT JOIN users u ON d.user_id = u.id
   WHERE a.patient_id = $1
   ORDER BY a.scheduled_time DESC`,
  [patientId]
);



    res.json(formatResponse(true, undefined, { appointments: result.rows }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching appointments.'));
  }
  console.log('Patient ID:', patient_id);


};

// -------------------- Get Available Specializations --------------------
export const getSpecializations = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT specialization 
       FROM doctors 
       WHERE available = TRUE 
       ORDER BY specialization`
    );

    res.json(formatResponse(true, undefined, { 
      specializations: result.rows.map(row => row.specialization) 
    }));
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching specializations.'));
  }
};

// Get doctors by specialization
// In your appointmentsController.js - should look like this:
// In appointmentsController.js - FIXED version
// In appointmentsController.js - FIXED
export const getDoctorsBySpecialization = async (req: Request, res: Response): Promise<void> => {
  const { specialization } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, user_id, name, specialization, phonenumber, email, experience, license_number
       FROM doctors 
       WHERE specialization ILIKE $1 AND available = TRUE
       ORDER BY name`,
      [`%${specialization}%`]
    );

    res.json({
      success: true,
      data: {
        doctors: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors.'
    });
  }
};
// -------------------- Get Doctor Appointments --------------------
export const getDoctorAppointments = async (req: Request, res: Response): Promise<void> => {
  const { doctor_id } = req.params;

  try {
    const doctorId = parseInt(doctor_id, 10);
    if (isNaN(doctorId)) {
      res.status(400).json(formatResponse(false, 'Invalid doctor ID. Please provide a valid number.'));
      return;
    }

    const result = await pool.query(
      `SELECT a.*, u.name AS patient_name,
       u.phone_number AS patient_phone
       FROM appointments a
       INNER JOIN users u ON a.patient_id = u.id
       WHERE a.doctor_id = $1
       ORDER BY a.scheduled_time DESC`,
      [doctorId]
    );

    res.json(formatResponse(true, undefined, { appointments: result.rows }));
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching doctor appointments.'));
  }
};

//-------Cancel Appointment----------------
export const cancelAppointment = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.id);
  const { reason } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [appointmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    const appointment = result.rows[0];

    // ✅ STATUS CHECK ONLY
    if (appointment.status.toLowerCase() !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled appointments can be cancelled"
      });
    }

    // ✅ CANCEL
    await pool.query(
      `
      UPDATE appointments
      SET status = 'cancelled',
          cancelled_at = NOW(),
          cancel_reason = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [reason || null, appointmentId]
    );

    return res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// -------------------- Accept Appointment --------------------
export const acceptAppointment = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.id);
  const { doctor_id } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [appointmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const appointment = result.rows[0];

    if (appointment.doctor_id !== Number(doctor_id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be accepted"
      });
    }

    await pool.query(
      `UPDATE appointments
       SET status = 'accepted',
           updated_at = NOW()
       WHERE id = $1`,
      [appointmentId]
    );

    return res.json({
      success: true,
      message: "Appointment accepted successfully"
    });

  } catch (error) {
    console.error("Accept appointment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------- Reject Appointment --------------------
export const rejectAppointment = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.id);
  const { doctor_id, reason } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [appointmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const appointment = result.rows[0];

    if (appointment.doctor_id !== Number(doctor_id)){
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be rejected"
      });
    }

    await pool.query(
      `UPDATE appointments
       SET status = 'rejected',
           cancelled_at = NOW(),
           cancel_reason = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [reason || "Doctor rejected", appointmentId]
    );

    return res.json({
      success: true,
      message: "Appointment rejected successfully"
    });

  } catch (error) {
    console.error("Reject appointment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};