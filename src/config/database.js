const mongoose = require('mongoose');

//username = anuragnode
//password = 9Zurkc3eBQvJ5nbB

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://anuragnode:9Zurkc3eBQvJ5nbB@namastenode.vxont.mongodb.net/devChat',
  );
};

module.exports = connectDB;
