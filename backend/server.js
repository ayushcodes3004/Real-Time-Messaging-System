import express from "express";
import { chats } from "./data/data.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();    


app.get("/", (req,res)=>{
    res.send("API is running...");
});

app.get("/api/chat", (req,res)=>{
    res.send(chats);
});

app.get("/api/chat/:id", (req,res)=>{
    const chat = chats.find((c) => c._id === req.params.id);
    res.send(chat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});