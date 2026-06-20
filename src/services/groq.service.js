import Groq from "groq-sdk";

// Initialize Groq with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateSQL = async (systemPrompt, userQuery) => {
  const response = await groq.chat.completions.create({
    // You can use llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.
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
    // This forces the model to return a valid JSON object
    response_format: { type: "json_object" }, 
  });

  const rawResponse = response.choices[0]?.message?.content;

  if (!rawResponse) {
    throw new Error("Groq returned an empty response");
  }

  // Parse and return the JSON object
  return JSON.parse(rawResponse);
};