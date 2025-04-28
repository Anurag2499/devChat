const validator = require('validator');

const validateSignUpData = (req) => {
  console.log('inside validation');
  const { firstName, lastName, emailId, password } = req.body;

  //any empty value
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error('All fields are required');
  }
  //if name length is less than 4 or more than 20
  else if (firstName.length < 4 || firstName.length > 20) {
    throw new Error('First name should be between 4 to 20 characters');
  }
  //check if email is in correct format
  else if (!validator.isEmail(emailId)) {
    throw new Error('Invalid email.');
  }
  //check if password is strong
  // else if (!validator.isStrongPassword(password)) {
  //   throw new Error('Password should be strong');
  // }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
