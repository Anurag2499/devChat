const express = require('express');

const app = express();

app.use('/', (req, res) => {
  res.send('Namaste from the dashboard');
});
app.use('/hello', (req, res) => {
  res.send('Hello hello ');
});
app.use('/test', (req, res) => {
  res.send('Hello from server.');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
