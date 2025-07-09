const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePic: String, // store base64 or file path
});

module.exports = mongoose.model("Admin", adminSchema);
