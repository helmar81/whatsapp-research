import { GoogleGenerativeAI } from '@google/generative-ai';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
export const generateChatSummary = async (messages, question) => {
    const context = messages
        .filter((m) => !m.isSystem)
        .map((m) => `[${m.date.toISOString()}] ${m.author}: ${m.content}`)
        .join('\n');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = question ? `${context}\n\n${question}` : context;
    const result = await model.generateContent([prompt]);
    return {
        summary: result.response.text(),
        tone: 'Neutral', // Replace with actual tone analysis if available
        keyTopics: ['Example Topic 1', 'Example Topic 2'], // Replace with actual topics if available
    };
};
