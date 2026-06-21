import Groq from "groq-sdk";
import config from "../config/env.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

const groq = new Groq({
  apiKey: config.GROQ_API_KEY
});

export const generateSQL = async (systemPrompt, userQuery) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      temperature: 0,
      response_format: { type: "json_object" }, 
    });

    const rawResponse = response.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new AppError("The AI engine returned an empty response.", 502);
    }

    try {
      return JSON.parse(rawResponse);
    } catch (parseError) {
      logger.error(`Failed to parse Groq response JSON: ${rawResponse}`);
      throw new AppError("The AI generated an invalid data layout. Please try again.", 502);
    }

  } catch (error) {
    if (error instanceof AppError) throw error;

    logger.error("Groq API Execution Error:", error);
    
    throw new AppError("AI Query Engine is currently unavailable or timed out.", 503);
  }
};