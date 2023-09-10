const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // In a real application, use a proper password hashing library
  location: String,
  mobile: Number,
  dob: String,
  age: String,
  profilePic: String, // Base64 encoded profile picture
});

module.exports = mongoose.model('User', userSchema);
