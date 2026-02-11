import express from "express";
import { chats } from "./data/data.js";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";

const app = express();
dotenv.config();

// Enable CORS for development
if (process.env.NODE_ENV === "development") {
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }));
} else {
    app.use(cors({
        origin: process.env.RENDER_EXTERNAL_URL || "https://chatterbox-4r53.onrender.com",
        credentials: true
    }));
}

connectDB();
app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//----------Deployment------------------

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    // Serve frontend files from the correct path in production
    const distPath = path.join(process.cwd(), "frontend", "dist");
    app.use(express.static(distPath));

    app.get(/\/(?!api|socket.io).*$/, (req, res) => {
        // This regex matches any route that doesn't start with /api or /socket.io
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });

    // In development, don't register catch-all route for frontend files
    // since they don't exist until built
}


//----------Deployment------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.NODE_ENV === "production" ? process.env.RENDER_EXTERNAL_URL || "https://chatterbox-4r53.onrender.com" : ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});