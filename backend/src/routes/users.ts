// src/routes/users.ts
import { Router } from "express";
import { getUserByPhone, getUserPrescription, signupUser } from "../controllers/userController";
import { documentUpload } from "../config/documentUpload";
import { uploadDocumentToDB } from "../controllers/userController";

const router = Router();

// Fetch user by phone
router.get("/", getUserByPhone);

// Signup new patient user
router.post("/signup", signupUser);

router.post(
  "/upload-prescription",
  documentUpload.single("document"), // 🔥 MUST MATCH FRONTEND
  uploadDocumentToDB
);

router.get(
  "/prescription",
  getUserPrescription
);


export default router;
