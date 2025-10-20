
import { GoogleGenAI } from "@google/genai";

// The API key is provided by the environment, but the functions below have been
// disabled to prevent quota errors.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSurahSummary = async (surahName: string): Promise<string> => {
  console.error("Error generating Surah summary: Quota exceeded. This feature has been disabled.");
  return "Could not generate summary at this time.";
};

export const generateAnimeSynopsis = async (title: string): Promise<string> => {
  console.error("Error generating anime synopsis: Quota exceeded. This feature has been disabled.");
  return "A thrilling adventure awaits in this new series!";
};
