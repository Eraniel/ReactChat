const { nanoid } = require('nanoid'); //генерация идентификаторов

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// БД хранится в директории "db" под названием "messages.json"
const adapter = new FileSync('db/messages.json');
const db = low(adapter);

db.defaults({
  messages: [{
      messageId: '1',
      userId: '1',
      senderName: 'Bohdan',
      messageText: 'Hi, Romana!',
      createdAt: '2021-05-18'
    },
    {
      messageId: '2',
      userId: '2',
      senderName: 'Romana',
      messageText: 'Hello, Bohdan!',
      createdAt: '2021-05-19'
    }
  ]
}).write();

module.exports = (io, socket) => {
  //обработка получения сообщений
  const getMessages = () => {
    //берём сообщения из дб
    const messages = db.get('messages').value();
    //раздаём сообщения всем пользователям в комнате
    io.in(socket.roomId).emit('messages', messages);
  }

  //добавляем сообщения
  const addMessage = (message) => {
    db.get('messages')
      .push({
        messageId: nanoid(8),//генерация 8-значного ид
        createdAt: new Date(),
        ...message
      }).write();
      //запрашиваем сообщения чтобы они отображались
    getMessages();
  }

  //удаляем сообщения по ид
  const removeMessage = (messageId) => {
    db.get('messages').remove({
      messageId
    }).write();
    getMessages();
  }
  //обработчики действий готовы!
  socket.on('message:get', getMessages);
  socket.on('message:add', addMessage);
  socket.on('message:remove', removeMessage);
}
