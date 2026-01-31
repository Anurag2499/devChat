const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');

app.options(
  '*',
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use(
  cors({
    origin: 'http://localhost:5173', //this is the origin of the client side application.
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, //this will allow the cookies to be sent from the client side application.
    optionSuccessStatus: 200,
  }),
); //it will allow the cross-origin requests.

app.use(express.json()); //it will convert the req.body into the json object.
app.use(cookieParser());

app.use('/', authRouter); //authRouter will handle all the routes which are starting with /auth
app.use('/', profileRouter); //profileRouter will handle all the routes which are starting with /profile
app.use('/', requestRouter); //requestRouter will handle all the routes which are starting with /request
app.use('/', userRouter); //userRouter will handle all the routes which are starting with /user

// console.log('Connecting to database...' + process.env.PORT);
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    //app will be listened at port 7777.
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error');
  });
