const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'bus Incharge', 'student'], default: 'student' }
});

module.exports = mongoose.model('User', userSchema);
