
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      console.error("API_KEY is missing from environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY || "" });
  }

  async queryCloudAssistant(query: string, context: any) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Query: ${query}\n\nContext about the cloud environment: ${JSON.stringify(context)}`,
        config: {
          systemInstruction: "You are AegisFlow AI, an elite Cloud Architect, FinOps Specialist, and SecOps Engineer. Your goal is to help users manage their multi-cloud environment (AWS, Azure, GCP). Provide technical, concise, and actionable advice. If asked about spend, refer to the provided context. If asked to fix something, explain the 'Agentic' step you would take autonomously.",
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that query. Please try again.";
    } catch (error) {
      console.error("Gemini Query Error:", error);
      return "An error occurred while communicating with the AI. Please check your configuration.";
    }
  }
}

export const geminiService = new GeminiService();
