//connection
const socket = io();

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormButton = $messageForm.querySelector('button');
const $messageFormInput = $messageForm.querySelector('input');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar');

//templates
const messagetemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//get user and room
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  let message = $messageFormInput.value;
  socket.emit('sendMessage', message, (acknowledgement) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    console.log(acknowledgement);
  });
})
$locationButton.addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Location is not supported in your browser');
  $locationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', { lattitude: position.coords.latitude, longitude: position.coords.longitude }, (confirmation) => {
      $locationButton.removeAttribute('disabled');
      console.log(confirmation);
    })
  });

})
socket.on('message', (details) => {
  if (!details.username && !details.createdAt) {
    alert('room is not found');
    location.href = '/';
  }
  let html = Mustache.render(messagetemplate, {
    message: details.message,
    username: details.username,
    createdAt: moment(details.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML("beforeend", html);
})
socket.on('location-message', (details) => {
  console.log()
  let html = Mustache.render(locationTemplate, {
    username: details.username,
    createAt: moment(details.createAt).format('h:mm a'),
    message: details.message
  })
  $messages.insertAdjacentHTML("beforeend", html);
})
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
socket.on('roomData', ({ room, users }) => {
  let html = Mustache.render(sidebarTemplate, { room, users });
  $sidebar.innerHTML = html;
})