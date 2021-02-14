const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);
const publicDirectory = path.join(__dirname, '../public');
let count = 0;

app.use(express.static(publicDirectory))
io.on('connection', (socket) => {
  console.log("A new User has connected");
  socket.emit('newConnection', "welcome!");
  socket.broadcast.emit('NewUser');
  socket.on('message', (message) => {
    io.emit('message', message);
  })
  socket.on('disconnect', () => {
    io.emit('UserLeaves')
  })
  socket.on('location', ({ lattitude, longitude }) => {
    socket.broadcast.emit('message', `http://google.com/maps?q=${lattitude},${longitude}`);
  })
})

server.listen(port, () => {
  console.log("server started on port " + port);
})