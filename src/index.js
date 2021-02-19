const badwords = require('bad-words');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { addUser, removeUser, getUser, getUserList } = require('./utils/users');
const messages = require('./utils/messages');
const server = http.createServer(app);
const io = socketio(server);
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory))
io.on('connection', (socket) => {
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error)
      return callback(error);
    socket.join(user.room);
    socket.emit('message', messages("Admin", "welcome!"));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUserList(user.room)
    })
    socket.broadcast.to(user.room).emit('message', messages("Admin", `${user.username} has Joined`));
  })
  socket.on('sendMessage', (message, callback) => {
    let user = getUser(socket.id);
    let filter = new badwords();
    if (filter.isProfane(message)) {
      return callback("Bad words");
    }
    io.to(user.room).emit('message', messages(user.username, message));
    callback("Delivered");
  })
  socket.on('disconnect', () => {
    let user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', messages("Admin", `${user.username} has left`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUserList(user.room)
      })
    }
  })
  socket.on('sendLocation', ({ lattitude, longitude }, callback) => {
    let user = getUser(socket.id);
    io.to(user.room).emit('location-message', messages(user.username, `http://google.com/maps?q=${lattitude},${longitude}`));
    callback("Location Shared");
  })
})

server.listen(port, () => {
  console.log("server started on port " + port);
})