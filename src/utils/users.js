let users = [];
const addUser = ({ id, username, room }) => {
  if (!username || !room)
    return { error: "Username and Room is required" };
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  let user = users.find((element) => element.room === room && element.username === username);
  if (user) {
    return { error: "Username already in use" };
  }
  user = { id, username, room }
  users.push(user);
  return { user };
}
const removeUser = (id) => {
  let index = users.findIndex((element) => element.id === id)
  if (index != -1)
    return users.splice(index, 1)[0];
}
const getUserList = (room) => {
  let user_list = users.filter((element) => element.room === room);
  if (user_list.length >= 0)
    return user_list;
}
const getUser = (id) => {
  return users.find((element) => id === element.id);
}
module.exports = {
  addUser, removeUser, getUserList, getUser
}