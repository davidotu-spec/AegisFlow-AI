
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Always use the named parameter and direct reference to process.env.API_KEY as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async queryCloudAssistant(query: string, context: any) {
    try {
      // Fix: Use gemini-3-pro-preview for complex reasoning tasks (FinOps/Cloud Architecture)
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `User Query: ${query}\n\nContext about the cloud environment: ${JSON.stringify(context)}`,
        config: {
          systemInstruction: "You are Mixxd FinOps AI, an elite Cloud Architect, FinOps Specialist, and SecOps Engineer. Your goal is to help users manage their multi-cloud environment (AWS, Azure, GCP). Provide technical, concise, and actionable advice. If asked about spend, refer to the provided context. If asked to fix something, explain the 'Agentic' step you would take autonomously.",
          temperature: 0.7,
        },
      });

      // Fix: Access the .text property directly as it is a getter, not a method
      return response.text || "I'm sorry, I couldn't process that query. Please try again.";
    } catch (error) {
      console.error("Gemini Query Error:", error);
      return "An error occurred while communicating with the AI. Please check your configuration.";
    }
  }
}

export const geminiService = new GeminiService();
