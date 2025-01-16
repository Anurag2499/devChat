const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();

app.use(express.json()); //it will convert the req.body into the json object.

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
app.patch('/user', async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
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
    app.listen(7777, () => {
      console.log('listening on port 7777');
    });
  })
  .catch((err) => {
    console.error('Database connection error');
  });
