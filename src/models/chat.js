const mongoose = require('mongoose'); //importing mongoose to create a new schema for chat

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ],
  messages: [messageSchema],
});

const Chat = new mongoose.model('Chat', chatSchema); //creating a new model for chat

module.exports = Chat; //exporting the chat model to use it in other files
