// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from '../types';

// 1. Initialize with a check to ensure the key exists
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing! Check your .env.local file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateChatSummary = async (messages: Message[], question?: string) => {
  // 2. Format context for the model
  const context = messages
    .filter((m) => !m.isSystem)
    .map((m) => `[${m.date.toISOString()}] ${m.author}: ${m.content}`)
    .join('\n');

  // 3. Fix: Use specific model alias to avoid 404
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const systemPrompt = `
    Analyze this WhatsApp chat. Provide a detailed summary, identify the overall tone, and list the top 3-5 key topics.
    Return ONLY a JSON object:
    {
      "summary": "...",
      "tone": "...",
      "keyTopics": ["...", "..."]
    }
  `;

  const prompt = question 
    ? `${systemPrompt}\n\nContext:\n${context}\n\nUser Question: ${question}` 
    : `${systemPrompt}\n\nContext:\n${context}`;

  try {
    // 4. Fix: Use the structured 'contents' syntax required by newer SDK versions
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return {
      summary: parsedData.summary || "No summary available.",
      tone: parsedData.tone || "Neutral",
      keyTopics: parsedData.keyTopics || [],
    };
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", error);
    
    // Check for specific common issues in the console
    if (error.status === 403) {
      return { summary: "Error: API Key rejected. Ensure 'Generative Language API' is enabled in Cloud Console.", tone: "N/A", keyTopics: [] };
    }
    
    return {
      summary: "Error generating analysis. Please check your network and API key status.",
      tone: "Unknown",
      keyTopics: [],
    };
  }
};