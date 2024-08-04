const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  urls: [String] // An array of URLs
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
