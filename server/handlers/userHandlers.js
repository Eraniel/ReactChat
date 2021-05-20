//можно тоже сделать бд для юзеров
const users = {
  1: { username: 'Romana', online: false },
  2: { username: 'Bohdan', online: false }
}

module.exports = (io, socket) => {

  const getUsers = () => {
    //румИд распределяем потому что оно нужно и для сообщений и для юзеров
    io.in(socket.roomId).emit('users', users);
  }

    //добавляем новых пользователей с юзернеймом и ид.
  const addUser = ({ username, userId }) => {
    //если пользователя нет в БД - добавляем, если есть - становится онлайн
    if (!users[userId]) {
      users[userId] = { username, online: true };
    } else {
      users[userId].online = true;
    }
    getUsers();
  }

  //отправляем юзеров в оффлайн по ид
  const removeUser = (userId) => {
    users[userId].online = false;
    getUsers();
  }

  //обработчики готовы!
  socket.on('user:get', getUsers);
  socket.on('user:add', addUser);
  socket.on('user:leave', removeUser);
}
