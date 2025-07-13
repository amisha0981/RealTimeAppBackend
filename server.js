const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const noteRoutes = require('./Routes/noteRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling'],
    allowEIO3: true 
  },
  pingTimeout: 60000, 
  pingInterval: 25000
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', noteRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('join-note', (noteId) => {
    socket.join(noteId);
    socket.broadcast.to(noteId).emit('active-users', { users: Object.keys(io.sockets.adapter.rooms.get(noteId) || {}) });
  });
  socket.on('note-update', ({ noteId, content }) => {
    io.to(noteId).emit('note-update', { content });
  });
  socket.on('leave-note', (noteId) => {
    socket.leave(noteId);
    socket.broadcast.to(noteId).emit('active-users', { users: Object.keys(io.sockets.adapter.rooms.get(noteId) || {}) });
  });
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });
});

app.get("/", (req, res) => {
  res.send("hello world i am here to help you!!");
});

mongoose.connect(process.env.DB).then(() => {
  console.log("mongodb is connected!!");
}).catch((error) => {
  console.log(error);
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});