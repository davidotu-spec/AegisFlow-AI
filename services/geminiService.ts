
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private getAI() {
    // Guidelines: Always use process.env.GEMINI_API_KEY for the Gemini API.
    // We use a defensive check for the process object which is shimmed in index.html
    const env = (window as any).process?.env || {};
    const apiKey = env.GEMINI_API_KEY || env.API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API Key is missing. Please check your configuration in the Settings menu.");
    }
    
    return new GoogleGenAI({ apiKey: apiKey || "" });
  }

  async queryCloudAssistant(query: string, context: any) {
    try {
      const ai = this.getAI();
      
      // Guidelines: Use gemini-3.1-pro-preview for complex reasoning tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [{ parts: [{ text: `User Query: ${query}\n\nContext about the cloud environment: ${JSON.stringify(context)}` }] }],
        config: {
          systemInstruction: "You are Mixxd FinOps AI, an elite Cloud Architect, FinOps Specialist, and SecOps Engineer. Your goal is to help users manage their multi-cloud environment (AWS, Azure, GCP). Provide technical, concise, and actionable advice. If asked about spend, refer to the provided context. If asked to fix something, explain the 'Agentic' step you would take autonomously.",
          temperature: 0.7,
        },
      });

      // Guidelines: Access the .text property directly
      return response.text || "I'm sorry, I couldn't process that query. Please try again.";
    } catch (error: any) {
      console.error("Gemini Query Error:", error);
      
      const errorMessage = error?.message || "";
      
      if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        return "Invalid or missing API key. Please ensure you have configured your Gemini API key in the Settings menu of AI Studio.";
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        return "AI service quota exceeded. Please try again in a few minutes.";
      }
      
      return "An error occurred while communicating with the AI. Please check your network connection and try again.";
    }
  }
}

export const geminiService = new GeminiService();
