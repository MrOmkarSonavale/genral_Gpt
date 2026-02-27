import OpenAI from "openai";


export const geminiClient = new OpenAI({
    apiKey: process.env.GEMINI_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

