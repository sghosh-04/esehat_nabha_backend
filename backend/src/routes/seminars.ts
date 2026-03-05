import express from "express";
import { addSeminar, getSeminars, updateSeminarStatus } from "../controllers/seminarController";

const router = express.Router();

router.post("/", addSeminar);
router.get("/", getSeminars);
router.patch("/:id/status", updateSeminarStatus);


export default router;
