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
      minlength: 4,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length of 8 characters
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must be at least 8 characters long, include a letter, a number, and a special character.',
      ],
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
  },
  { timestamps: true }
);

//Created a new user model
const User = mongoose.model('User', userSchema);

module.exports = User;
