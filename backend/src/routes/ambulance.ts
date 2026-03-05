import { Router } from "express";
import { 
  createAmbulanceRequest, 
  getAmbulanceRequests, 
  getAmbulanceRequestById,
  updateAmbulanceRequest 
} from "../controllers/ambulanceController";

const router = Router();

// POST: create a request
router.post("/", createAmbulanceRequest);

// GET: fetch all requests
router.get("/", getAmbulanceRequests);

// GET: fetch single request by ID
router.get("/:id", getAmbulanceRequestById);

// PUT: update request status
router.put("/:id", updateAmbulanceRequest);

export default router;