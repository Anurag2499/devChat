const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();

app.use(express.json());

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
