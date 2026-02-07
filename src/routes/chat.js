const express = require('express');
const Chat = require('../models/chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate('participants', 'firstName photoUrl')
      .populate('messages.senderId', 'firstName photoUrl');

    //populate the participants field with the username and profile image of the users

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(400).send('Error' + err);
  }
});

module.exports = chatRouter;
