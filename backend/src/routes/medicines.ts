import express from "express";
import {
  getMedicines,
  addMedicine
} from "../controllers/medicineController";

const router = express.Router();

router.get("/", getMedicines);

// 📍 routes/medicines.ts
router.post("/", addMedicine);


// NEW ROUTE
router.post("/", addMedicine);

export default router;
