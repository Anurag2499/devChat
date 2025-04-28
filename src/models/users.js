const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Created a new user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
    },
    lastName: {
      type: String,
      minlength: 4,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length of 6 characters
    },
    age: {
      type: Number,
      min: 18, // Minimum age required
      max: 60, // Age cannot be greater than 60
    },
    gender: {
      type: String,
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: 'This is the default about of the user.',
    },
    photoUrl: {
      type: String,
      default:
        'https://media.licdn.com/media/AAYQAQSOAAgAAQAAAAAAAB-zrMZEDXI2T62PSuT6kpB6qg.png',
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'DEV@Chat$786', {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  );
  return isPasswordValid;
};

//Created a new user model
const User = mongoose.model('User', userSchema);

module.exports = User;
