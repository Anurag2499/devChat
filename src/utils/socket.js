const socket = require('socket.io');
const Chat = require('../models/chat');

const initializeSocket = (server) => {
  const io = socket(server, {
    //this is the configuration object for the socket connection. It will allow the cross-origin requests from the client side application.
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  //this is the event listener for the socket connection. It will listen for the events emitted by the client side application.
  io.on('connection', (socket) => {
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
    socket.on('disconnect', () => {});
  });
};

module.exports = { initializeSocket };
