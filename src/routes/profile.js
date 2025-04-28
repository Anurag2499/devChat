const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/users'); //importing the user model

// In this we have added userAuth middleware to protect the route
profileRouter.get('/profile/view', userAuth, async (req, res) => {
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

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid field in request body');
    }

    const loggedInUser = req.user; //the old user which is logged In  {req.user};  // the new data is inside {req.data};
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save(); //save the updated user in the database

    res.json({
      message: `${loggedInUser.firstName}, profile updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send('Error ' + err);
  }
});

profileRouter.patch('/profile/change-password', userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword); //this is the mongoose method to validate the password.

    if (!isOldPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new Error('New password should be different from old password');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash; //updating the password in the database
    await loggedInUser.save(); //save the updated user in the database
    res.json({
      message: `${loggedInUser.firstName}, password updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send('Error ' + err);
  }
});

module.exports = profileRouter;
