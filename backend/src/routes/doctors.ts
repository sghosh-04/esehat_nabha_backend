import { Router } from "express";
import { registerDoctor, loginDoctor, getDoctorDetails, getDoctors } from "../controllers/doctorsController";
import { uploadProfileImage } from "../controllers/uploadProfileImageController";
import authMiddleware from "../middleware/authMiddleware";  // <-- add this
import { upload } from "../config/uploadConfig";


const router = Router();

// Doctor Registration
router.post("/register", registerDoctor);

// Doctor Login
router.post("/login", loginDoctor);

router.get("/list", getDoctors);

// Get Doctor Details by License/Registration ID (Protected)
router.get("/:license_id", authMiddleware, getDoctorDetails); // <-- protect with middleware

router.post(
  "/:id/upload-profile",
  authMiddleware,
  upload.single("image"), // 🔥 MUST match frontend
  uploadProfileImage
);



export default router;
