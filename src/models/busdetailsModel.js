const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: String,
  routeNumber: Number,
  totalSeats: Number,
  availableSeats: Number,
  pickupPoints: String, // or [String]
  lastServiceDate: Date,
  nextServiceDate: Date,
  image: Buffer, // optional: for storing bus image
  imageType: String
});

const busdetailsCollection = mongoose.model("busdetailsCollection", BusSchema);
 module.exports=busdetailsCollection;