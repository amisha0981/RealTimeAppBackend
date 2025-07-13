const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require("mongoose");
const noteRoutes = require('./Routes/noteRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.use('/api', noteRoutes);
app.use(express.urlencoded({ extended: true }));


io.on('connection', (socket) => {
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

app.listen(port,function () {
  console.log(`server is running on port ${port} `);
});

