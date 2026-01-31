const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();
//Created a new user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // minlength: 4,
    },
    lastName: {
      type: String,
      // minlength: 4,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
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
      // min: 18, // Minimum age required
      // max: 60, // Age cannot be greater than 60
    },
    gender: {
      type: String,
      // enum: {
      //   values: ['Male', 'Female', 'Other'],
      //   message: '{VALUE} is not a valid gender type.',
      // },
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
        'https://png.pngtree.com/png-vector/20240121/ourmid/pngtree-a-school-boy-white-background-png-image_11510916.png',
    },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword,
  );
  return isPasswordValid;
};

//Created a new user model
const User = mongoose.model('User', userSchema);

module.exports = User;
