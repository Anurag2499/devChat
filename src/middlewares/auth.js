const jwt = require('jsonwebtoken');
const User = require('../models/users');

const userAuth = async (req, res, next) => {
  try {
    //fetch the token from the request header
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error('Token not found');
    }

    const decodedObj = await jwt.verify(token, 'DEV@Chat$786');
    const { _id } = decodedObj;
    console.log(_id);
    //find the user in the database using the id from the token

    const user = await User.findById({ _id });
    console.log(user);
    if (!user) {
      throw new Error('User not found by the id.. in the token');
    }
    req.user = user; //attach the user to the request object
    next(); //call the next middleware function
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
};

module.exports = { userAuth };
