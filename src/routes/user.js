const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/users');
const userRouter = express.Router();
const USER_SAFEDATA = 'firstName lastName photoUrl age gender about skills';

//route to get all the requests received by the loggedIn user
userRouter.get('/user/requests/review', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFEDATA);

    const data = connectionRequest.map((request) => request.fromUserId);

    res.json({
      message: 'Data fetched successfully',
      data: data,
    });
  } catch (err) {
    return res.status(400).send('Error: ' + err.message);
  }
});

//route to get all the connections of the loggedIn user
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFEDATA)
      .populate('toUserId', USER_SAFEDATA);

    console.log('connectionRequests', connectionRequests);

    //  IMP logic to get the connections of the loggedIn user
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return res.json({
      message: 'All the connections of ' + loggedInUser.firstName,
      data: data,
    });
  } catch (err) {
    return res.status(400).send('Error: ' + err.message);
  }
});

//Route to get the users in the feed
userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Limit the number of users to 50
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFEDATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: 'All the users in the feed',
      data: user,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = userRouter;
