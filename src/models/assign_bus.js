const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true // Ensure no duplicates
  },
  name: {
    type: String,
    
  },
  busNumber: {
    type: String,
    required: true,
    unique: true 
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true 

  },
  phoneNumber: {
    type: String,
    
    match: /^[6-9]\d{9}$/ ,// Optional: Indian phone number validation
    unique: true 
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const DriverCollection = mongoose.model("DriverCollection", driverSchema);
module.exports= DriverCollection;
