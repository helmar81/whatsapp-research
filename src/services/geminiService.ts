// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateChatSummary = async (messages: Message[], question?: string) => {
  // 1. WINDOWING: Only analyze the last 500 messages to prevent crashes
  // This keeps the payload size safe while maintaining current context.
  const relevantMessages = messages.slice(-500);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); 

  const context = relevantMessages
    .filter((m) => !m.isSystem)
    .map((m) => `[${m.date.toISOString()}] ${m.author}: ${m.content}`)
    .join('\n');

  // 2. SAFETY TRUNCATION: Ensure the string itself isn't too large for memory
  const safeContext = context.length > 40000 ? context.substring(0, 40000) : context;

  const systemPrompt = `
    Analyze this WhatsApp chat. Return ONLY a JSON object:
    {"summary": "...", "tone": "...", "keyTopics": ["...", "..."]}
  `;

  const prompt = question 
    ? `${systemPrompt}\n\nContext:\n${safeContext}\n\nUser Question: ${question}` 
    : `${systemPrompt}\n\nContext:\n${safeContext}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.response.text());
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { 
      summary: "Error: Chat too large or API disconnected. Try asking about a specific topic.", 
      tone: "Error", 
      keyTopics: [] 
    };
  }
};