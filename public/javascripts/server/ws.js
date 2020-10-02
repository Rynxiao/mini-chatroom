var socketIo = require('socket.io');
const chatRoom = require('./chatroom');

function setupWebsocketServer(httpServer) {
  var io = socketIo(httpServer);

  io.on('connection', (socket) => {
    socket.on('register', function(connector) {
      chatRoom.onConnect(connector);

      io.emit('register done');

      var data = chatRoom.getDatas();
      io.emit('data', { data });
    });

    socket.on('chat', function(message) {
      chatRoom.receive(message);

      var data = chatRoom.getDatas();
      io.emit('data', { data });
    });
  });
}

module.exports = setupWebsocketServer;
