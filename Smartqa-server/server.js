// Smartqa-server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const roomRoutes = require('./src/routes/roomRoutes');
const authRoutes = require('./src/routes/authRoutes'); // Import auth routes

const app = express(); // Create instance of express to setup the server

// Middlewares
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Error connecting to DB', error));

const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true
};
app.use(cors(corsConfig));

const OurServer = http.createServer(app);

const io = new Server(OurServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "DELETE", "UPDATE"]
    }
});

io.on("connection", (socket) => {
    console.log('New Client connection: ', socket.id);

    socket.on("join-room", (roomCode) => {
        socket.join(roomCode);
        console.log(`User ${socket.id} joined room: ${roomCode}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnection: ", socket.id);
    });
});

app.set("io",io);

// API Routes
app.use('/api/auth', authRoutes); // Add auth routes
app.use('/api/room', roomRoutes); // Prefix room routes with /api

// Start the server
const PORT = process.env.PORT || 8080;
OurServer.listen(PORT, (error) => {
    if (error) {
        console.log('Server not started due to: ', error);
    } else {
        console.log(`Server running at port: ${PORT}`)
    }
});
