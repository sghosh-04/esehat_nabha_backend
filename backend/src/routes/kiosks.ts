import express from "express";
import { 
  getKiosks, 
  registerKioskAdmin, 
  loginKioskAdmin, 
  getKioskAdminProfile, 
  updateKioskAdminProfile,
  getKioskByEmail // Add this new function
} from "../controllers/kioskController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerKioskAdmin);
router.post("/login", loginKioskAdmin);
router.get("/", getKiosks);

// New route to get kiosk by email (optional - if needed)
router.get("/email/:email", getKioskByEmail);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, getKioskAdminProfile);
router.put("/profile", authMiddleware, updateKioskAdminProfile);

export default router;