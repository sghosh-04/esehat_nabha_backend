import express from 'express';
import { analyzeSymptomsController, healthChatController } from '../controllers/aiController';

const router = express.Router();

router.post('/analyze-symptoms', analyzeSymptomsController);
router.post('/health-chat', healthChatController);

export default router;