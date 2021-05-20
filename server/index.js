const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
   path: '/api/',
   cors: {
     origin: '*'
   }
});

const PORT = process.env.PORT || 5000;
const registerMessageHandlers = require('./handlers/messageHandlers');
const registerUserHandlers = require('./handlers/userHandlers');

const onConnection = (socket) => {
  console.log('User connected');

  const {
    roomId
  } = socket.handshake.query;
  socket.roomId = roomId;

  socket.join(roomId);

  registerMessageHandlers(io, socket);
  registerUserHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.leave(roomId);
  });
}

io.on('connection', onConnection);

app.use("/", express.static((__dirname, '../client/build')));

server.listen(PORT, () => {
  console.log(`Server ready. Port: ${PORT}`);
});
