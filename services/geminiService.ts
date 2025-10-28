
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSurahSummary = async (surahName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a brief, insightful summary of Surah ${surahName} from the Quran. Focus on its central themes and key messages.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating Surah summary:", error);
    throw new Error("Could not generate summary. Please check API configuration or quota.");
  }
};

export const generateAnimeSynopsis = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a brief, exciting, and compelling synopsis for an anime series titled "${title}". Focus on the main plot points and characters to entice potential viewers.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating anime synopsis:", error);
    throw new Error("Could not generate synopsis. Please check API configuration or quota.");
  }
};
