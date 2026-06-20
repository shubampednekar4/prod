import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateSQL = async (
  systemPrompt,
  userQuery
) => {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

  const rawResponse =
    response.text ||
    response.candidates?.[0]
      ?.content?.parts?.[0]?.text;

  if (!rawResponse) {
    throw new Error(
      "Gemini returned empty response"
    );
  }

  return JSON.parse(rawResponse);
};