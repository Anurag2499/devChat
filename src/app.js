const express = require('express');

const app = express();

// app.get('/user', (req, res) => {
//   res.send({ firstname: 'Anurag', lastname: 'Singh' });
// });

// app.post('/user', (req, res) => {
//   //data saved in database
//   res.send('User created successfully in the database');
// });

// app.delete('/user', (req, res) => {
//   res.send('Delete successfully');
// });

app.use(
  '/test',
  (req, res, next) => {
    console.log('this is the 1st middleware');
    next();
    // res.send('this is the 1st response');
  },
  (req, res, next) => {
    console.log('this is the 2nd middleware');
    // res.send('this is the 2nd response');
    next();
  },
  (req, res, next) => {
    console.log('this is the 3rd middleware');
    // res.send('this is the 3rd response');
    next();
  },
  (req, res) => {
    console.log('this is the 4th middleware');
    res.send('this is the 4th response');
  }
);

app.listen(7777, () => {
  console.log('listening on port 7777');
});
