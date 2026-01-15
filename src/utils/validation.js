const validator = require('validator');

const validateSignUpData = (req) => {
  console.log('inside validation');
  const { firstName, lastName, emailId, password, age } = req.body;

  //any empty value
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error('All fields are required');
  }
  //if name length is less than 4 or more than 20
  else if (firstName.length < 3 || firstName.length > 20) {
    throw new Error('First name should be between 4 to 20 characters');
  }
  //if name length is less than 4 or more than 20
  else if (lastName.length < 2 || lastName.length > 20) {
    throw new Error('Last name should be between 4 to 20 characters');
  }
  //if ageis less than 18 or more than 35
  // else if (age.length < 18 || age.length > 40) {
  //   throw new Error('Age should be greater than 18! You Kiddoo');
  // }
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
