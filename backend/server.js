// import "dotenv/config";   // <-- REQUIRED
// import Groq from "groq-sdk";

// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const response = await client.chat.completions.create({
//   model: "llama-3.1-8b-instant",
//   messages: [
//     { role: "user", content: "difference between sql and no sql" }
//   ]
// });

// console.log(response.choices[0].message.content);

import express from "express";
import "dotenv/config";
import cors from "cors";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());


// Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with database");
  }catch(err){
    console.log("Failed to connect withdatabase",err);
  }
}

app.use("/api", chatRoutes);



// /test POST endpoint (dynamic reply + console log + res.send)
// app.post("/test", async (req, res) => {
//   try {
//     const userMessage = req.body.message;
//     if (!userMessage) {
//       return res.send("Please provide 'message' in request body.");
//     }

//     const completion = await client.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: userMessage },
//       ],
//     });

//     const reply = completion.choices[0].message.content;

//     // Log reply on server console
//     // console.log("Assistant reply:", reply);

//     // Send response as plain text
//     res.send(reply);

//   } catch (err) {
//     console.error(err);
//     if (!res.headersSent) {
//       res.send("Internal server error");
//     }
//   }
// });
