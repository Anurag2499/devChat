const express = require('express');

const app = express();

app.use('/admin', (req, res, next) => {
  //Logic to check if the requesr is authorized
  const token = 'xyz';
  const isAuthorizedAdmin = token === 'xyz';
  if (!isAuthorizedAdmin) {
    res.status(401).send('You are not authorized to see this data');
  } else {
    next();
  }
});

app.get('/admin/getAlldata', (req, res) => {
  res.send('Here is the data that only admin can see');
});

app.get('/admin/deleteUser', (req, res) => {
  res.send('User deleted successfully');
});

app.listen(7777, () => {
  console.log('listening on port 7777');
});
