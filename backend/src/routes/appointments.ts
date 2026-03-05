import express from 'express';

import { 
  bookAppointment, 
  getPatientAppointments, 
  getDoctorsBySpecialization,
  getSpecializations,
  getDoctorAppointments,
  cancelAppointment,
  acceptAppointment,
  rejectAppointment  // Add this import
} from '../controllers/appointmentsController';

const router = express.Router();

router.post('/', bookAppointment);
router.get('/patient/:patient_id', getPatientAppointments);

router.get('/doctor/:doctor_id', getDoctorAppointments);
router.put('/:id/accept', acceptAppointment);
router.put('/:id/reject', rejectAppointment);
// Add this line
router.get('/doctors/:specialization', getDoctorsBySpecialization);
router.put("/:id/cancel", cancelAppointment);


export default router;