import express from "express";
import { chats } from "./data/data.js";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


const app = express();
dotenv.config();
connectDB();
app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
    res.send("API is running...");
});


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});