import { GoogleGenAI } from "@google/genai";

export const SECRET_CODE = "198473zebra";

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const genAI = new GoogleGenAI({ apiKey });
  return genAI.models.generateContent.bind(genAI.models);
};

export interface Message {
  role: "user" | "model";
  text: string;
}

export interface User {
  id?: string;
  name: string;
  email?: string;
  picture?: string;
  isGuest?: boolean;
}
