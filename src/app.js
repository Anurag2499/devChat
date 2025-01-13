const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();

app.use(express.json());

//post user data in database
app.post('/signup', async (req, res) => {
  console.log(req.body);

  //Creating a new instance of User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('Unable to save to database: ' + err);
  }
});

//Get user data using emailId
app.get('/user', async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    console.log(userEmail);
    const users = await User.findOne({ emailId: userEmail });
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

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
      console.log('listening on port 7777');
    });
  })
  .catch((err) => {
    console.error('Database connection error');
  });
