const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/users');
const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
  console.log(req.body);
  // const user = new User({
  //   firstName: 'Anurag',
  //   lastName: 'Dangi',
  //   emailId: 'anurag@gmail.com',
  //   age: 26,
  //   gender: 'male',
  // });
  // await user.save();
  // res.send('User created successfully');
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
