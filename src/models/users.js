const mongoose = require('mongoose');

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
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
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
  },
  { timestamps: true }
);

//Created a new user model
const User = mongoose.model('User', userSchema);

module.exports = User;
