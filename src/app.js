const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json()); //it will convert the req.body into the json object.
// Use cookie-parser middleware
app.use(cookieParser());

//post user data in database
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User not found');
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password)
    const isPasswordValid = await user.validatePassword(password);

    //checkin wheather the password is valid or not.
    if (isPasswordValid) {
      //generate token
      const token = await user.getJWT();
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

// In this we have added userAuth middleware to protect the route
app.get('/profile', userAuth, async (req, res) => {
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

app.post('/getConnectionRequest', userAuth, async (req, res) => {
  try {
    console.log('inside getConnectionRequest');

    res.send('Connection request sent successfully');
  } catch (err) {
    res.status(400).send('Error-' + err);
  }
});

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    //app will be listened at port 7777.
    app.listen(7777, () => {
      console.log('listening on port 7777');
    });
  })
  .catch((err) => {
    console.error('Database connection error');
  });
