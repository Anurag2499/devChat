const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');

// In this we have added userAuth middleware to protect the route
profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user; //user is attached to the request object in the userAuth middleware
    if (!user) {
      throw new Error('User not found');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send('Error' + err);
  }
});

module.exports = profileRouter;
