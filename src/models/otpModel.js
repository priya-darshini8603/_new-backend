const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
   expiresAt: {
    type: Date,
    required: true,
    // optional auto-delete after 5 mins
   
  },
});

// Prevent OverwriteModelError in dev (nodemon)
const OTPCollection = mongoose.models.OTPCollection || mongoose.model("OTPCollection", otpSchema);
module.exports = OTPCollection;

