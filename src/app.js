const express = require('express');

const app = express();

app.get('/user', (req, res) => {
  res.send({ firstname: 'Anurag', lastname: 'Singh' });
});

app.post('/user', (req, res) => {
  //data saved in database
  res.send('User created successfully in the database');
});

app.delete('/user', (req, res) => {
  res.send('Delete successfully');
});

// app.use('/test', (req, res) => {
//   res.send('Hello from server.');
// });

app.listen(3000, () => {
  console.log('listening on port 3000');
});
