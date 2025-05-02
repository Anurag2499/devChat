const express = require('express');
const ConnectionRequest = require('../models/connectionRequest'); //importing the connection request model
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/users');

requestRouter.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId; //the user id to whom the request is sent
      const fromUserId = req.user._id; //the user id who is sending the request
      const status = req.params.status; //the status of the request

      const allowedStatus = ['ignored', 'interested'];
      const isStatusValid = allowedStatus.includes(status); //check if the status is valid or not ;

      if (!isStatusValid) {
        return res.status(400).send('Invalid status type - ' + status);
      }

      //check if the connection request already exists or not
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send('Connection request already exists.');
      }

      //check if the toUser exists or not in the User model
      const toUser = await User.findOne({
        _id: toUserId,
      });
      if (!toUser) {
        return res.status(400).send({
          message: 'User not found',
        });
      }
      //Save the connection request in the database
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save(); //save the connection request in the database
      res.status(200).json({
        message: `Connection request sent successfully - ${status}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send('Error-' + err);
    }
  }
);

module.exports = requestRouter;
