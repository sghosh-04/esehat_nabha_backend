import { Request, Response } from 'express';
import { analyzeSymptoms, askHealthQuestion } from '../services/aiService';
import { formatResponse } from '../utils/helpers';
import { SymptomAnalysisRequest, HealthChatRequest } from '../types';

export const analyzeSymptomsController = async (req: Request<{}, {}, SymptomAnalysisRequest>, res: Response): Promise<void> => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.trim().length < 5) {
    res.status(400).json(formatResponse(false, 'Please describe your symptoms in more detail (at least 5 characters).'));
    return;
  }

  try {
    const result = await analyzeSymptoms(symptoms);
    
    if (result.success) {
      res.json(formatResponse(true, undefined, { analysis: result.analysis }));
    } else {
      res.status(500).json(formatResponse(false, result.message));
    }
  } catch (error) {
    console.error('Error in symptom analysis:', error);
    res.status(500).json(formatResponse(false, 'An error occurred while analyzing symptoms.'));
  }
};

export const healthChatController = async (req: Request<{}, {}, HealthChatRequest>, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400).json(formatResponse(false, 'Please enter a question.'));
    return;
  }

  try {
    const result = await askHealthQuestion(message);
    
    if (result.success) {
      res.json(formatResponse(true, undefined, { answer: result.answer }));
    } else {
      res.status(500).json(formatResponse(false, result.message));
    }
  } catch (error) {
    console.error('Error in health chat:', error);
    res.status(500).json(formatResponse(false, 'An error occurred in the chat service.'));
  }
};