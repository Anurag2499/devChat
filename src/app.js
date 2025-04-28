const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();

const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');

app.use(express.json()); //it will convert the req.body into the json object.
app.use(cookieParser());

app.use('/', authRouter); //authRouter will handle all the routes which are starting with /auth
app.use('/', profileRouter); //profileRouter will handle all the routes which are starting with /profile
app.use('/', requestRouter); //requestRouter will handle all the routes which are starting with /request

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
