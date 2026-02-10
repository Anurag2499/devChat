const socket = require('socket.io');
const Chat = require('../models/chat');

const initializeSocket = (server) => {
  const io = socket(server, {
    //this is the configuration object for the socket connection. It will allow the cross-origin requests from the client side application.
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  const onlineUsers = new Map();

  //this is the event listener for the socket connection. It will listen for the events emitted by the client side application.
  console.log('Socket initialized' + socket);
  io.on('connection', (socket) => {
    //this event will be emitted by the client side application when the user joins the chat.
    socket.on('join', ({ userId }) => {
      socket.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys())); //emit the list of online users to all the connected clients
      console.log('User connected with id:', userId);
    });
    socket.on('joinChat', ({ username, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join('_'); //create a unique room id for the two users
      console.log(username, 'joined room:', roomId);
      socket.join(roomId);
    });
    socket.on(
      'sendMessage',
      async ({ userName, userImg, userId, targetUserId, text }) => {
        //save the message in the database
        try {
          const roomId = [userId, targetUserId].sort().join('_'); //create a unique room id for the two users
          console.log(userName, ' sends ', text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit('receiveMessage', {
            userName,
            userImg,
            loggedInUserId: userId,
            text,
          }); //emit the message to the room}
        } catch (err) {
          console.log('Error in sending message:', err.message);
        }
      },
    );

    socket.on('disconnect', () => {
      const userId = socket.userId;
      if (userId && onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log('User disconnected with id:', userId);
    });
  });
};

module.exports = { initializeSocket };
