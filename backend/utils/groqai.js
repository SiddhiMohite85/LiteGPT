import "dotenv/config";
import Groq from "groq-sdk";

// Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getGroqAIAPIResponse = async (message) => {
  try {
    if (!message) {
      throw new Error("Please provide a message");
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // Log reply on server console
    // console.log("Assistant reply:", reply);

    // Return reply to server
    return reply;

  } catch (err) {
    console.error("Error fetching Groq reply:", err);
    throw err; // Caller handles the error
  }
};

export default getGroqAIAPIResponse;
