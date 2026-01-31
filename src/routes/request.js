const express = require('express');
const ConnectionRequest = require('../models/connectionRequest'); //importing the connection request model
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/users');
const sendEmail = require('../utils/sendEmail');

requestRouter.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId; //the user id to whom the request is sent
      const fromUserId = req.user._id; //the user id who is sending the request
      const fromUser = req.user.firstName;
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
      //Save the connection resuest in the database
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save(); //save the connection request in the database
      console.log('Connection Request Data - ', data);
      const emailRes = await sendEmail.run(
        'A new connection request from ' + fromUser + '!',
        toUser.firstName +
          ', you have a new connection request on DevChat from ' +
          fromUser +
          '. Log in to your account to respond to the request.',
      );
      console.log('Email sent status - ', emailRes);

      res.status(200).json({
        message: `Connection request sent successfully - ${status}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send('Error-' + err);
    }
  },
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params; //get the status and requestId from the params

    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ messsage: 'Invalid status type - ' + status });
    }
    //loggedInUser means "toUserId" in the connectionRequest.
    //status will be interested always , if it is other than it will be ignored.
    //requestId will be the _id in the connectionRequest.

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });
    if (!connectionRequest) {
      return res.status(400).json({
        message: 'Connection request not found or already accepted/rejected',
      });
    }

    connectionRequest.status = status; //update the status of the connection request
    const data = await connectionRequest.save(); //save the connection request in the database
    res.status(200).json({
      message: `Connection request ${status} successfully`,
      data: data,
    });
  },
);

module.exports = requestRouter;
