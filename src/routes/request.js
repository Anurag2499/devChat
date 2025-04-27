const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post('/getConnectionRequest', userAuth, async (req, res) => {
  try {
    console.log('inside getConnectionRequest');

    res.send('Connection request sent successfully');
  } catch (err) {
    res.status(400).send('Error-' + err);
  }
});

module.exports = requestRouter;
