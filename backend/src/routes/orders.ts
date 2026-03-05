import express from 'express';
import { placeOrder, getPatientOrders, getAllOrders, getOrderHistory } from '../controllers/orderController';

const router = express.Router();

router.post('/', placeOrder);
router.get('/patient/:patient_id', getPatientOrders);
router.get('/all', getAllOrders);

// ✅ New route: history by patient_id or patient_name
router.get('/history', getOrderHistory);

export default router;
