const express = require('express');
const User = require('../models/users'); // Import the User model
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

//post user data in database
authRouter.post('/signup', async (req, res) => {
  try {
    //Validating the data
    console.log('inside try');
    validateSignUpData(req);

    //Encrpting the data
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //Creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('Unable to save to database: ' + err);
  }
});

//login the user
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User not found');
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password)
    const isPasswordValid = await user.validatePassword(password); // this is the mongoose method to validate the password.

    //checkin wheather the password is valid or not.
    if (isPasswordValid) {
      //generate token
      const token = await user.getJWT(); //this is the mongoose method to create the token.
      console.log(token);

      //Add the token to the cookie and send the response back to the user.
      res.cookie('token', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
      res.send('User logged in successfully');
    } else {
      throw new Error('Invalid password');
    }
  } catch (err) {
    res.status(400).send('Error' + err);
  }
});

//Logout the user
authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.send('User logged out successfully');
});

module.exports = authRouter;
