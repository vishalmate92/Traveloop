import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateTripSuggestions(destination: string, days: number, budget: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Plan a ${days}-day trip to ${destination} with a budget of $${budget}. 
      Return a JSON array of daily activities. Each day should have:
      - day: number
      - theme: string
      - activities: Array of { title: string, cost: number, description: string, category: string }
      Categories: adventure, food, culture, sightseeing, nightlife, nature.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
