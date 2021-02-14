const socket = io();
socket.on('newConnection', (message) => {
  console.log(message);
})
document.querySelector('#send-message').addEventListener('submit', (e) => {
  e.preventDefault();
  let message = document.querySelector('input').value;
  socket.emit('message', message);
})
document.getElementById('send-location').addEventListener('click', () => {
  if (!navigator.geolocation)
    alert('Location is not supported in your browser');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('location', { lattitude: position.coords.latitude, longitude: position.coords.longitude })
  });
})
socket.on('message', (message) => {
  console.log(message);
})
socket.on('NewUser', () => {
  console.log("A new user joined");
})
socket.on('UserLeaves', () => {
  console.log("A user has left");
})