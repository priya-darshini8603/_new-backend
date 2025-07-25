const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'student', 'busincharge', 'teacher'] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LogInCollection", loginSchema);
