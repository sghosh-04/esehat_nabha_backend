// backend/src/services/aiService.ts
import OpenAI from "openai";
import { SymptomAnalysis } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----------------- Analyze Symptoms -----------------
export const analyzeSymptoms = async (
  symptoms: string
): Promise<{ success: boolean; analysis?: SymptomAnalysis; message?: string }> => {
  try {
    const prompt = `
You are an AI medical assistant for the e-Sehat Nabha app. Your role is to provide preliminary symptom analysis and triage advice. 
IMPORTANT: You MUST always include a disclaimer that you are not a substitute for a real doctor.

Please analyze the following symptoms described by the user:

"${symptoms}"

Provide a structured response in JSON format exactly as below. Do not add any other text:

{
  "possible_conditions": ["Condition 1", "Condition 2", "Condition 3"],
  "urgency": "low|medium|high",
  "recommended_action": "Suggest home care|Schedule a teleconsultation|Seek immediate care",
  "general_advice": "Brief advice until the user can see a doctor",
  "disclaimer": "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI service");
    }

    let result: SymptomAnalysis;
    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      result = {
        possible_conditions: ["Could not analyze"],
        urgency: "medium",
        recommended_action: "Please describe your symptoms in more detail.",
        general_advice: "Contact a healthcare provider for assistance.",
        disclaimer:
          "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.",
      };
    }

    return { success: true, analysis: result };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      message: "AI service is temporarily unavailable. Please try again later.",
    };
  }
};

// ----------------- Ask Health Question -----------------
export const askHealthQuestion = async (
  question: string
): Promise<{ success: boolean; answer?: string; message?: string }> => {
  try {
    const prompt = `
You are a friendly and helpful AI health assistant for the e-Sehat Nabha app. 
You provide general health information, wellness tips, and basic medical knowledge.
IMPORTANT: You MUST include a disclaimer that you are not a substitute for a doctor.

User Question: "${question}"

Provide a helpful, concise response in plain text. Always end with the disclaimer: "Remember, I am an AI and not a medical doctor. For personal medical advice, please consult a healthcare professional."
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = response.choices[0]?.message?.content ?? undefined;

    return { success: true, answer: aiResponse };
;
  } catch (error: any) {
    console.error("OpenAI Chat Error:", error);
    return {
      success: false,
      message:
        "I am having trouble responding right now. Please try again later or contact a doctor for urgent matters.",
    };
  }
};