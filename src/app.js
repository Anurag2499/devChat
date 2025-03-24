const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json()); //it will convert the req.body into the json object.

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send('User logged in successfully');
    } else {
      throw new Error('Invalid password');
    }
  } catch (err) {
    res.status(400).send('Error' + err);
  }
});

//Get user data using emailId
// app.get('/user', async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     console.log(userEmail);
//     const users = await User.findOne({ emailId: userEmail });
//     console.log(users);
//     if (users.length === 0) {
//       res.send('No user found');
//     }
//     res.send(users);
//   } catch (err) {
//     res.status(400).send('Something went wrong');
//   }
// });

// GET /user by id
app.get('/user', async (req, res) => {
  try {
    const userID = req.body._id;
    console.log(userID);
    const users = await User.findById({ _id: userID });
    console.log(users);
    if (users.length === 0) {
      res.send('No user found');
    }
    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

//Feed API - GET /feed - get all the users from database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

//Delete API
app.delete('/user', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (userId) {
      await User.findByIdAndDelete(userId);
      res.send('User deleted successfully');
    } else {
      res.send('User not found');
    }
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

// Update API (Patch)
app.patch('/user/:userId', async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_FIELDS = ['password', 'age', 'about', 'gender', 'skills'];

    const isUpdatedAllowed = Object.keys(data).every((field) =>
      ALLOWED_FIELDS.includes(field)
    );
    if (!isUpdatedAllowed) {
      // res.status(400).send('Invalid fields to update');
      throw new Error('Invalid fields to update');
    }

    console.log(data);
    if (userId) {
      const userdata = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: 'before',
      });
      console.log(userdata);
      res.send('User updated successfully');
    } else {
      res.send('User not found');
    }
  } catch (err) {
    res.status(400).send('Something went wrong: ' + err.message);
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
